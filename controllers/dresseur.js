import Dresseur from './../models/dresseur.js';

export const getDresseur = async(req, res) => {
    const { id } = req.params
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
