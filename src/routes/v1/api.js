import express from "express";
import userController from "../../controllers/user-controller.js";
import { authMiddleware } from "../../middleware/auth-middleware.js";


const userRouter = new express.Router();
userRouter.use(authMiddleware); // disini token diverifikasi

// user API
// userRouter.get('/api/users', userController.show)
// userRouter.delete('/api/logout', userController.logout)
userRouter.get('/users', userController.show)
userRouter.delete('/logout', userController.logout)

export default userRouter;