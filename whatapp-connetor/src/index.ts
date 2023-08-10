import makeWASocket, { DisconnectReason, fetchLatestBaileysVersion, useMultiFileAuthState, makeCacheableSignalKeyStore, WAMessageKey, WAMessageContent } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import Logger from './logger'

const logger = Logger.child({})
logger.level = 'trace'

async function connectToWhatsApp() {
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
        // ignore all broadcast messages -- to receive the same
        // comment the line below out
        // shouldIgnoreJid: jid => isJidBroadcast(jid),
        // implement to handle retries & poll updates
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
                connectToWhatsApp()
            } else {
                console.log('Connection closed. You are logged out.')
            }
        }

        console.log('connection update', update)
    });
    sock.ev.on("messages.upsert", async (m) => {
        console.log(JSON.stringify(m, undefined, 2));

        console.log("replying to", m.messages[0].key.remoteJid);
        await sock.sendMessage(m.messages[0].key.remoteJid!, {
            text: "Hello there!",
        });
    });

    return sock;
}


// run in main file
connectToWhatsApp();