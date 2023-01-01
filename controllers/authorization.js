import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Dresseur from '../models/dresseur.js';
import Pokemon from '../models/pokemon.js';

// CONTROLLERS
export const checkAuthorization = async (req,res,next) => {
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
    res.locals.requestor.isAdmin = false
    if(!dresseur){
        return res.status(404).send('User not found')
    }
    if(Dresseur.hasRoles(dresseur, "ADMIN")) {
        res.locals.requestor.isAdmin = true
    } 
    next()
}

// the id specified on the param belongs to the actual user
export const isDresseurAccount = async (req,res,next) => {
    const { id } = req.params
    if(id != res.locals.requestor.id && !res.locals.requestor.isAdmin){
        return res.status(403).send({error : "You don't have the privilege to do this action"})
    }

    next()
}

// the owner of the requested pokemon is the logged in Dresseur
export const isDresseurPokemon = async(req,res,next) => {
    const { id } = req.params
    const { dresseurId } = await Pokemon.findById(id)
    if(dresseurId != res.locals.requestor.id && !res.locals.requestor.isAdmin){
        return res.status(403).send({error : "You don't have the privilege to modify a Pokemon that doesn't belong to you"})
    }
    next()
}

// the requestor want to modify the owner of a pokemon
export const isAllowedToModifyOwner = async(req,res,next) => {
    const {dresseurId} = req.body
    if(!res.locals.requestor.isAdmin){
        if(dresseurId){
            return res.status(404).send({'error': 'As a USER you cant modify the owner of a pokemon'})
        }
    }else { // is the dresser existant
        const dresseur = await Dresseur.findById(dresseurId)
        if(!dresseur){
            return res.status(404).send('The owner you want to attribute this pokemon does not exist')
        }
    }
    next()
}

export const isAllowedToCreateDresseur = async(req,res,next) => {
    const authorization = req.headers['authorization']
    if(!authorization){
        next()
    } else {
        const bearerToken = JSON.parse(authorization)
        if(Object.keys(bearerToken).length !== 3 || bearerToken['tokenType'] !== 'Bearer'){
            return res.status(401).send({error: 'Invalid token type'})
        }
        try {
            const parsedDresseur = await jwt.verify(bearerToken['accessToken'], 'ServerInternalPrivateKey')
            const dresseur = await Dresseur.findById(parsedDresseur.id)
            if(!dresseur){
                return res.status(404).send('User not found')
            }
            if(Dresseur.hasRoles(dresseur, "ADMIN")) {
                next()
            } else {
                return res.status(404).send({error: 'You need to be ADMIN to create another Dresseur'})
            }   
        } catch(err){
            if(err instanceof jwt.TokenExpiredError){
                return res.status(401).send({error: 'Token expired'})
    
            }
            return res.status(500).send({error: 'Error with the JWT verification process'})
        }
    }

}