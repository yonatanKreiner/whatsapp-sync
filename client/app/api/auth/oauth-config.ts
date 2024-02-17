import { google } from 'googleapis';

export const credentials = {
    client_id: process.env.GOOGLE_AUTH_CLIENT_ID || "524139804888-5pmtubbjouds99tioias0b6amipak52f.apps.googleusercontent.com",
    client_secret: process.env.GOOGLE_AUTH_CLIENT_SECRET || "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",
    redirect_uri: process.env.REDIRECT || "http://localhost:3000/api/auth/comeback",
    stripe_key: 'sk_test_51OksBgCUYZydRdZSDFi8BAyYmT8QlWhwWq9HkyguF2tYQVrAy4wA16KjSgfL06SSAhfCW91M79Zws0AZw1XOhFoB00sTa9gNBW'
}

export const oauth2Client = new google.auth.OAuth2({
    clientId: credentials.client_id,
    clientSecret: credentials.client_secret,
    redirectUri: credentials.redirect_uri,
});

export const scopes = ['https://www.googleapis.com/auth/contacts'];
