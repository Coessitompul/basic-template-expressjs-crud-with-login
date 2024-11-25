import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // jika user tidak mengirimkan tokennya maka variabel tokennya juga akan kosong tetapi jika user mengirimkan tokennya maka akan kita split dan akan kita ambil tokennya
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) {
        return res.json({
            status: 401,
            message: "Unauthorized"
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403); // status forbidden
        req.email = decoded.email; // data ini yang akan diteruskan ke controller
        next();
    })
}

