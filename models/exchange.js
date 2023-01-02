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
        { initiator: id },
        { recipient: id }
      ]
  }})
}

Exchange.accept = function(id){
    return this.update({status: "accepted"}, {where: {id:id}})
}

Exchange.reject = function(id){
    this.update({status: "rejected"}, {where: {id:id}})
    return this.findOne({where: {id: id}})
}

export default Exchange