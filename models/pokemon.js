import { DataTypes, Model } from 'sequelize'
import Database from '../database.js'
import Dresseur from './dresseur.js'

class Pokemon extends Model {}

Pokemon.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    species: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    level: {
        type: DataTypes.INTEGER(50),
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'undefined'),
        allowNull: false
    },
    size: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    isChromatic: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize: Database,
    modelName: "pokemons",
    timestamps: true,
})


export default Pokemon