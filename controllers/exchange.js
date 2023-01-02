import Exchange from "../models/exchange.js";
import { parseStringToArray } from "./utility.js";
import Pokemon from "../models/pokemon.js";
import Dresseur from "../models/dresseur.js";

export const createExchangeRequest = async (req, res) => {
  try {
    const initiator = await Dresseur.findById(res.locals.requestor.id);
    const recipient = await Dresseur.findById(req.body.recipient);
    if (!initiator || !recipient) {
      return res.status(400).send({ error: "Dresseurs specified don't exist" });
    }
    if (res.locals.requestor.id == req.body.recipient) {
      return res.status(400).send({
        error: "Dresseur can't be recipient and initiator at the same time",
      });
    }

    const pokemonsInitiator = req.body.pokemonInitiator;
    const pokemonRecipient = req.body.pokemonRecipient;
    if (Array.isArray(pokemonsInitiator) && Array.isArray(pokemonRecipient)) {
      if (pokemonsInitiator.length != null) {
        for (let pokemonId of pokemonsInitiator) {
          const pokemon = await Pokemon.findById(pokemonId);
          if (!pokemon) {
            return res
              .status(400)
              .send({ error: "Some of the pokemons specified do not exist" });
          }
          if (pokemon.dresseurId != initiator.id) {
            return res.status(400).send({
              error: "You can't exchange pokemon that don't belong to you",
            });
          }
        }
      }
      if (pokemonRecipient.length != null) {
        for (let pokemonId of pokemonRecipient) {
          const pokemon = await Pokemon.findById(pokemonId);
          if (!pokemon) {
            return res
              .status(400)
              .send({ error: "Some of the pokemons specified do not exist" });
          }
          if (pokemon.dresseurId != recipient.id) {
            return res.status(400).send({
              error:
                "Some of the pokemons specified don't belong to the recipient",
            });
          }
        }
      }
    } else {
      return res
        .status(400)
        .send("Send arrays of integers for the pokemons you want to trade");
    }

    const pokemonInitiatorString = pokemonsInitiator.join(".");
    const pokemonRecipientString = pokemonRecipient.join(".");

    const trade = await Exchange.create({
      initiator: initiator.id,
      recipient: recipient.id,
      pokemonInitiator: pokemonInitiatorString,
      pokemonRecipient: pokemonRecipientString,
    });
    if (!trade) {
      return res.status(404).send("Trade not found");
    }
    return res.status(200).send({ trade });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal error");
  }
};

export const getAllExchangeRequest = async (req, res) => {
  try {
    const { id } = res.locals.requestor;
    const trades = await Exchange.findAllDresseur(id);

    if (!trades) {
      return res.status(404).send("Trade not found");
    }
    return res.status(200).send({ trades });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal error");
  }
};

export const agreeToExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findByPk(req.params.id);

    if (!exchange) {
      return res.status(404).send("Exchange not found");
    }
    if (exchange.status != "pending") {
      return res.status(400).send("You can only accept pending changes");
    }
    if (exchange.recipient != res.locals.requestor.id) {
      return res
        .status(404)
        .send("You can't agree to an exchange you are not the recipient");
    }
    const initiator = await Dresseur.findById(exchange.initiator);
    const recipient = await Dresseur.findById(exchange.recipient);
    if (!initiator || !recipient) {
      return res.status(400).send({
        error:
          "Could not find the initiator or the recipient in the db for this exchange",
      });
    }
    const pokemonsInitiator = parseStringToArray(exchange.pokemonInitiator);
    const pokemonsRecipient = parseStringToArray(exchange.pokemonRecipient);
    if (pokemonsInitiator.length != null) {
      for (let pokemonId of pokemonsInitiator) {
        const pokemon = await Pokemon.findById(pokemonId);
        if (!pokemon) {
          return res
            .status(400)
            .send({ error: "Some of the pokemons specified do not exist" });
        }
        if (pokemon.dresseurId != initiator.id) {
          return res.status(400).send({
            error: "You can't exchange pokemon that don't belong to you",
          });
        }
      }
    }
    if (pokemonsRecipient.length != null) {
      for (let pokemonId of pokemonsRecipient) {
        const pokemon = await Pokemon.findById(pokemonId);
        if (!pokemon) {
          return res
            .status(400)
            .send({ error: "Some of the pokemons specified do not exist" });
        }
        if (pokemon.dresseurId != recipient.id) {
          return res.status(400).send({
            error:
              "Some of the pokemons specified don't belong to the recipient",
          });
        }
      }
    }
    const updatedPokemons = [];
    // Change the dresseurId of all the exchanged pokemon
    if (pokemonsInitiator.length != null) {
      for (let pokemonId of pokemonsInitiator) {
        await Pokemon.updateDresseurId(recipient.id, pokemonId);
        const updatedPokemon = await Pokemon.findByPk(pokemonId);
        updatedPokemons.push(updatedPokemon);
      }
    }
    if (pokemonsRecipient.length != null) {
      for (let pokemonId of pokemonsRecipient) {
        await Pokemon.updateDresseurId(initiator.id, pokemonId);
        const updatedPokemon = await Pokemon.findByPk(pokemonId);
        updatedPokemons.push(updatedPokemon);
      }
    }
    await Exchange.accept(exchange.id);
    res.status(200).send({ "Exchanged pokemons": updatedPokemons });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal error");
  }
};

export const disagreeToExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findByPk(req.params.id);
    if (!exchange) {
      return res.status(404).send("Exchange not found");
    }
    if (exchange.status != "pending") {
      return res.status(400).send("You can only reject pending changes");
    }
    if (exchange.recipient != res.locals.requestor.id) {
      return res
        .status(404)
        .send("You can't reject an exchange you are not the recipient");
    }
    await Exchange.reject(exchange.id);
    const declinedExchange = await Exchange.findByPk(exchange.id);
    res.status(200).send({ "Rejected exchange": declinedExchange });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal error");
  }
};
