import { DataTypes, Model, Op } from 'sequelize'
import Database from '../database.js'
import Dresseur from './dresseur.js'

class Exchange extends Model {}

Exchange.init({
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    initiator:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    recipient: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('accepted', 'rejected', 'pending'),
        defaultValue: 'pending'
    },
    pokemonInitiator: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pokemonRecipient: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: Database,
    modelName: "exchanges",
    timestamps: true,
})

Exchange.findAllDresseur = function(id){
    return this.findAll({where : {[Op.or]: [
        { pokemonInitiator: id },
        { pokemonRecipient: id }
      ]
  }})
}

export default Exchange