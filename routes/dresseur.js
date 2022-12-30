import express from 'express';
import { Router } from 'express';
import Dresseur from './../models/dresseur.js';
import { checkAuthorization, isDresseurAdmin, isDresseurAccount } from '../controllers/authorization.js';
import { getDresseur, modifyDresseur, deleteDresseur, getDresseurPokemon } from '../controllers/dresseur.js';

const DresseurRouter = Router()

DresseurRouter.get('/pokemon', [checkAuthorization, getDresseurPokemon])
DresseurRouter.get('/:dresseur_id/pokemon', [checkAuthorization, getDresseurPokemon])

DresseurRouter.get('/', [checkAuthorization, getDresseur])
DresseurRouter.get('/:id', [checkAuthorization, getDresseur])

DresseurRouter.patch('/', [checkAuthorization, modifyDresseur])
DresseurRouter.patch('/:id', [checkAuthorization, isDresseurAdmin, isDresseurAccount, modifyDresseur])

DresseurRouter.delete('/', [checkAuthorization, deleteDresseur])
DresseurRouter.delete('/:id', [checkAuthorization, isDresseurAdmin, isDresseurAccount, deleteDresseur])


export default DresseurRouter;