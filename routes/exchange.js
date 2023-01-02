import express from 'express';
import { Router } from 'express';
import Dresseur from '../models/dresseur.js';
import Exchange from '../models/exchange.js';
import Pokemon from '../models/pokemon.js';
import { checkAuthorization } from '../controllers/authorization.js';

const ExchangeRouter = Router()

// Get all the exchanges
ExchangeRouter.get("/")
// Create one exchange proposition
ExchangeRouter.post("/", checkAuthorization, async(req,res) => {
    try{
        const initiator = await Dresseur.findById(res.locals.requestor.id)
        const recipient = await Dresseur.findById(req.body.recipient)
        if(!initiator || !recipient){
            return res.status(400).send({error: "Dresseurs specified don't exist"})
        }
       
        const pokemonsInitiator = req.body.pokemonInitiator
        const pokemonRecipient = req.body.pokemonRecipient
        if(Array.isArray(pokemonsInitiator) && Array.isArray(pokemonRecipient)){
            if(pokemonsInitiator.length != null){
                for(let pokemonId of pokemonsInitiator){
                    const pokemon = await Pokemon.findById(pokemonId)
                    if(!pokemon){
                        return res.status(400).send({error : "Some of the pokemons specified do not exist"})
                    }
                    if(pokemon.dresseurId != initiator.id){
                        return res.status(400).send({error : "You can't exchange pokemon that don't belong to you"})
                    }
                }
               
            } 
            if(pokemonRecipient.length != null){
                for(let pokemonId of pokemonRecipient){
                    const pokemon = await Pokemon.findById(pokemonId)
                    if(!pokemon){
                        return res.status(400).send({error : "Some of the pokemons specified do not exist"})
                    }
                    if(pokemon.dresseurId != recipient.id){
                        return res.status(400).send({error : "Some of the pokemons specified don't belong to the recipient"})
                    }
                }
            }    
        }   else {
            return res.status(400).send("Send arrays of integers for the pokemons you want to trade")
        }

        const pokemonInitiatorString = pokemonsInitiator.join(".")
        const pokemonRecipientString = pokemonRecipient.join(".")

        const trade = await Exchange.create({
            initiator : initiator.id,
            recipient: recipient.id,
            pokemonInitiator: pokemonInitiatorString,
            pokemonRecipient: pokemonRecipientString
        })
        if(!trade){
            return res.status(404).send("Trade not found")
        }
        return res.status(200).send({trade})
    }catch(error){
        console.log(error)
    
    }
})
// Accepte the exchange 
ExchangeRouter.get("/accepted:id")
ExchangeRouter.get("/refuse:id")

export default ExchangeRouter