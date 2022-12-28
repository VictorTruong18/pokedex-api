import express from 'express';
import { Router } from 'express';
import Dresseur from './../models/dresseur.js';
import { checkAuthorization, isDresseurAdmin, isDresseurAccount } from '../controllers/authorization.js';
import { getDresseur, modifyDresseur, deleteDresseur } from '../controllers/dresseur.js';

const DresseurRouter = Router()

DresseurRouter.get('/', [checkAuthorization, getDresseur])
DresseurRouter.get('/:id', [checkAuthorization, getDresseur])

DresseurRouter.patch('/', [checkAuthorization, modifyDresseur])
DresseurRouter.patch('/:id', [checkAuthorization, isDresseurAdmin, isDresseurAccount, modifyDresseur])

DresseurRouter.delete('/', [checkAuthorization, deleteDresseur])
DresseurRouter.delete('/:id', [checkAuthorization, isDresseurAdmin, isDresseurAccount, deleteDresseur])

export default DresseurRouter;