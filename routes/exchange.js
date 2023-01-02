import express from "express";
import { Router } from "express";
import Dresseur from "../models/dresseur.js";
import Exchange from "../models/exchange.js";
import Pokemon from "../models/pokemon.js";
import { checkAuthorization } from "../controllers/authorization.js";
import {
  createExchangeRequest,
  getAllExchangeRequest,
  agreeToExchange,
  disagreeToExchange,
} from "../controllers/exchange.js";

const ExchangeRouter = Router();

// Get all the exchanges
ExchangeRouter.get("/", [checkAuthorization, getAllExchangeRequest]);
// Create one exchange proposition
ExchangeRouter.post("/", [checkAuthorization, createExchangeRequest]);
// Agree to one exchange proposition
ExchangeRouter.get("/accept/:id", [checkAuthorization, agreeToExchange]);
// Agree decline one exchange proposition
ExchangeRouter.get("/decline/:id", [checkAuthorization, disagreeToExchange]);

export default ExchangeRouter;
