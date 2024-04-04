import { Request, Response } from "express";
import { firebase } from "../configs/firebase.configs";
import { Query } from "@google-cloud/firestore";

const firestore = firebase.firestore();

export const insertDataHandler = async (req: Request, res: Response) => {
  try {
    const [collection, data] = [req.body.collection, req.body.data];
    if (!collection || !data) {
      throw new Error("Invalid data");
    }
    const docRef = await firestore.collection(collection).add(data);
    console.log("document inserted with id : ", docRef.id);
    return res.status(200).json({
      id: docRef.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
export const findDataHandler = async (req: Request, res: Response) => {
  try {
    console.log("finding");
    const [collection, conditions] = [req.body.collection, req.body.conditions];
    if (!collection) {
      throw new Error("Invalid data");
    }
    let query: Query = firestore.collection(collection);
    conditions.forEach((condition: any) => {
      query = query.where(condition.field, condition.operator, condition.value);
    });
    const snapshot = await query.get();
    const results: any[] = [];
    snapshot.forEach((doc) => {
      results.push({ _id: doc.id, ...doc.data() });
    });
    // console.log(results);
    // Send the results as a response
    res.status(200).json({
      results: results,
    });
  } catch (error) {
    console.error("Error in findDataHandler: ", error);
    res.status(500).send(error);
  }
};
export const updateDataHandler = async (req: Request, res: Response) => {
  try {
    console.log("updating");
    const [collection, docId, data] = [
      req.body.collection,
      req.body.docId,
      req.body.data,
    ];
    console.log(collection, docId, data);
    const docRef = firestore.collection(collection).doc(docId);
    // Update the document
    await docRef.update(data);
    return res.status(200).send("document updated successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
export const findDocumentById = async (req: Request, res: Response) => {
  try {
    const [collection, documentId] = [req.body.collection, req.body.docId];
    console.log(collection, documentId);
    const docRef = firestore.collection(collection).doc(documentId);
    const doc = await docRef.get();
    console.log(doc.exists);
    if (doc.exists) {
      return res.status(200).json({
        data: doc.data(),
      });
    } else {
      console.log("document not found");
      return res.status(404).json({
        message: "No such document!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
export const deleteDocumentByIdHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const [collection, docId] = [req.body.collection, req.body.docId];
    const docRef = firestore.collection(collection).doc(docId);
    docRef.delete();
    return res.status(200).send("document deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

//
export const checkEventHandler = async (req: Request, res: Response) => {
  try {
    console.log("starting the process");

    const doc = await firestore
      .collection("events")
      .doc(req.body.eventId)
      .get();
    console.log("done");

    if (doc.exists && doc.data()!.guestCode === req.body.guestCode) {
      return res.status(200).json({
        status: true,
      });
    } else {
      console.log("No such document or doesn't meet the criteria!");
      return res.status(404).json({
        message: "No such document or doesn't meet the criteria!",
      });
    }
  } catch (error) {
    console.error("Error in checkEvent: ", error);
    res.status(500).send(error);
  }
};
