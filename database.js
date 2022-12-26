import { Sequelize } from 'sequelize'
import config from './config.js';


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

(async () => {
    try {
        console.log("Config : " , config)
        await Database.authenticate()
        await Database.sync()
        console.log('Database is up')
    } catch(error){
        console.error(error)
    }
})()

export default Database