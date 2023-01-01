import { Sequelize } from 'sequelize'
import config from './config.js';
import { createAdminUser } from './controllers/utility.js';


const Database = new Sequelize(
    "POKEDEX_VICTOR", // database name
    config.DATABASE_USERNAME, // username
    config.DATABASE_PASSWORD, // password
    {
        host: config.DATABASE_HOST,
        port: 3306,
        dialect: 'mysql',
    },
);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve,ms));

(async () => {
    while(true){
        try {
            console.log("Config : " , config)
            await Database.authenticate()
            await Database.sync()
            await createAdminUser()
            console.log('Database is up')
            break;
        } catch(error){
            console.log("Database login unsuccessful retrying in 5 seconds")
            console.error(error)
            wait(5000)
        }
    }
})()



export default Database