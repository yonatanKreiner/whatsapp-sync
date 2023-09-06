import { WebSocket } from 'ws';
import makeWASocket,
{
    DisconnectReason,
    fetchLatestBaileysVersion,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    Contact
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import Logger from './logger'


// for more information on connecting to whatsapp using @whiskeysockets/baileys go look in:
//  https://whiskeysockets.github.io/docs/tutorial-basics/implementing-data-store

const logger = Logger.child({})
logger.level = 'trace'

async function connectToWhatsApp(clientSocket: WebSocket, sessionID: string) {
    const { version, isLatest } = await fetchLatestBaileysVersion()

    const { state, saveCreds } = await useMultiFileAuthState(`sessions/${sessionID}`)

    const sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: false,
        mobile: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger)
        },
        msgRetryCounterCache: undefined,
        generateHighQualityLinkPreview: true,
        getMessage: undefined,
    });

    sock.ev.on("creds.update", async (m) => {
        await saveCreds()
    });
    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, receivedPendingNotifications } = update
        if (connection === 'close') {
            // reconnect if not logged out
            if ((lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
                connectToWhatsApp(clientSocket, sessionID)
            } else {
                console.log('Connection closed. You are logged out.')
            }
        }
        else {
            console.log('connection update', update)
            clientSocket.send(JSON.stringify({ connection, qr: update.qr, lastDisconnect }));
        }
    });
    sock.ev.on("contacts.upsert", async (contacts) => {
        sendContacts(contacts);
    });

    const sendContacts = async (contacts: Contact[]) => {
        const contactsWithPic = contacts.filter(x => !x.id.includes('g.us')).slice(0, 2500).map(async c => {
            const imageURL = await getProfilePic(c.id);

            return { ...c, imageURL }
        })

        const contactsWithPicResult = await Promise.all(contactsWithPic);
        console.log("got contacts!: " + contactsWithPicResult.length);
        clientSocket.send(JSON.stringify({ whatsappContacts: contactsWithPicResult }));
    }

    const getProfilePic = async (jid: string) => {
        try {
            const imageURL = await sock.profilePictureUrl(jid, 'preview', 1500);

            return imageURL;
        } catch (e) {
            console.log(e);
        }
    }

    return sock;
}

export { connectToWhatsApp };