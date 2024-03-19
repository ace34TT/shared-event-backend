import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import twilio from "./configs/twilio.configs";
import { FirebaseRoutes } from "./routes/firebase.routes";
import { sendMail } from "./configs/nodemail.configs";
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

app.use("/api/firebase", FirebaseRoutes);
app.post("/api/messages/send", async (req: Request, res: Response) => {
  try {
    const [contacts, emails, host, eventName, place, date, eventId, eventLink] =
      [
        req.body.contacts,
        req.body.emails,
        req.body.hostName,
        req.body.name,
        req.body.place,
        req.body.date,
        req.body.eventId,
        req.body.url,
      ];

    console.log(req.body);

    if (
      !host ||
      !eventName ||
      !place ||
      !date ||
      !eventId ||
      !eventLink ||
      !contacts ||
      !emails
    ) {
      return res.status(400).json({
        message: "url and contacts are required",
      });
    }

    console.log("next step");

    contacts.forEach((contact: string) => {
      try {
        twilio.messages
          .create({
            body: `
 Hello , 

You have been invited by ${host} to attend ${eventName} at ${place} the ${date}
Here you guest code : ${eventId}
App's link : ${eventLink} 

See you there .
        `,
            to: contact,
            from: "+18443875819",
          })
          .then((message: { sid: any }) => console.log(message.sid))
          .catch((error: any) => console.log(error));
      } catch (error: any) {
        throw new Error(error.message);
      }
    });
    emails.forEach((email: string) => {
      sendMail(email, { host, eventName, place, date, eventId, eventLink });
    });
    return res.status(200).json({
      message: "hello world",
    });
  } catch (error: any) {
    console.trace(error);
    return res.status(500).send("internal error: " + error.message);
  }
});

export { app };
