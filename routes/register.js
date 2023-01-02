import express from "express";
import { Router } from "express";
import { createDresseur } from "../controllers/dresseur.js";
import {
  checkAuthorization,
  isAllowedToCreateDresseur,
} from "../controllers/authorization.js";

const RegisterRouter = Router();

RegisterRouter.post("/", [isAllowedToCreateDresseur, createDresseur]);

export default RegisterRouter;
