import { DataTypes, Model } from 'sequelize'
import Database from '../database.js'
import Pokemon from './pokemon.js'

class Dresseur extends Model {}

Dresseur.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    login: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    roles: {
        type: DataTypes.ENUM('USER', 'ADMIN'),
        defaultValue: 'USER',
        allowNull: false,
    }
}, {
    sequelize: Database,
    modelName: "dresseurs",
    timestamps: true,
})

Dresseur.findById = function(id){
    return this.findOne({ where: { id: id}})
};

Dresseur.hasRoles = function(dresseur, role){
    return dresseur.roles.includes(role)
}

export default Dresseur