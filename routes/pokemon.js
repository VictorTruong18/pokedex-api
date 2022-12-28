import express from 'express';
import { Router } from 'express';
import { createPokemon } from '../controllers/pokemon.js';
import { checkAuthorization } from '../controllers/authorization.js';

const PokemonRouter = Router()

PokemonRouter.post('/', [checkAuthorization, createPokemon])

export default PokemonRouter