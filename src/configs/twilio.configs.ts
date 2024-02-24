const accountSid = "ACfea9ff4d82ebcb53adc22265e793f8ab";
const authToken = "51ce4217a2ac10791144dfd28748000a";

const client = require("twilio")(accountSid, authToken);

export default client;
