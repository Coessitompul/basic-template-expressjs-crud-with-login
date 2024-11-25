import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import publicRouter from "../routes/v1/public-api.js"
import {errorMiddleware} from "../middleware/error-middleware.js";
import userRouter from "../routes/v1/api.js";

export const web = express();
web.use(express.json());
web.use(cors({ 
    credentials: true, 
    origin:'http://localhost:5173' 
}));
web.use(cookieParser());
web.use('/v1', publicRouter); // ini untuk routes, jadi setiap hit api dengan di awali /v1 maka akan menggunakan publicRouter
web.use('/v1/api/admin', userRouter);
web.use(errorMiddleware);