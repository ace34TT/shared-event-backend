import express from "express";
import {
  handleDecreaseUserTokens,
  handleSetUserSubscription,
} from "../controllers/token.controllers";

const router = express.Router();

router.put("/:docId", handleSetUserSubscription);
router.put("/tokens/decrease/:docId", handleDecreaseUserTokens);

export { router as SubscriptionRoutes };
