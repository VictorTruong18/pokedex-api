import express from "express";
import dotenv from "dotenv";
import path from "path";
import { Router } from "express";
import {
  authorizationCodeCheck,
  authorizationCodeDisplay,
  generateAccessToken,
} from "../controllers/authentification.js";
import Dresseur from "./../models/dresseur.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const AuthentificationRouter = Router();

AuthentificationRouter.get("/authorize", [authorizationCodeCheck]);
AuthentificationRouter.get("/authorized", [authorizationCodeDisplay]);
AuthentificationRouter.post("/oauth/token", [generateAccessToken]);

export default AuthentificationRouter;
