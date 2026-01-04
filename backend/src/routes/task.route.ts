import { Router } from "express";
import * as taskController from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Protect all task routes with authentication
router.use(authMiddleware);

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
