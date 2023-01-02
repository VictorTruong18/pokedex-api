import Exchange from "../models/exchange.js"

export const createExchangeRequest = async(req,res)=> {
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
        return res.status(500).send("Internal error")
    }
}

export const getAllExchangeRequest = async(req,res) => {
    try {
       const {id} = res.locals.requestor
       const trades = await Exchange.findAllDresseur(id)

       if(!trades){
        return res.status(404).send("Trade not found")
       }
       return res.status(200).send({trades})
    } catch(error){
        console.log(error)
        return res.status(500).send("Internal error")
    }
}