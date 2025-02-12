const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// 🔗 Conexión a MongoDB (Ajustado a la base de datos de la imagen)
const MONGO_URI = 'mongodb://localhost:27017/ControlDelInventario';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB en ControlDelInventario'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Middlewares
app.use(cors());
app.use(express.json());

// Definir el esquema según la estructura de la imagen
const InventoryItem = mongoose.model('InventoryItem', new mongoose.Schema({
  CODIGO: Number,
  DESCRIPCION: String,
  CATEGORIA: String,
  ALMACEN: String,
  PROVEEDOR: String,
  UDM: String,
  ENTRADA: Number,
  STOCK: Number
}));

// Rutas de la API
app.get('/api/inventory', async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inventory', async (req, res) => {
  try {
    console.log('📢 Nuevo ítem recibido:', req.body);
    const newItem = new InventoryItem(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/inventory/:id', async (req, res) => {
  try {
    console.log(`📢 Editando ítem con ID: ${req.params.id}`, req.body);
    const updatedItem = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!updatedItem) return res.status(404).json({ error: 'Ítem no encontrado' });

    res.json(updatedItem);
  } catch (err) {
    console.error('❌ Error al actualizar:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/inventory/:id', async (req, res) => {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ítem eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
