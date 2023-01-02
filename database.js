import { Sequelize } from 'sequelize'
import config from './config.js';
import { createAdminUser } from './controllers/utility.js';


const Database = new Sequelize(
    config.DATABASE_NAME, // database name
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
            console.log("Database login unsuccessful retrying in 10 seconds - waiting for the db to be fully up")
            wait(10000)
        }
    }
})()



export default Database