import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/inventory';

const Inventory = () => {
  // Estado para almacenar los ítems
  const [items, setItems] = useState([]);
  // Estado para el formulario de creación de ítems
  const [newItem, setNewItem] = useState({
    CODIGO: '',
    DESCRIPCION: '',
    CATEGORIA: '',
    ALMACEN: '',
    PROVEEDOR: '',
    UDM: '',
    ENTRADA: '',
    STOCK: ''
  });
  // Estados para la edición
  const [editRowId, setEditRowId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Obtener los datos desde el JSON al montar el componente (para pruebas locales)
  useEffect(() => {
    fetch('/data/control_inventario.json')
      .then(response => response.json())
      .then(data => {
        console.log('Datos recibidos del JSON:', data);
        if (data && Array.isArray(data.barra)) {
          setItems(data.barra);
        } else {
          console.error('El formato del JSON no es el esperado:', data);
        }
      })
      .catch(error => console.error('Error al obtener datos:', error));
  }, []);

  // Obtener los datos desde el backend (API_URL)
  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        console.log('Datos recibidos de la API:', data);
        setItems(data);
      })
      .catch(error => console.error('Error al obtener datos:', error));
  }, []);

  // Maneja los cambios en el formulario de agregar nuevos ítems
  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prevState => ({ ...prevState, [name]: value }));
  };

  // Agregar un nuevo ítem (POST al backend)
  const handleAddItem = async (e) => {
    e.preventDefault();
    const itemToAdd = {
      ...newItem,
      ENTRADA: Number(newItem.ENTRADA),
      STOCK: Number(newItem.STOCK)
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemToAdd),
      });

      if (!response.ok) throw new Error('Error al agregar el ítem');

      const addedItem = await response.json();
      setItems(prevItems => [...prevItems, addedItem]);
      // Reiniciar el formulario
      setNewItem({
        CODIGO: '',
        DESCRIPCION: '',
        CATEGORIA: '',
        ALMACEN: '',
        PROVEEDOR: '',
        UDM: '',
        ENTRADA: '',
        STOCK: ''
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Iniciar edición: guardar el id y los datos actuales en el estado
  const handleEditClick = (item) => {
    setEditRowId(item._id);
    setEditFormData({ ...item });
  };

  // Manejar cambios en el formulario de edición
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // Guardar cambios en la edición (PUT al backend)
  const handleSaveEdit = async () => {
    try {
      const updatedData = {
        ...editFormData,
        ENTRADA: Number(editFormData.ENTRADA),
        STOCK: Number(editFormData.STOCK)
      };

      const response = await fetch(`${API_URL}/${editRowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Error al actualizar el ítem');

      const updatedItem = await response.json();
      setItems(prevItems =>
        prevItems.map(item => (item._id === editRowId ? updatedItem : item))
      );
      setEditRowId(null);
      setEditFormData({});
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Cancelar la edición
  const handleCancelEdit = () => {
    setEditRowId(null);
    setEditFormData({});
  };

  // Eliminar un ítem (DELETE al backend)
  const handleRemoveItem = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar el ítem');

      setItems(prevItems => prevItems.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="inventory-container p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Inventario</h2>

      {/* Formulario para agregar nuevos ítems */}
      <form onSubmit={handleAddItem} className="add-item-form mb-8 max-w-4xl mx-auto bg-white p-6 shadow rounded">
        <h3 className="text-2xl font-semibold mb-4">Agregar nuevo ítem</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="CODIGO"
            placeholder="Código"
            value={newItem.CODIGO}
            onChange={handleNewItemChange}
            required
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="DESCRIPCION"
            placeholder="Descripción"
            value={newItem.DESCRIPCION}
            onChange={handleNewItemChange}
            required
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="CATEGORIA"
            placeholder="Categoría"
            value={newItem.CATEGORIA}
            onChange={handleNewItemChange}
            required
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="ALMACEN"
            placeholder="Almacén"
            value={newItem.ALMACEN}
            onChange={handleNewItemChange}
            required
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="PROVEEDOR"
            placeholder="Proveedor"
            value={newItem.PROVEEDOR}
            onChange={handleNewItemChange}
            required
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="UDM"
            placeholder="Unidad de Medida"
            value={newItem.UDM}
            onChange={handleNewItemChange}
            required
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="ENTRADA"
            placeholder="Entrada"
            value={newItem.ENTRADA}
            onChange={handleNewItemChange}
            required
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="STOCK"
            placeholder="Stock"
            value={newItem.STOCK}
            onChange={handleNewItemChange}
            required
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Agregar
        </button>
      </form>

      {/* Tabla de inventario */}
      <div className="overflow-x-auto max-w-6xl mx-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4">Código</th>
              <th className="py-3 px-4">Descripción</th>
              <th className="py-3 px-4">Categoría</th>
              <th className="py-3 px-4">Almacén</th>
              <th className="py-3 px-4">Proveedor</th>
              <th className="py-3 px-4">UDM</th>
              <th className="py-3 px-4">Entrada</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item =>
              editRowId === item._id ? (
                <tr key={item._id} className="border-b">
                  <td className="py-2 px-4">
                    <input
                      type="text"
                      name="CODIGO"
                      value={editFormData.CODIGO}
                      onChange={handleEditInputChange}
                      className="border rounded p-1 w-full"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="text"
                      name="DESCRIPCION"
                      value={editFormData.DESCRIPCION}
                      onChange={handleEditInputChange}
                      className="border rounded p-1 w-full"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="text"
                      name="CATEGORIA"
                      value={editFormData.CATEGORIA}
                      onChange={handleEditInputChange}
                      className="border rounded p-1 w-full"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="text"
                      name="ALMACEN"
                      value={editFormData.ALMACEN}
                      onChange={handleEditInputChange}
                      className="border rounded p-1 w-full"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="text"
                      name="PROVEEDOR"
                      value={editFormData.PROVEEDOR}
                      onChange={handleEditInputChange}
                      className="border rounded p-1 w-full"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="text"
                      name="UDM"
                      value={editFormData.UDM}
                      onChange={handleEditInputChange}
                      className="border rounded p-1 w-full"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      name="ENTRADA"
                      value={editFormData.ENTRADA}
                      onChange={handleEditInputChange}
                      className="border rounded p-1 w-full"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      name="STOCK"
                      value={editFormData.STOCK}
                      onChange={handleEditInputChange}
                      className="border rounded p-1 w-full"
                    />
                  </td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded transition-colors"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded transition-colors"
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={item._id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4">{item.CODIGO}</td>
                  <td className="py-2 px-4">{item.DESCRIPCION}</td>
                  <td className="py-2 px-4">{item.CATEGORIA}</td>
                  <td className="py-2 px-4">{item.ALMACEN}</td>
                  <td className="py-2 px-4">{item.PROVEEDOR}</td>
                  <td className="py-2 px-4">{item.UDM}</td>
                  <td className="py-2 px-4">{item.ENTRADA}</td>
                  <td className="py-2 px-4">{item.STOCK}</td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded transition-colors"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
