import { Router } from "express";
import { getAccessToken, userAuth } from "../controllers/user.controllers.js";

const router = Router();


router.route("/auth").get(userAuth);
router.route("/oauth-callback").get(getAccessToken);


export default router;