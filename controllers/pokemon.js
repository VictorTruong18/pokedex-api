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