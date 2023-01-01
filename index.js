import express from 'express';
import config from './config.js';
import yaml from 'js-yaml';

// Models import 
import Dresseur from './models/dresseur.js';
import Pokemon from './models/pokemon.js';

// Routes import
import RegisterRouter from './routes/register.js';
import AuthentificationRouter from './routes/authentification.js';
import DresseurRouter from './routes/dresseur.js';
import PokemonRouter from './routes/pokemon.js';

// Import swagger
import swaggerUI from 'swagger-ui-express'

import { readFile } from 'fs/promises';
const swaggerDocument =
yaml.safeLoad(await readFile(
    new URL('./swagger.yaml', import.meta.url)))

// const swaggerDocument = JSON.parse(
//         await readFile(
//           new URL('./swagger.json', import.meta.url)
//         ))

// Model relationships
Dresseur.hasMany(Pokemon, {onDelete: 'CASCADE', hooks: true})
Pokemon.belongsTo(Dresseur)

const app = express()

app.use(express.json())


// Routes
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/register', RegisterRouter)
app.use(AuthentificationRouter)
app.use('/dresseur', DresseurRouter)
app.use('/pokemon', PokemonRouter)


// Default route
app.use((req, res, next) => {
    res.status(404).send({"error" :"URL not found"})
})


app.listen(config.NODE_APP_PORT);