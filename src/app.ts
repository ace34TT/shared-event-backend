import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import twilio from "./configs/twilio.configs";
const app = express();
app.use(
  cors({
    origin: true,
  })
);
app.use(bodyParser.json());

app.post("/", async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      message: "hello world",
    });
  } catch (error: any) {
    // console.log(error);
    console.trace(error);
    return res.status(500).send("internal error: " + error.message);
  }
});

app.post("/api/messages/send", async (req: Request, res: Response) => {
  try {
    const [url, contacts] = [req.body.url, req.body.contacts];
    if (!url || !contacts) {
      return res.status(400).json({
        message: "url and contacts are required",
      });
    }
    console.log(contacts);
    twilio.messages
      .create({
        body: `
          Hello , upload your photo here : 
          ${url}
        `,
        to: contacts,
        from: "+15169793385", // From a valid Twilio number
      })
      .then((message: { sid: any }) => console.log(message.sid));
    return res.status(200).json({
      message: "hello world",
    });
  } catch (error: any) {
    // console.log(error);
    console.trace(error);
    return res.status(500).send("internal error: " + error.message);
  }
});

export { app };
