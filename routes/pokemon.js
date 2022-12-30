import express from 'express';
import { Router } from 'express';
import { createPokemon, modifyPokemon, deletePokemon, getPokemon } from '../controllers/pokemon.js';
import { checkAuthorization, isDresseurAdmin, isDresseurPokemon, isAllowedToModifyOwner } from '../controllers/authorization.js';

const PokemonRouter = Router()

PokemonRouter.get('/:id', [checkAuthorization, getPokemon])
PokemonRouter.post('/', [checkAuthorization, createPokemon])
PokemonRouter.patch('/:id', [checkAuthorization, isDresseurAdmin, isDresseurPokemon, isAllowedToModifyOwner, modifyPokemon] )
PokemonRouter.delete('/:id', [checkAuthorization, isDresseurAdmin, isDresseurPokemon, deletePokemon] )

export default PokemonRouter