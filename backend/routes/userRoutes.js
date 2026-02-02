import express, { application } from "express";
import { getAllUsers, updateUserRole } from "../controllers/userController.js";
import {protect} from '../middleware/authMiddleware.js';
import {authorizeRoles} from '../middleware/roleMiddleware.js'

const router = express.Router();

router.get("/allUsers", protect, authorizeRoles("superAdmin"), getAllUsers);
router.put("/:id/role", protect, authorizeRoles("superAdmin"), updateUserRole);

export default router;