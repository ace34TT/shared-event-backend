import { Request, Response } from "express";
import { firebase } from "../configs/firebase.configs";
const firestore = firebase.firestore();

export const handleSetUserSubscription = (req: Request, res: Response) => {
  try {
    const [docId, data] = [req.params.docId, req.body.data];
    if (!docId || !data) {
      return res.status(400).send("Invalid data , docId and data are required");
    }
    const docRef = firestore.collection("subscriptions").doc(docId);
    docRef.update(data);
    return res.status(200).send("document updated successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const handleDecreaseUserTokens = async (req: Request, res: Response) => {
  try {
    const [docId] = [req.params.docId];
    if (!docId) {
      return res.status(400).json({
        message: "docId is required",
      });
    }
    const docRef = firestore.collection("subscriptions").doc(docId);
    const docData = (await docRef.get()).data();
    if (!docData) {
      return res.status(400).json({
        message: "No such document!",
      });
    }
    if (docData.activeToken === 0) {
      return res.status(403).json({
        message: "No enough tokens",
      });
    }
    docRef.update({
      activeToken: docData.activeToken - 1,
    });
    return res.status(200).json({
      token: docData.activeToken - 1,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
