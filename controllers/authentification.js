import dotenv from 'dotenv';
import Dresseur from './../models/dresseur.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config()

const authorizationCode = process.env.AUTHORIZATION_CODE
const acceptedClientId = process.env.ACCEPTED_CLIENT_ID
const acceptedClientSecret = process.env.ACCEPTED_CLIENT_SECRET


export const authorizationCodeCheck = async (req,res) => {
    const queryParams = req.query

    if(queryParams.client_id !== acceptedClientId){
        return res.status(401).send({error : "Application is not authorized"})
    }

    if(!queryParams.redirect_uri){
        return res.status(400).send({error : "No redirect URL provided"})
    }
    
    return res.redirect(`${queryParams.redirect_uri}?authorization_code=${authorizationCode}`)
}

export const authorizationCodeDisplay = async(req,res) => {
    const queryParams = req.query

    if(queryParams.authorization_code !== authorizationCode){
        return res.status(401).send({error : "Wrong Authorization code"})
    }

    return res.status(200).send("Here is your authorization code for login : " + queryParams.authorization_code)
}

export const generateAccessToken = async(req,res) => {
    const queryParams = req.query
    const { login, password } = req.body 

    if (queryParams.client_id !== acceptedClientId 
        || queryParams.client_secret !== acceptedClientSecret){
            return res.status(401).send({error : 'Application is not authorized'})
        }
    
    if (!queryParams.authorization_code){
        return res.status(400).send({error : 'No authorization code provided'})
    }

    const dresseur = await Dresseur.findOne({
        where: {
            login,          
        },
    })

    if (!dresseur){
        return res.status(404).send({error: 'User not found'})
    }

    if (!bcrypt.compareSync(password, dresseur.password)){
        return res.status(401).send({error: "Login or password is wrong"})
    }

    const accessToken = jwt.sign(
        {id: dresseur.id, scope: 'USER'}, 
        'ServerInternalPrivateKey', 
        {expiresIn: '30m'},)

    return res.status(200).send({accessToken, tokenType:'Bearer', expiresIn:'30m'})
}