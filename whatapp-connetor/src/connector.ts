import { WebSocket } from 'ws';
import makeWASocket,
{
    DisconnectReason,
    fetchLatestBaileysVersion,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    WAMessageKey,
    WAMessageContent
} from "@whiskeysockets/baileys";
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
        else{
            console.log('connection update', update)
            clientSocket.send(JSON.stringify({ connection, qr: update.qr, lastDisconnect }));   
        }
    });

    sock.ev.on("contacts.upsert", async (contacts) => {

        const contactsWithPic = contacts.slice(0, 2500).map(async c => {
            const imageURL = await getProfilePic(c.id);

            return { ...c, imageURL }
        })

        const contactsWithPicResult = await Promise.all(contactsWithPic);
        console.log("got contacts:");
        console.log(contactsWithPicResult);
        clientSocket.send(JSON.stringify({ whatsappContacts: contactsWithPicResult }));

        sock.logout("done retrieve images, and logout");
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