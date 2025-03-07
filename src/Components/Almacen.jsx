import barraData from "../Data/control_inventario.json";
import insumosData from "../Data/control_inventario_insumos.json";
import "./Styles/Almacen.scss";
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Registra los componentes necesarios de ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



const Almacen = () => {
  // Estados generales
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [editingCell, setEditingCell] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    CODIGO: "",
    DESCRIPCION: "",
    CATEGORIA: "",
    ALMACEN: "",
    PROVEEDOR: "",
    UDM: "",
    ENTRADA: 0,
    STOCK: 0
  });
  const [selectedLocation, setSelectedLocation] = useState("Francisco I. Madero");
  // Estado para seleccionar el dataset (sidebar): "barra" o "insumos"
  const [selectedTable, setSelectedTable] = useState("barra");
  // Estado para la vista: "table", "graphs" o "transfer"
  const [selectedView, setSelectedView] = useState("table");

  // Definir columnas para cada dataset
  const columnsBarra = [
    { key: "CODIGO", label: "Code", editable: false },
    { key: "DESCRIPCION", label: "Name", editable: true },
    { key: "CATEGORIA", label: "Category", editable: true },
    { key: "ALMACEN", label: "Almacen", editable: true },
    { key: "PROVEEDOR", label: "Supplier", editable: true },
    { key: "ENTRADA", label: "Entrance", editable: true },
    { key: "STOCK", label: "Stock", editable: true },
    { key: "UDM", label: "UDM", editable: false }
  ];

  const columnsInsumos = [
    { key: "Codigo", label: "Code", editable: false },
    { key: "Descripcion", label: "Name", editable: true },
    { key: "Categoria", label: "Category", editable: true },
    { key: "Almacen", label: "Almacen", editable: true },
    { key: "Proveedor", label: "Supplier", editable: true },
    { key: "Stock_minimo", label: "Stock Min", editable: true },
    { key: "Inventario", label: "Inventory", editable: true },
    { key: "Estatus", label: "Status", editable: true },
    { key: "UnidadDM", label: "UDM", editable: false }
  ];

  const columns = selectedTable === "barra" ? columnsBarra : columnsInsumos;

  // Cargar datos según el dataset seleccionado
  useEffect(() => {
    if (selectedTable === "barra") {
      if (barraData && barraData.barra) {
        console.log("Cargando datos de Barra:", barraData.barra);
        setProducts(barraData.barra);
      }
    } else {
      if (insumosData && insumosData.insumos) {
        console.log("Cargando datos de Insumos:", insumosData.insumos);
        setProducts(insumosData.insumos);
      }
    }
    setCurrentPage(1);
  }, [selectedTable]);

  // Filtrado en todas las columnas definidas
  const filteredProducts = products.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return columns.some((col) => {
      const value = item[col.key];
      return value && value.toString().toLowerCase().includes(searchLower);
    });
  });

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Funciones para edición por celda
  const startCellEdit = (globalIndex, field) => {
    setEditingCell({
      rowIndex: globalIndex,
      field,
      value: products[globalIndex][field]
    });
  };

  const handleCellInputChange = (e) => {
    setEditingCell({ ...editingCell, value: e.target.value });
  };

  const saveCellEdit = (globalIndex, field) => {
    const updated = [...products];
    updated[globalIndex][field] = editingCell.value;
    setProducts(updated);
    setEditingCell(null);
  };

  const handleCellKeyDown = (e, globalIndex, field) => {
    if (e.key === "Enter") {
      saveCellEdit(globalIndex, field);
    }
  };

  // Modal: Agregar nuevo producto
  const handleAddModalChange = (e, field) => {
    setNewProduct({ ...newProduct, [field]: e.target.value });
  };

  const handleAddProduct = () => {
    const producto = { ...newProduct };
    if (selectedTable === "barra") {
      producto.CODIGO = products.length + 1;
    } else {
      producto.Codigo = products.length + 1;
    }
    setProducts([...products, producto]);
    setShowAddModal(false);
    setNewProduct({
      CODIGO: "",
      DESCRIPCION: "",
      CATEGORIA: "",
      ALMACEN: "",
      PROVEEDOR: "",
      UDM: "",
      ENTRADA: 0,
      STOCK: 0
    });
    setCurrentPage(totalPages);
  };

  // Datos para las gráficas
  const inventoryKey = selectedTable === "barra" ? "STOCK" : "Inventario";
  const labelKey = selectedTable === "barra" ? "DESCRIPCION" : "Descripcion";

  const sortedDesc = [...products].sort(
    (a, b) => b[inventoryKey] - a[inventoryKey]
  );
  const topProducts = sortedDesc.slice(0, 5);

  const sortedAsc = [...products].sort(
    (a, b) => a[inventoryKey] - b[inventoryKey]
  );
  const bottomProducts = sortedAsc.slice(0, 5);

  const topData = {
    labels: topProducts.map((p) => p[labelKey]),
    datasets: [
      {
        label: "Highest Inventory",
        data: topProducts.map((p) => p[inventoryKey]),
        backgroundColor: "rgba(40,166,69,0.6)"
      }
    ]
  };

  const bottomData = {
    labels: bottomProducts.map((p) => p[labelKey]),
    datasets: [
      {
        label: "Lowest Inventory",
        data: bottomProducts.map((p) => p[inventoryKey]),
        backgroundColor: "rgba(220,53,69,0.6)"
      }
    ]
  };

  // Título principal según dataset
  const mainTitle =
    selectedTable === "barra" ? "Almacén - Barra" : "Almacén - Insumos";

  return (
    <div className="almacen-page fade-in">
      <h2 className="almacen-title">{mainTitle}</h2>

      {/* Topbar */}
      <div className="almacen-topbar">
        <div className="topbar-left">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="location-dropdown"
          >
            <option value="Francisco I. Madero">Francisco I. Madero</option>
            <option value="Constitución">Constitución</option>
            <option value="Francisco Villa">Francisco Villa</option>
          </select>
        </div>
        <div className="topbar-center">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search product..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
        <div className="topbar-right">
          <img
            src="/images/Playa_logo.jpg"
            alt="Logo"
            className="logo-circle"
          />
        </div>
      </div>

      <div className="almacen-content">
        {/* Sidebar */}
        <div className="almacen-sidebar">
          <ul>
            <li
              className={selectedView === "table" ? "active" : ""}
              onClick={() => setSelectedView("table")}
            >
              Table
              {selectedView === "table" && (
                <div className="submenu">
                  <span
                    className={selectedTable === "insumos" ? "active" : ""}
                    onClick={() => setSelectedTable("insumos")}
                  >
                    Almacén de insumos
                  </span>
                  <span
                    className={selectedTable === "barra" ? "active" : ""}
                    onClick={() => setSelectedTable("barra")}
                  >
                    Barra
                  </span>
                </div>
              )}
            </li>
            <li
              className={selectedView === "graphs" ? "active" : ""}
              onClick={() => setSelectedView("graphs")}
            >
              Graphs
            </li>
            <li
              className={selectedView === "transfer" ? "active" : ""}
              onClick={() => setSelectedView("transfer")}
            >
              Transfer
            </li>
          </ul>
        </div>

        {/* Main content */}
        <div className="almacen-main">
          {selectedView === "table" && (
            <>
              <div className="almacen-main-header">
                <button
                  className="almacen-add-button"
                  onClick={() => setShowAddModal(true)}
                >
                  ADD NEW PRODUCT
                </button>
              </div>
              <div className="almacen-table-container">
                <table className="almacen-table">
                  <thead>
                    <tr>
                      {columns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, index) => {
                      const globalIndex = startIndex + index;
                      return (
                        <tr key={globalIndex}>
                          {columns.map((col) => {
                            const cellValue = item[col.key] || "";
                            return (
                              <td key={col.key}>
                                {editingCell &&
                                editingCell.rowIndex === globalIndex &&
                                editingCell.field === col.key ? (
                                  <input
                                    type={
                                      ["STOCK", "ENTRADA", "Stock_minimo", "Inventario"].includes(col.key)
                                        ? "number"
                                        : "text"
                                    }
                                    value={editingCell.value}
                                    onChange={handleCellInputChange}
                                    onBlur={() =>
                                      saveCellEdit(globalIndex, col.key)
                                    }
                                    onKeyDown={(e) =>
                                      handleCellKeyDown(e, globalIndex, col.key)
                                    }
                                    className="cell-input"
                                    autoFocus
                                  />
                                ) : (
                                  <div className="cell-display">
                                    <span>{cellValue}</span>
                                    {col.editable && (
                                      <button
                                        className="cell-edit-btn"
                                        onClick={() =>
                                          startCellEdit(globalIndex, col.key)
                                        }
                                        title="Edit"
                                      >
                                        &#9998;
                                      </button>
                                    )}
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="almacen-pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`page-button ${page === currentPage ? "active" : ""}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </>
          )}

          {selectedView === "graphs" && (
            <div className="almacen-graphs">
              <h3>Highest Inventory</h3>
              <div className="chart-container">
                <Bar data={topData} options={{ maintainAspectRatio: false }} />
              </div>
              <h3>Lowest Inventory</h3>
              <div className="chart-container">
                <Bar data={bottomData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          )}

          {selectedView === "transfer" && (
            <div className="almacen-transfer">
              <h3>Transfer View</h3>
              <p>Coming soon...</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Product</h3>
            <div className="modal-form">
              <label>
                Name:
                <input
                  type="text"
                  value={newProduct.DESCRIPCION}
                  onChange={(e) => handleAddModalChange(e, "DESCRIPCION")}
                />
              </label>
              <label>
                Category:
                <input
                  type="text"
                  value={newProduct.CATEGORIA}
                  onChange={(e) => handleAddModalChange(e, "CATEGORIA")}
                />
              </label>
              <label>
                Supplier:
                <input
                  type="text"
                  value={newProduct.PROVEEDOR}
                  onChange={(e) => handleAddModalChange(e, "PROVEEDOR")}
                />
              </label>
              <label>
                UDM:
                <input
                  type="text"
                  value={newProduct.UDM}
                  onChange={(e) => handleAddModalChange(e, "UDM")}
                />
              </label>
              <label>
                Entrance:
                <input
                  type="number"
                  value={newProduct.ENTRADA}
                  onChange={(e) => handleAddModalChange(e, "ENTRADA")}
                />
              </label>
              <label>
                Stock:
                <input
                  type="number"
                  value={newProduct.STOCK}
                  onChange={(e) => handleAddModalChange(e, "STOCK")}
                />
              </label>
            </div>
            <div className="modal-buttons">
              <button onClick={handleAddProduct}>Add</button>
              <button onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Almacen;
