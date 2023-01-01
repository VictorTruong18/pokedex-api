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

    
    try {
        const bearerToken = authorization.split(' ')

        if(bearerToken.length !== 2 || bearerToken[0] !== 'Bearer'){
            return res.status(401).send({error: 'Invalid token type'})
        }
        res.locals.requestor = await jwt.verify(bearerToken[1], 'ServerInternalPrivateKey')
    } catch(err){
        if(err instanceof jwt.TokenExpiredError){
            return res.status(401).send({error: 'Token expired'})

        }
        console.log(err)
        
        return res.status(500).send({error: 'Error with the JWT verification process'})
    }
    next()
}

export const isDresseurAdmin = async (req,res,next) => {
    try{
        const dresseur = await Dresseur.findById(res.locals.requestor.id)
        res.locals.requestor.isAdmin = false
        if(!dresseur){
            return res.status(404).send('User not found')
        }
        if(Dresseur.hasRoles(dresseur, "ADMIN")) {
            res.locals.requestor.isAdmin = true
        } 
    } catch(err){
        return res.status(500).send({error: err})
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
   
    try { 
        const { id } = req.params
        const { dresseurId } = await Pokemon.findById(id)
        if(dresseurId != res.locals.requestor.id && !res.locals.requestor.isAdmin){
            return res.status(403).send({error : "You don't have the privilege to modify a Pokemon that doesn't belong to you"})
        }
    } catch(err){
        return res.status(500).send({error: err})
    }
    next()
}

// the requestor want to modify the owner of a pokemon
export const isAllowedToModifyOwner = async(req,res,next) => {
    const {dresseurId} = req.body
    try{
        if(!res.locals.requestor.isAdmin){
            if(dresseurId){
                return res.status(404).send({'error': 'As a USER you cant modify the owner of a pokemon'})
            }
        }else { // is the dresser existant
            if(dresseurId){
                const dresseur = await Dresseur.findById(dresseurId)
                if(!dresseur){
                    return res.status(404).send('The owner you want to attribute this pokemon does not exist')
                }
            }
        }
    }
    catch(err){
        return res.status(500).send({error : err})
    }
    next()
}

export const isAllowedToCreateDresseur = async(req,res,next) => {
    const authorization = req.headers['authorization']
    if(!authorization){
        next()
    } else {
        try {
          

            const bearerToken = authorization.split(' ')

            if(bearerToken.length !== 2 || bearerToken[0] !== 'Bearer'){
                return res.status(401).send({error: 'Invalid token type'})
            }
            const parsedDresseur = await jwt.verify(bearerToken[1], 'ServerInternalPrivateKey')

           
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