import { response } from "express";
import { logger } from "../application/logging.js";
import userService from "../services/user-service.js";

// format return data dari controller
// res.status(200).json({
//     status: 200,
//     data: result,
//     message: "Register Success"
// });

const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body);
        res.status(200).json({
            status: 200,
            data: result,
            message: "Register Success"
        });
    } catch (e) {
        next(e) // jika terdapat error, maka akan di lanjutkan ke middleware yang bertanggungjawab untuk menangani error yaitu web.use(errorMiddleware);
    }
};

const login = async (req, res, next) => {
    
    try {
        const {accessToken, refreshToken} = await userService.login(req.body);

        res.clearCookie('refreshToken');
        // ini digunakan supaya kita bisa membuat refresh token sebagai cookie, dimana attacker tidak bisa mendapatkanya dari terminal console, karena kita membuat nya di cookie.
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // ini dalam 1 hari ( 24 jam * 60 menit * 60 detik * 1000 milidetik )
            // secure: true, // ini digunakan hanya jika kita menggunakan https kalau dilocal comment aja
            sameSite: 'Lax', // Mengurangi risiko CSRF
        });

        res.status(200).json({
            status: 200,
            accessToken: accessToken
        });
    } catch (e) {
        next(e)
    }
}

const show = async (req, res, next) => {
    try {
        const result = await userService.show(req.body);

        return  res.status(200).json({
                    status: 200,
                    data: result,
                    message: "Success"
                });
    } catch (e) {
        next(e)
    }
}

const logout = async(req, res, next) => {
    // console.log(req.headers);
    // return
    const refreshToken2 = req.headers.cookie;
    const refreshToken = refreshToken2 && refreshToken2.split('=')[1];

    if(!refreshToken) {
        // return res.sendStatus(204); // 204 is no content
        return res.status(204).json({
            status: 204,
            message: "no content"
        });
    }
    const result = await userService.logout(refreshToken);

    if(result) {
        res.clearCookie('refreshToken');
        return res.status(200).json({
            status: 200,
            message: "log out succeed"
        });
    }

    return res.status(204).json({
        status: 204,
        message: "failed log out"
    });

}

export default {
    register,
    login,
    show,
    logout,
};
