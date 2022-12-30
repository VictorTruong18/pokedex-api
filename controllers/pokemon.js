import Pokemon from "../models/pokemon.js";

export const getPokemon = async(req, res) => {
    const { id } = req.params 

    try {
        const pokemon = await Pokemon.findById(id)
        if(!pokemon){
            return res.status(404).send('Pokemon was not found')
        }
        return res.status(200).send(pokemon)
    }catch(error){
        return res.status(500).send({"error" : err})
    }
}


export const createPokemon = async(req,res) => {
    const { species, name, level, gender, size, weight, isChromatic } = req.body
    if(!res.locals.requestor.id){
        return res.status(404).send({"error" : "You need to be connect yourself"})
    }
    try {
        const pokemon = await Pokemon.createOne(species, name, level, gender, size, weight, isChromatic,res.locals.requestor.id)
        return res.status(201).send({"Pokemon just created" : pokemon})
    } catch(err){
        return res.status(500).send({"error" : err})
    }
}

export const modifyPokemon = async(req,res) => {
    const pokemonId = req.params.id
    const patchedInformations = req.body
    try {
        const pokemon = await Pokemon.findByPk(pokemonId)
        if(!pokemon){
            return res.status(404).send("Pokemon does not exist")
        }
        const pokemonToUpdate = {...pokemon, ...patchedInformations}
        const updatedPokemon = await pokemon.update(pokemonToUpdate)
        return res.status(200).send(updatedPokemon)
    }catch(err){
        return res.status(500).send(err)
    }   
}

export const deletePokemon = async(req,res)=> {
    const id = req.params.id 

    try {
        const pokemon = await Pokemon.findById(id)
        if(!pokemon){
            return res.status(404).send('Pokemon not found verify your access token')
        }
        pokemon.destroy()
        return res.status(200).send({'Pokemon id erased' : id })
    } catch(error){
        return res.status(500).send(error)
    }
}