import Dresseur from './../models/dresseur.js';
import Pokemon from '../models/pokemon.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import config from './../config.js';

dotenv.config()

export const createDresseur = async(req, res) => {
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
    } catch(error){
        return res.status(500).send({"error" : err})
    }
}

export const getDresseur = async(req, res) => {
    const id = req.params.id || res.locals.requestor.id
    try {
        const dresseur = await Dresseur.findById(id)
        if(!dresseur){
            return res.status(404).send("Dresseur not found")
        }
        return res.status(200).send(dresseur)
    } catch(error){
        return res.status(500).send(error)
    }
}

export const modifyDresseur = async(req, res) => {
    const id = req.params.id || res.locals.requestor.id
    const patchedInformations = req.body
    try {
        const dresseur = await Dresseur.findById(id)
        if(!dresseur){
            return res.status(404).send('Dresseur not found')
        }
        if(!res.locals.requestor.isAdmin){
            if(patchedInformations.roles){
                return res.status(404).send({'error': 'As a USER you cant modify your priviledge'})
            }
        }
        const dresseurToUpdate = {...dresseur, ...patchedInformations}
        const updatedDresseur = await dresseur.update(dresseurToUpdate)
        return res.status(200).send(updatedDresseur)
    } catch (error){
        return res.status(500).send(error)
    }
}

export const deleteDresseur = async(req, res) => {
    const id = req.params.id || res.locals.requestor.id

    try {
        const dresseur = await Dresseur.findById(id)
        if(!dresseur){
            return res.status(404).send('Dresseur not found')
        }
        dresseur.destroy()
        return res.status(200).send({'Dresseur id erased' : id })
    } catch(error){
        return res.status(500).send(error)
    }
}

export const getDresseurPokemon = async(req, res) => {
    const id = req.params.dresseur_id || res.locals.requestor.id
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || process.env.PAGE_SIZE

    try {

        const pokemons = await Pokemon.getAllPokemon(id)

        const startIndex = (page - 1) * pageSize
        const endIndex = page * pageSize

        const previous = page > 1 ? `http://localhost:${config.NODE_APP_PORT}/dresseur/${id}/pokemon?page=${page-1}&pageSize=${pageSize}` : "No page";

        const results = pokemons.slice(startIndex, endIndex)

        // Count the number of pages it will take to show all the content depending on the page size
        const allThePages = Math.ceil(pokemons.length / pageSize) 

        const next = page < allThePages ? `http://localhost:${config.NODE_APP_PORT}/dresseur/${id}/pokemon?page=${page+1}&pageSize=${pageSize}` : "No page";


        return res.status(200).send({
            'Previous page ' : previous,
            'Next page ' : next,
            'All the pokemons' : results
         })
    } catch(error){
        return res.status(500).send(error)
    }
}
