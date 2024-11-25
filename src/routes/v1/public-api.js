// ini menggunakan v1/api

import express from "express";
import userController from "../../controllers/user-controller.js";


const publicRouter = new express.Router();
publicRouter.post('/api/register', userController.register)
publicRouter.post('/api/login', userController.login)
// publicRouter.post('/api/login', (req, res) => {
//     res.cookie('myCookie', 'cookieValue', {
//         httpOnly: true,  // Hanya bisa diakses oleh server, bukan JavaScript frontend
//         // secure: process.env.NODE_ENV === 'production',  // Hanya dikirimkan melalui HTTPS jika di production
//         maxAge: 1000 * 60 * 60 * 24,  // Expired dalam 1 hari
//         sameSite: "Lax"
//     });
//     res.send('Cookie sudah diset!');
// })

export default publicRouter;