require("dotenv").config();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH;

const client = require("twilio")(accountSid, authToken);

export default client;
