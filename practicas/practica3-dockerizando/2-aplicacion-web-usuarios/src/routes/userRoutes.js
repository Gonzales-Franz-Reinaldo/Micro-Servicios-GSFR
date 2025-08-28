import { Router } from "express";
import {
    getUsers,
    showAddForm,
    addUser,
    updateUser,
    showEditForm,
    showUser,
    deleteUser
} from "../controllers/userController.js";

const router = Router();

router.get("/", getUsers);
router.get("/add", showAddForm);
router.post("/add", addUser);
router.get("/edit/:id", showEditForm);
router.post("/edit/:id", updateUser);
router.get("/view/:id", showUser);
router.get("/delete/:id", deleteUser);

export default router;