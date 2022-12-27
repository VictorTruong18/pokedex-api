import express from 'express';
import { Router } from 'express';
import Dresseur from './../models/dresseur.js';
import bcrypt from 'bcrypt';

const RegisterRouter = Router()

RegisterRouter.post('/',  async(req,res) => {

    const { firstName, lastName, login, password, age, roles} = req.body 
    try {
        // encrypt the password
        const encryptedPassword = bcrypt.hashSync(password, 5)
        // create the user and return his id
        const { id } = await Dresseur.create({
            firstName, 
            lastName,
            login,
            password: encryptedPassword,
            roles: roles || "USER",
            age,
        })
        return res.status(201).send({id})
    } catch(err){
        console.log(err)
        return res.status(500).send({"error" : err})
    }
})


export default RegisterRouter