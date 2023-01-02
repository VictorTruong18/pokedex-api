import Dresseur from "./../models/dresseur.js";
import Pokemon from "../models/pokemon.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import config from "./../config.js";
import { paginate } from "./utility.js";

dotenv.config();

export const createDresseur = async (req, res) => {
  const { firstName, lastName, login, password, age, roles } = req.body;
  try {
    // encrypt the password
    const encryptedPassword = bcrypt.hashSync(password, 5);
    // create the user and return his id
    const { id } = await Dresseur.create({
      firstName,
      lastName,
      login,
      password: encryptedPassword,
      roles: roles || "USER",
      age,
    });
    return res.status(201).send({ "Dresseur created with id": id });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

export const getDresseur = async (req, res) => {
  const id = req.params.id || res.locals.requestor.id;
  try {
    const dresseur = await Dresseur.findById(id);
    if (!dresseur) {
      return res.status(404).send("Dresseur not found");
    }
    return res.status(200).send(dresseur);
  } catch (error) {
    return res.status(500).send("Error while getting the Dresser");
  }
};

export const modifyDresseur = async (req, res) => {
  const id = req.params.id || res.locals.requestor.id;
  const patchedInformations = req.body;
  try {
    const dresseur = await Dresseur.findById(id);
    if (!dresseur) {
      return res.status(404).send("Dresseur not found");
    }
    if (!res.locals.requestor.isAdmin) {
      if (patchedInformations.roles) {
        return res
          .status(403)
          .send({ error: "As a USER you cant modify your priviledge" });
      }
    }
    const dresseurToUpdate = { ...dresseur, ...patchedInformations };
    const updatedDresseur = await dresseur.update(dresseurToUpdate);
    return res.status(200).send(updatedDresseur);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const deleteDresseur = async (req, res) => {
  const id = req.params.id || res.locals.requestor.id;

  try {
    const dresseur = await Dresseur.findById(id);
    if (!dresseur) {
      return res.status(404).send("Dresseur not found");
    }
    dresseur.destroy();
    return res.status(200).send({ "Dresseur id erased": id });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getDresseurPokemon = async (req, res) => {
  const id = req.params.dresseur_id || res.locals.requestor.id;
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || process.env.PAGE_SIZE;

  try {
    const pokemons = await Pokemon.getAllPokemon(id);

    const paginationResult = paginate(id, pokemons, page, pageSize);

    return res.status(200).send({
      "Previous page ": paginationResult.previous,
      "Next page ": paginationResult.next,
      "All the pokemons": paginationResult.results,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error });
  }
};
