import express from 'express';
import { Router } from 'express';
import { createPokemon, modifyPokemon } from '../controllers/pokemon.js';
import { checkAuthorization, isDresseurAdmin, isDresseurPokemon, isAllowedToModifyOwner } from '../controllers/authorization.js';

const PokemonRouter = Router()

PokemonRouter.post('/', [checkAuthorization, createPokemon])
PokemonRouter.patch('/:id', [checkAuthorization, isDresseurAdmin, isDresseurPokemon, isAllowedToModifyOwner, modifyPokemon] )

export default PokemonRouter