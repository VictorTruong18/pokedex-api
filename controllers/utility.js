import config from './../config.js';
import dotenv from 'dotenv';
import Dresseur from './../models/dresseur.js';
import bcrypt from 'bcrypt';

dotenv.config()

export const paginate = (id, results, page, pageSize) => {
    const startIndex = (page - 1) * pageSize
    const endIndex = page * pageSize
    const appPort = config.NODE_ENV == "local" ? config.NODE_APP_PORT : 80
    const previous = page > 1 ? `http://localhost:${appPort}/dresseur/${id}/pokemon?page=${page-1}&pageSize=${pageSize}` : "No page";
    const result = results.slice(startIndex, endIndex)
    // Count the number of pages it will take to show all the content depending on the page size
    const allThePages = Math.ceil(results.length / pageSize) 
    const next = page < allThePages ? `http://localhost:${appPort}/dresseur/${id}/pokemon?page=${page+1}&pageSize=${pageSize}` : "No page";
    return {
        results: result,
        next: next,
        previous: previous
    }
}

export const createAdminUser = async () => {
    try {
        const encryptedPassword = bcrypt.hashSync(process.env.ADMIN_USER_PASSWORD, 5)
        const [dresseur, created] = await Dresseur.findOrCreate({
            where: { login: process.env.ADMIN_USER_LOGIN},
            defaults: {
                firstName: process.env.ADMIN_USER_FIRST_NAME,
                lastName: process.env.ADMIN_USER_LAST_NAME,
                login: process.env.ADMIN_USER_LOGIN,
                password: encryptedPassword,
                roles: process.env.ADMIN_USER_ROLES,
                age: process.env.ADMIN_USER_AGE,
            }
        });
        if(created){
            console.log("ADMIN USER succesfully created")
        }else {
            console.log("ADMIN USER already exist")
        }
        
    } catch(error){
        console.log(error)
    }
}

