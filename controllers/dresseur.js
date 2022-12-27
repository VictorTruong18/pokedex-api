import Dresseur from './../models/dresseur.js';

export const getDresseur = async(req, res) => {
    const { id } = req.params

    try {
        const dresseur = await Dresseur.findOne({
            where : {
                id
            }
        })
        if(!dresseur){
            return res.status(404).send("User not found")
        }
        return res.status(200).send(dresseur)
    } catch(error){
        return res.status(500).send(dresseur)
    }
}
