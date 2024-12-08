import { Router } from "express";
import auth from "../middlewares/auth.js";
import {followControllers} from "../controllers/followControllers/followController.js";

const router = Router();

//Definir las rutas
router.post("/save", auth, followControllers.save);
router.delete("/unfollow/:id", auth, followControllers.unfollow);
router.get("/following/:id?/:page?", auth, followControllers.followingList);
router.get("/followers/:id?/:page?", auth, followControllers.followers);



export default router;