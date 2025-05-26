import { Router } from "express";
import auth from "../middlewares/auth.js";
import { followControllers } from "../controllers/followControllers/followController.js";

const router = Router();

router.post("/save", auth, followControllers.save);
router.delete("/unfollow/:id", auth, followControllers.unfollow);
router.get("/following/:id", auth, followControllers.followingList);
router.get("/followers/:id", auth, followControllers.followers);

export default router;
