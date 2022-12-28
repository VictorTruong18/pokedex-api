import express from 'express';
import { Router } from 'express';
import { createDresseur } from '../controllers/dresseur.js';


const RegisterRouter = Router()

RegisterRouter.post('/', [createDresseur])


export default RegisterRouter