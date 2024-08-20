import { Router } from "express";
import { createUserProfile, getAccessToken, getUserProfile, userAuth } from "../controllers/user.controllers.js";

const router = Router();


router.route("/auth").get(userAuth);
router.route("/oauth-callback").get(getAccessToken);
router.route("/createUser/:token").post(createUserProfile);
router.route("/getUser/:token").get(getUserProfile);

export default router;