import { Router } from "express";
import { publicationController } from "../controllers/publicationControllers/publicationController.js";
import { likesController } from "../controllers/likes/likesController.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/save", auth, publicationController.save);
router.get("/detail/:id", auth, publicationController.detail);
router.delete("/remove/:id", auth, publicationController.remove);
router.get("/user/:id/:page?", auth, publicationController.user);
router.post("/upload/:id", auth, publicationController.upload);
router.get("/feed/:page?", auth, publicationController.feed);
router.put("/edit/:id", auth, publicationController.editPublication);
router.post("/comment/:publication_id", auth, publicationController.addComment);
router.get("/comments/:publication_id", auth, publicationController.getComments);
router.delete("/:publication_id/comments/:comment_id", auth, publicationController.deleteComment);

// Rutas para etiquetas
router.post("/:id/tag/:userId", auth, publicationController.addTag);
router.delete("/:id/tag/:userId", auth, publicationController.removeTag);
router.get("/tagged/:userId/:page?", auth, publicationController.taggedPublications);
router.get("/search-users", auth, publicationController.searchUsers);

router.post("/report/:id", auth, publicationController.reportPublication);
router.delete("/revert-report/:publicationId/:reportId", auth, publicationController.revertReport);
router.get("/reported-publications", auth, publicationController.getReportedPublications);
router.get("/reported-users", auth, publicationController.getUsersWithReports);

router.post("/like/:publication_id", auth, likesController.newLike);
router.delete("/like/:publication_id", auth, likesController.unlike);
router.get("/likes/:publication_id", auth, likesController.getLikes);
router.get("/likes/user/:user_id/:page?", auth, likesController.getUserLikes);

export default router;