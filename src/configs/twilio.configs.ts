const accountSid = "ACfea9ff4d82ebcb53adc22265e793f8ab";
const authToken = "4f7b2608ca3081568adb95af5d24f16d";

const client = require("twilio")(accountSid, authToken);

export default client;
