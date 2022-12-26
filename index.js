import express from 'express';
import config from './config.js';
import Dresseur from './models/dresseur.js';
import Pokemon from './models/pokemon.js';

// Model relationship
Dresseur.hasMany(Pokemon)
Pokemon.belongsTo(Dresseur)

const app = express()

app.use(express.json())

// Default route
app.use((req, res, next) => {
    res.status(404).send({"error" :"URL not found"})
})

app.listen(config.NODE_APP_PORT);