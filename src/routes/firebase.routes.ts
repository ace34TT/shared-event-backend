import express from "express";
import {
  checkEventHandler,
  deleteDocumentByIdHandler,
  findDataHandler,
  findDocumentById,
  insertDataHandler,
  updateDataHandler,
} from "../controllers/firebase.controllers";

const router = express.Router();

router.post("/insert-document", insertDataHandler);
router.post("/find-documents", findDataHandler);
router.post("/update-document", updateDataHandler);
router.post("/find-document", findDocumentById);
router.post("/delete-document", deleteDocumentByIdHandler);

//
router.post("/check-event", checkEventHandler);
export { router as FirebaseRoutes };
