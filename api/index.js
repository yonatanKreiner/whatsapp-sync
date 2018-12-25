const express = require("express");

const log = require('./log');
const whatsapp = require('./whatsapp');
const googleContacts = require('./googleContacts');

const server = express();

server.set('port', process.env.PORT || 8080);
server.set('view engine', 'ejs');
server.set('views', __dirname + '/client/views');

server.use(express.static(__dirname + "/client"));

process.on('unhandledRejection', (err) => {
	log('unhandledRejection', err);
})

let userContacts = {};

async function updatePhotos(id, contacts, accessToken) {
	try	{
		userContacts[id] = {
			parsedContacts: googleContacts.parseContacts(contacts),
			failedContacts: []
		};
	
		for (let index = 0; index < userContacts[id].parsedContacts.length; index++) {
			userContacts[id].index = index;
			let contact = userContacts[id].parsedContacts[index];
			const photo = await whatsapp.getPhoto(id, contact.phone);

			if (photo) {
				contact.photo = photo;

				if (contact.photo !== 404 && contact.photo !== 401) {
					await googleContacts.updatePhoto(contact, accessToken);
				} else {
					userContacts[id].failedContacts.push(contact);
				}
			}
		}
	} catch (err) {
		log('error updating photos', err);
	} finally {
		userContacts[id] = 'finished';
	}
}

server.get('/progress', async (req, res, next) => {
	try {
		const id = req.query.id;

		if (userContacts.hasOwnProperty(id)) {
			if(userContacts[id] === 'finished') {
				await whatsapp.disconnect(id);
				res.status(200).send({message: 'finished'});
			} else {
				const percentage = parseInt(userContacts[id].index / userContacts[id].parsedContacts.length * 100)
				res.json({percentage});
			}
		} else {
			res.status(400).send('no such user');
		}
	} catch (err) {
		next(err);
	}
});

server.get('/contacts', async (req, res, next) => {
	try {
		res.redirect(googleContacts.getUrl(req.query.id));
	} catch (err) {
		next(err);
	}
});

server.get('/authorized', async (req, res, next) => {
	try {
		const accessToken = await googleContacts.getAccessToken(req.query.code);
	
		if (accessToken) {
			res.redirect(`/sync?user=${req.query.state}&token=${accessToken}`);
		} else {
			res.json('fail');
		}
	} catch (err) {
		next(err);
	}
});

server.get('/sync', async (req, res, next) => {
	try {
		const user = req.query.user,
			token = req.query.token;

		if (userContacts.hasOwnProperty(user) && userContacts[user] !== 'finished') {
			res.render('finish', {user});
		} else {
			googleContacts.getContacts(token, (err, contacts) => {
				if (err) {
					res.status(500).send('could not get contacts');
				} else {
					updatePhotos(user, contacts, token);
					res.render('finish', {user});
				}
			});
		}
	} catch (err) {
		next(err);
	}
});

server.get('/connect', async (req, res, next) => {
	try {
		const qrcode = await whatsapp.connect(req.query.id);

		if (qrcode) {
			res.send(qrcode);
		} else {
			res.status(500).send('Error while refreshing QR code');
		}
	} catch (err) {
		next(err);
	}
});

server.get('/refresh', async (req, res, next) => {
	try {
		const qrcode = await whatsapp.refreshQR(req.query.id);

		if (qrcode) {
			res.send(qrcode);
		} else {
			res.status(500).send('error while refreshing QR code');
		}
	} catch (err) {
		next(err);
	}
});

server.use((err, req, res, next) => {
	log('an error has occured', err);
	res.status(500).send('internal server error');
})

server.listen(server.get('port'), function() {
	console.log(`whatsapp-photo-sync HTTP server listening on port ${server.get('port')}`);
});
