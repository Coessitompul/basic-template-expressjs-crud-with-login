
import { validate } from "../validation/validation.js";
import { 
    registerUserValidation, 
    loginUserValidation 
} from "../validation/user-validation.js";
import { prismaClient } from "../application/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {v4 as uuid} from "uuid";
import { ResponseError } from "../error/response-error.js";

const register = async (request) => {
    // lakukan validasi, 
    const user = validate(registerUserValidation, request);

    // pastikan nama tablenya sudah sesuai dengan yang di schema.prisma yaitu users
    const countUser = await prismaClient.users.count({
        where: {
            email: user.email
        }
    });

    // jika sudah terdapat data yang sama maka return data sudah ada
    if(countUser === 1){
        throw new ResponseError(400, "Username already exist");
    }
    
    if(user?.password !== user?.confirmPassword){
        throw new ResponseError(400, "Password and Confirm Password must be the same");
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(user.password, salt);

    let saveUser = await prismaClient.users.create({
                            data: {
                                users_uuid: uuid().toString(),
                                name: user.name,
                                email: user.email,
                                password: hashPassword,
                            },
                            select: {
                                name: true,
                                email: true
                            }
                        }); 

    return saveUser; 
}

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.users.findFirst({
        where: {
            email: loginRequest.email
        },
        select: {
            id: true,
            email: true,
            name: true,
            password: true
        }
    });

    if(!user) {
        throw new ResponseError(401, "You don't have account!");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user?.password);

    // ketika emailnya tidak ada
    if(!user) {
        throw new ResponseError(401, "Username or password wrong");
    }
    // ketika passwordnya tidak match
    if(!isPasswordValid) {
        throw new ResponseError(401, "Username or password wrong");
    }

    console.log(request, "hahahai")

    const userId = user.id;
    const email = user.email;
    const name = user.name;
    // const lastname = user.lastname;
    const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '2d'
    });

    const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    });

    await prismaClient.users.update({
        data: {
            refresh_token: refreshToken
        },
        where: {
            id: userId
        }
    });

    return {
        accessToken,
        refreshToken
    };
}

const show = async (request) => {
    const dataAllUsers =  await prismaClient.users.findMany({
        select: {
            id: true,
            users_uuid: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true
        }
    });

    if(!dataAllUsers) return [];

    return dataAllUsers;
    
}

const logout = async (request) => {
    
    const refreshToken = request;

    const user = await prismaClient.users.findMany({
        where: {
            refresh_token: refreshToken
        }
    });

    if(!user[0]) {
        throw new ResponseError(204, "No content");
    }

    const userId = user[0].id;
    await prismaClient.users.update({
        data: {
            refresh_token: null
        },
        where: {
            id: userId
        }
    });

    return true;
}

export default {
    register,
    login,
    show,
    logout,
}