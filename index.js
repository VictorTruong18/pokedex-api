import express from 'express';
import config from './config.js';

// Models import 
import Dresseur from './models/dresseur.js';
import Pokemon from './models/pokemon.js';

// Routes import
import RegisterRouter from './routes/register.js';
import AuthentificationRouter from './routes/authentification.js';
import DresseurRouter from './routes/dresseur.js';

// Model relationships
Dresseur.hasMany(Pokemon)
Pokemon.belongsTo(Dresseur, {onDelete: 'cascade'})

const app = express()

app.use(express.json())


// Routes
app.use('/register', RegisterRouter)
app.use(AuthentificationRouter)
app.use('/dresseur', DresseurRouter)


// Default route
app.use((req, res, next) => {
    res.status(404).send({"error" :"URL not found"})
})


app.listen(config.NODE_APP_PORT);