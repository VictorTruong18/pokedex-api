import express from 'express';
import { Router } from 'express';
import Dresseur from './../models/dresseur.js';
import { checkAuhtorization, isDresseurAdmin, isDresseurAccount } from '../controllers/authorization.js';
import { getDresseur } from '../controllers/dresseur.js';

const DresseurRouter = Router()

DresseurRouter.get('/:id', [checkAuhtorization, isDresseurAdmin, isDresseurAccount, getDresseur])


export default DresseurRouter;