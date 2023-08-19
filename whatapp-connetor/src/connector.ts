import { WebSocket } from 'ws';
import makeWASocket, { DisconnectReason, fetchLatestBaileysVersion, useMultiFileAuthState, makeCacheableSignalKeyStore, WAMessageKey, WAMessageContent } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import Logger from './logger'

const logger = Logger.child({})
logger.level = 'trace'

async function connectToWhatsApp(clientSocket: WebSocket) {
    const { version, isLatest } = await fetchLatestBaileysVersion()

    const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info')

    const sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: false,
        mobile: false,
        auth: {
            creds: state.creds,
            /** caching makes the store faster to send/recv messages */
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        msgRetryCounterCache: undefined,
        generateHighQualityLinkPreview: true,
        getMessage: undefined,
    });

    sock.ev.on("creds.update", async (m) => {
        await saveCreds()
    });
    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            // reconnect if not logged out
            if ((lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
                connectToWhatsApp(clientSocket)
            } else {
                console.log('Connection closed. You are logged out.')
            }
        }

        console.log('connection update', update)
        clientSocket.send(JSON.stringify({ connection, qr: update.qr, lastDisconnect }));
    });

    sock.ev.on("contacts.upsert", async (contacts) => {
        console.log("got contacts:");

        const contactsWithPic = await contacts.map(async c => {
            const imageURL = await getProfilePic(c.id);

            return { ...c, imageURL }
        })

        console.log(contactsWithPic);
        clientSocket.send(JSON.stringify({ whatsappContacts: contactsWithPic }));
    });

    const getProfilePic = async (jid: string) => {
        try {
            const imageURL = await sock.profilePictureUrl(jid);

            return imageURL;
        } catch (e) {
            console.log(e);
        }
    }

    return sock;
}

export { connectToWhatsApp };