import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Dresseur from '../models/dresseur.js';

// CONTROLLERS
export const checkAuhtorization = async (req,res,next) => {
    const authorization = req.headers['authorization']

    if(!authorization){
        return res.status(401).send({error: 'You are not connected'})
    }

    const bearerToken = JSON.parse(authorization)

    if(Object.keys(bearerToken).length !== 3 || bearerToken['tokenType'] !== 'Bearer'){
        return res.status(401).send({error: 'Invalid token type'})
    }
    try {
        res.locals.requestor = await jwt.verify(bearerToken['accessToken'], 'ServerInternalPrivateKey')
    } catch(err){
        if(err instanceof jwt.TokenExpiredError){
            return res.status(401).send({error: 'Token expired'})

        }
        
        return res.status(500).send({error: 'Error with the JWT verification process'})
    }
    next()
}

export const isDresseurAdmin = async (req,res,next) => {
    const dresseur = await Dresseur.findById(res.locals.requestor.id)

    if(!dresseur){
        return res.status(404).send('User not found')
    }
    if(!Dresseur.hasRoles(dresseur, "ADMIN")) {
        return res.status(403).send({error : "You don't have the privilege to do this action"})
    }
    next()
}

