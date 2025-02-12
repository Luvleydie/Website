// models/InventoryItem.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  CODIGO: { type: Number, required: true, unique: true },       // Se usará como id
  DESCRIPCION: { type: String, required: true },
  CATEGORIA: { type: String, required: true },
  ALMACEN: { type: String, required: true },
  PROVEEDOR: { type: String, required: true },
  UDM: { type: String, required: true },
  ENTRADA: { type: Number, required: true },  // Se almacenará como entero
  STOCK: { type: Number, required: true }     // Se almacenará como entero
});

// Si la nueva base de datos usa una colección con nombre diferente (por ejemplo, "new_inventory"),
// especifica el tercer parámetro en mongoose.model. Si no, Mongoose usará el plural del nombre del modelo.
module.exports = mongoose.model('InventoryItem', inventorySchema, 'new_inventory');
