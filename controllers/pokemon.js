import Pokemon from "../models/pokemon.js";


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
    console.log("HELLO")
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