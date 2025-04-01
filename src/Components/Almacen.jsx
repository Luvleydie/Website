import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import "./Styles/Almacen.scss";

// Registrar componentes de ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Almacen = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Estados generales
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [editingCell, setEditingCell] = useState(null);

  // Estado para el modal de agregar producto
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

 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);


  const [selectedLocation, setSelectedLocation] = useState("Francisco I. Madero");
  const [selectedTable, setSelectedTable] = useState("barra"); 
  const [selectedView, setSelectedView] = useState("table"); 

  
  const columnsBarra = [
    { key: "CODIGO", label: "Code", editable: false },
    { key: "DESCRIPCION", label: "Nombre", editable: true },
    { key: "CATEGORIA", label: "Categoría", editable: true },
    { key: "ALMACEN", label: "Almacen", editable: true },
    { key: "PROVEEDOR", label: "Proveedor", editable: true },
    { key: "ENTRADA", label: "Entrada", editable: true },
    { key: "STOCK", label: "Stock", editable: true },
    { key: "UDM", label: "UDM", editable: true } // udm
  ];

  const columnsInsumos = [
    { key: "Codigo", label: "Code", editable: false },
    { key: "Descripcion", label: "Nombre", editable: true },
    { key: "Categoria", label: "Categoría", editable: true },
    { key: "Almacen", label: "Almacen", editable: true },
    { key: "Proveedor", label: "Proveedor", editable: true },
    { key: "Stock_minimo", label: "Stock Min", editable: true },
    { key: "Inventario", label: "Stock", editable: true },
    { key: "Estatus", label: "Status", editable: true },
    { key: "UnidadDM", label: "UDM", editable: true }
  ];

  const columns = selectedTable === "barra" ? columnsBarra : columnsInsumos;

  // back
  const loadData = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/almacen?type=${selectedTable}`);
      const data = await response.json();
      if (response.ok) {
        setProducts(data.products || []);
      } else {
        console.error(data.error || "Error fetching products");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    
  }, [selectedTable]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  
  useEffect(() => {
    const intervalId = setInterval(loadData, 30000);
    return () => clearInterval(intervalId);
  }, [loadData]);

  
  const filteredProducts = products.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return columns.some((col) => {
      const value = item[col.key];
      return value && value.toString().toLowerCase().includes(searchLower);
    });
  });

  
  const inventoryKey = selectedTable === "barra" ? "STOCK" : "Inventario";

  // Ordenamiento
  const sortedProducts = filteredProducts.slice().sort((a, b) => {
    if (sortOption === "name-asc") {
      return (a[columns[1].key] || "").toString().localeCompare((b[columns[1].key] || "").toString());
    }
    if (sortOption === "name-desc") {
      return (b[columns[1].key] || "").toString().localeCompare((a[columns[1].key] || "").toString());
    }
    if (sortOption === "stock-asc") {
      return (a[inventoryKey] || 0) - (b[inventoryKey] || 0);
    }
    if (sortOption === "stock-desc") {
      return (b[inventoryKey] || 0) - (a[inventoryKey] || 0);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Edit
  const startCellEdit = (globalIndex, field) => {
    setEditingCell({
      rowIndex: globalIndex,
      field,
      value: sortedProducts[globalIndex][field]
    });
  };

  const handleCellInputChange = (e) => {
    setEditingCell({ ...editingCell, value: e.target.value });
  };

  const saveCellEdit = async (globalIndex, field) => {
    try {
      const updated = [...products];
      const productToUpdate = sortedProducts[globalIndex];
      const idx = products.findIndex((p) => p._id === productToUpdate._id);
      updated[idx][field] = editingCell.value;
      setProducts(updated);
      const productId = updated[idx]._id;
      const response = await fetch(
        `http://localhost:5000/api/almacen/${productId}?type=${selectedTable}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: editingCell.value })
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.error(data.error || "Error updating product");
      }
    } catch (err) {
      console.error("Error saving cell edit:", err);
    }
    setEditingCell(null);
  };

  const handleCellKeyDown = (e, globalIndex, field) => {
    if (e.key === "Enter") {
      saveCellEdit(globalIndex, field);
    }
  };

  
  const handleRequestDelete = (productId) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/almacen/${productId}?type=${selectedTable}`,
        { method: "DELETE" }
      );
      const data = await response.json();
      if (response.ok) {
        await loadData();
      } else {
        console.error(data.error || "Error deleting product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Modal añadir productito
  const handleAddModalChange = (e, field) => {
    setNewProduct({ ...newProduct, [field]: e.target.value });
  };

  const handleAddProduct = async () => {
    try {
      let productToAdd = { ...newProduct };
      if (selectedTable === "barra") {
        const { DESCRIPCION, CATEGORIA, ALMACEN, PROVEEDOR } = newProduct;
        if (!DESCRIPCION || !CATEGORIA || !ALMACEN || !PROVEEDOR) {
          alert(
            "Por favor, complete todos los campos obligatorios para Barra (Nombre, Categoria, Almacen y Proveedor)."
          );
          return;
        }
        if (!newProduct.CODIGO || isNaN(Number(newProduct.CODIGO))) {
          const lastProduct = await fetch(
            `http://localhost:5000/api/almacen?type=barra`
          )
            .then((res) => res.json())
            .then((data) =>
              data.products && data.products.length > 0
                ? data.products.sort((a, b) => b.CODIGO - a.CODIGO)[0].CODIGO
                : 0
            );
          productToAdd.CODIGO = Number(lastProduct) + 1;
        } else {
          productToAdd.CODIGO = Number(newProduct.CODIGO);
        }
        productToAdd.ENTRADA = Number(newProduct.ENTRADA);
        productToAdd.STOCK = Number(newProduct.STOCK);
      } else if (selectedTable === "insumos") {
        productToAdd = {
          Codigo: Number(newProduct.CODIGO),
          Descripcion: newProduct.DESCRIPCION,
          Categoria: newProduct.CATEGORIA,
          Almacen: newProduct.ALMACEN,
          Proveedor: newProduct.PROVEEDOR,
          Stock_minimo: Number(newProduct.STOCK),
          Inventario: Number(newProduct.ENTRADA),
          Estatus: "Disponible",
          UnidadDM: newProduct.UDM
        };
        if (!productToAdd.Descripcion || !productToAdd.Categoria) {
          alert("Por favor, complete los campos obligatorios para Insumos (Nombre y Categoria).");
          return;
        }
      }
      const response = await fetch(
        `http://localhost:5000/api/almacen?type=${selectedTable}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productToAdd)
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Producto agregado correctamente.");
        await loadData();
      } else {
        alert("Error adding product: " + (data.error || "Unknown error"));
        console.error(data.error || "Error adding product");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Error adding product: " + err.message);
    }
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
  };

  // Dashboard y gráficas (cálculos)
  const totalProductsCount = products.length;
  const totalInventory = products.reduce((acc, p) => acc + (Number(p[inventoryKey]) || 0), 0);
  const productsToReorder = products.filter(
    (p) => p.Estatus && p.Estatus.toLowerCase() === "solicitar material"
  ).length;

  const labelKey = selectedTable === "barra" ? "DESCRIPCION" : "Descripcion";
  const sortedDesc = [...products].sort((a, b) => (b[inventoryKey] || 0) - (a[inventoryKey] || 0));
  const topPieProducts = sortedDesc.slice(0, 5);
  const pieData = {
    labels: topPieProducts.map((p) => p[labelKey] || "N/A"),
    datasets: [
      {
        label: "Top Stock",
        data: topPieProducts.map((p) => p[inventoryKey] || 0),
        backgroundColor: [
          "rgba(40,166,69,0.6)",
          "rgba(54,162,235,0.6)",
          "rgba(255,206,86,0.6)",
          "rgba(75,192,192,0.6)",
          "rgba(153,102,255,0.6)"
        ]
      }
    ]
  };

  const categoryData = () => {
    const catMap = {};
    products.forEach((p) => {
      const cat = selectedTable === "barra" ? p.CATEGORIA : p.Categoria;
      const inv = p[inventoryKey] || 0;
      if (cat) catMap[cat] = (catMap[cat] || 0) + inv;
    });
    return {
      labels: Object.keys(catMap),
      datasets: [
        {
          label: "Inventory by Category",
          data: Object.values(catMap),
          backgroundColor: "rgba(54,162,235,0.6)"
        }
      ]
    };
  };
  const categoryChartData = categoryData();

  const lineChartData = {
    labels: sortedProducts.slice(0, itemsPerPage).map((p) => p[labelKey] || "N/A"),
    datasets: [
      {
        label: "Entrance",
        data: sortedProducts.slice(0, itemsPerPage).map((p) => p.ENTRADA || 0),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.2,
        fill: true
      }
    ]
  };

  const sortedAsc = [...products].sort((a, b) => (a[inventoryKey] || 0) - (b[inventoryKey] || 0));
  const bottomProducts = sortedAsc.slice(0, 5);
  const requestProducts = products.filter(
    (p) => p.Estatus && p.Estatus.toLowerCase() === "solicitar material"
  );
  const alertMap = new Map();
  bottomProducts.forEach((p) => alertMap.set(p[labelKey], p));
  requestProducts.forEach((p) => alertMap.set(p[labelKey], p));
  const alertProducts = Array.from(alertMap.values());

  const recentChanges = [...products]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const dashboardTitle = selectedTable === "barra" ? "Almacén - Barra" : "Almacén - Cocina";

  return (
    <div className="almacen-page fade-in">
      <div className="back-button">
        <Link to="/" className="back-link">
          ←
        </Link>
      </div>

      <h2 className="almacen-title">{dashboardTitle}</h2>

      
      <div className="almacen-topbar">
        <div className="topbar-left">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="location-dropdown"
          >
            <option value="Constitución">Constitución</option>
            <option value="Francisco I. Madero">Francisco I. Madero</option>
            <option value="Francisco Villa">Francisco Villa</option>
          </select>
        </div>

        <div className="topbar-center">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
            <span className="search-icon"></span>
          </div>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-dropdown"
          >
            <option value="">Ordenar por...</option>
            <option value="name-asc">Nombre (A-Z)</option>
            <option value="name-desc">Nombre (Z-A)</option>
            <option value="stock-asc">Stock (Low to High)</option>
            <option value="stock-desc">Stock (High to Low)</option>
          </select>
        </div>

        <div className="topbar-right">
          <button
            className="almacen-add-button"
            onClick={() => setShowAddModal(true)}
          >
            <span className="plus-icon">＋</span> Agregar Producto
          </button>
          {storedUser ? (
            <img
              src={storedUser.profileImage || "/images/default-profile.png"}
              alt="Profile"
              className="profile-thumbnail"
              onClick={() => navigate("/profile")}
            />
          ) : (
            <img
              src="/images/Playa_logo.jpg"
              alt="Logo"
              className="logo-circle"
            />
          )}
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
              Tabla
              {selectedView === "table" && (
                <div className="submenu">
                  <span
                    className={selectedTable === "insumos" ? "active" : ""}
                    onClick={() => setSelectedTable("insumos")}
                  >
                    Cocina
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
              Dashboard
            </li>
            <li
              className={selectedView === "transfer" ? "active" : ""}
              onClick={() => setSelectedView("transfer")}
            >
              Transfer
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {selectedView === "table" && (
            <div className="table-view">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      {columns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                      ))}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, index) => {
                      const globalIndex = startIndex + index;
                      return (
                        <tr key={item._id || globalIndex}>
                          {columns.map((col) => {
                            const cellValue = item[col.key] || "";
                            return (
                              <td key={col.key}>
                                {editingCell &&
                                editingCell.rowIndex === globalIndex &&
                                editingCell.field === col.key ? (
                                  // Si es el campo Supplier, Almacen o Category, mostrar menú desplegable
                                  (col.key === "PROVEEDOR" ||
                                    col.key === "ALMACEN" ||
                                    col.key === "CATEGORIA" ||
                                    (selectedTable === "insumos" &&
                                      (col.key === "Proveedor" ||
                                        col.key === "Categoria" ||
                                        col.key === "UnidadDM"))) ? (
                                    <select
                                      value={editingCell.value}
                                      onChange={handleCellInputChange}
                                      onBlur={() => saveCellEdit(globalIndex, col.key)}
                                      onKeyDown={(e) =>
                                        handleCellKeyDown(e, globalIndex, col.key)
                                      }
                                      autoFocus
                                    >
                                      {/* Opciones para Supplier en Barra */}
                                      {col.key === "PROVEEDOR" && selectedTable === "barra" && (
                                        ["Carmelita", "Sanito", "Gamesa", "Venegas", "CityClub", "Aguas Frescas", "Grupo Modelo", "CocaCola", "Charal", "Muñoz", "Abuelo", "CarneMart", "Tigre Feliz", "N/A"].map((option) => (
                                          <option key={option} value={option}>{option}</option>
                                        ))
                                      )}
                                      {/* Opciones para Almacen en Barra */}
                                      {col.key === "ALMACEN" && selectedTable === "barra" && (
                                        ["Piso 1", "Piso 2", "Piso 3", "Piso 4", "Piso 5", "Refrigerador Agua", "Refrigerador Cerveza", "Refrigerador Coca Cola", "Barra"].map((option) => (
                                          <option key={option} value={option}>{option}</option>
                                        ))
                                      )}
                                      {/* Opciones para Category en Barra */}
                                      {col.key === "CATEGORIA" && selectedTable === "barra" && (
                                        ["Desechables", "Salsas y Aderezos", "Limpieza", "Servicio", "Bebidas", "Latas", "Aceites", "Postres", "Refrescos", "Cervezas", "Alcohol", "Pan", "Sopas", "Especias", "Verduras", "Pescados y Mariscos", "Insumos Preparados", "Proteínas", "Complementos", "Lácteos", "Embutidos", "Tortillas", "Verdura"].map((option) => (
                                          <option key={option} value={option}>{option}</option>
                                        ))
                                      )}
                                      {/* Opciones para Insumos: Supplier, Category y UDM */}
                                      {selectedTable === "insumos" && col.key === "Proveedor" && (
                                        ["Carmelita", "Sanito", "Gamesa", "Venegas", "CityClub", "Aguas Frescas", "Grupo Modelo", "CocaCola", "Charal", "Muñoz", "Abuelo", "CarneMart", "Tigre Feliz", "N/A"].map((option) => (
                                          <option key={option} value={option}>{option}</option>
                                        ))
                                      )}
                                      {selectedTable === "insumos" && col.key === "Categoria" && (
                                        ["Desechables", "Salsas y Aderezos", "Limpieza", "Servicio", "Bebidas", "Latas", "Aceites", "Postres", "Refrescos", "Cervezas", "Alcohol", "Pan", "Sopas", "Especias", "Verduras", "Pescados y Mariscos", "Insumos Preparados", "Proteínas", "Complementos", "Lácteos", "Embutidos", "Tortillas", "Verdura"].map((option) => (
                                          <option key={option} value={option}>{option}</option>
                                        ))
                                      )}
                                      {selectedTable === "insumos" && col.key === "UnidadDM" && (
                                        ["Carmelita", "Sanito", "Gamesa", "Venegas", "CityClub", "Aguas Frescas", "Grupo Modelo", "CocaCola", "Charal", "Muñoz", "Abuelo", "CarneMart", "Tigre Feliz", "N/A"].map((option) => (
                                          <option key={option} value={option}>{option}</option>
                                        ))
                                      )}
                                      {/* Si ninguna de las anteriores, se muestra un input normal (por ejemplo para otros campos) */}
                                    </select>
                                  ) : (
                                    <input
                                      type={
                                        ["STOCK", "ENTRADA", "Stock_minimo", "Inventario"].includes(col.key)
                                          ? "number"
                                          : "text"
                                      }
                                      value={editingCell.value}
                                      onChange={handleCellInputChange}
                                      onBlur={() => saveCellEdit(globalIndex, col.key)}
                                      onKeyDown={(e) => handleCellKeyDown(e, globalIndex, col.key)}
                                      autoFocus
                                    />
                                  )
                                ) : (
                                  <div className="cell-display">
                                    <span>{cellValue}</span>
                                    {col.editable && (
                                      <button
                                        className="edit-btn"
                                        onClick={() => startCellEdit(globalIndex, col.key)}
                                      >
                                        ✏
                                      </button>
                                    )}
                                  </div>
                                )}
                              </td>
                            );
                          })}
                          <td>
                            <button
                              className="delete-btn"
                              onClick={() => {
                                setProductToDelete(item._id);
                                setShowDeleteModal(true);
                              }}
                              title="Delete Product"
                            >
                              🗑
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`page-btn ${page === currentPage ? "active" : ""}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedView === "graphs" && (
            <div className="graphs-view">
              <div className="dashboard-summary">
                <div className="summary-card">
                  <h4>Total de Productos:</h4>
                  <p>{totalProductsCount}</p>
                </div>
                <div className="summary-card">
                  <h4>Total de inventario: </h4>
                  <p>{totalInventory}</p>
                </div>
                <div className="summary-card">
                  <h4>Productos para Ordenar: </h4>
                  <p>{productsToReorder}</p>
                </div>
                <button className="refresh-btn" onClick={loadData}>
                  Reiniciar datos
                </button>
              </div>

              <div className="dashboard-row">
                <div className="dashboard-chart">
                  <h3>Productos con mas stock</h3>
                  <div className="chart-container">
                    <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                  </div>
                </div>
                <div className="dashboard-chart">
                  <h3>Stock por categoria</h3>
                  <div className="chart-container">
                    <Bar data={categoryChartData} options={{ maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>

              <div className="dashboard-row">
                <div className="dashboard-chart">
                  <h3>Tendencias en los productos</h3>
                  <div className="chart-container">
                    <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>

              <div className="dashboard-row">
                <h3 className="alert-title"><em>!Alerta!</em> <br /> Productos sin stock. <br /> Se necesita solicitar material</h3>
                <div className="alert-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>{selectedTable === "barra" ? "Stock" : "Inventory"}</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alertProducts.map((p, i) => (
                        <tr key={i}>
                          <td>{p[labelKey]}</td>
                          <td>{p[inventoryKey]}</td>
                          <td>{p.Estatus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="dashboard-row recent-changes">
                <h3 className= "Cambios-recientes">Cambios recientes</h3>
                <div className="recent-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Ultima Actualización</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentChanges.map((p, i) => (
                        <tr key={i}>
                          <td>{p[labelKey]}</td>
                          <td>{new Date(p.updatedAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {selectedView === "transfer" && (
            <div className="transfer-view">
              <h3>Transferencia de productos</h3>
              <p>Proximamente...</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Agregar Producto</h3>
            <div className="modal-form">
              {selectedTable === "barra" ? (
                <>
                  <label>
                    Nombre:
                    <input
                      type="text"
                      value={newProduct.DESCRIPCION}
                      onChange={(e) => handleAddModalChange(e, "DESCRIPCION")}
                    />
                  </label>
                  <label>
                    Categoría:
                    <select
                      value={newProduct.CATEGORIA}
                      onChange={(e) => handleAddModalChange(e, "CATEGORIA")}
                    >
                      {[
                        "N/A",
                        "Desechables",
                        "Salsas y Aderezos",
                        "Limpieza",
                        "Servicio",
                        "Bebidas",
                        "Latas",
                        "Aceites",
                        "Postres",
                        "Refrescos",
                        "Cervezas",
                        "Alcohol",
                        "Pan",
                        "Sopas",
                        "Especias",
                        "Verduras",
                        "Pescados y Mariscos",
                        "Insumos Preparados",
                        "Proteínas",
                        "Complementos",
                        "Lácteos",
                        "Embutidos",
                        "Tortillas",
                        "Verdura"
                      ].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Almacen:
                    <select
                      value={newProduct.ALMACEN}
                      onChange={(e) => handleAddModalChange(e, "ALMACEN")}
                    >
                      {[
                        "N/A",
                        "Piso 1",
                        "Piso 2",
                        "Piso 3",
                        "Piso 4",
                        "Piso 5",
                        "Refrigerador Agua",
                        "Refrigerador Cerveza",
                        "Refrigerador Coca Cola",
                        "Barra"
                      ].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Proveedor:
                    <select
                      value={newProduct.PROVEEDOR}
                      onChange={(e) => handleAddModalChange(e, "PROVEEDOR")}
                    >
                      {[
                        "N/A",
                        "Carmelita",
                        "Sanito",
                        "Gamesa",
                        "Venegas",
                        "CityClub",
                        "Aguas Frescas",
                        "Grupo Modelo",
                        "CocaCola",
                        "Charal",
                        "Muñoz",
                        "Abuelo",
                        "CarneMart",
                        "Tigre Feliz"
                      ].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    UDM:
                    <select
                      value={newProduct.UDM}
                      onChange={(e) => handleAddModalChange(e, "UDM")}
                    >
                      {[
                        "N/A",
                        "Pz", 
                        "% de Caja", 
                        "Cajas", 
                        "Paquetes 30", 
                        "Paquetes 27", 
                        "Paquete 165", 
                        "Rollos", 
                        "Litro", 
                        "Cartón de 960ml", 
                        "Bote de 1.8L", 
                        "Frasco de 1.4L", 
                        "Botes de 320gr.", 
                        "Lata de 3.65kg", 
                        "Botes de 4L", 
                        "800ml", 
                        "Galón 3.7L", 
                        "Galón 1.89L", 
                        "Latas", 
                        "Lata de 820gr", 
                        "gr", 
                        "Latas de 425gr", 
                        "Rebanadas", 
                        "Bolsa de 2kg", 
                        "Kg", 
                        "% de Cambro", 
                        "Charola", 
                        "% del Bote", 
                        "Kilo", 
                        "Bolsitas 50gr", 
                        "% de recipiente", 
                        "Bolsita 50gr", 
                        "Bolsita de 150gr", 
                        "Caja 500gr", 
                        "% de la Tina", 
                        "Pz (Cabeza)"
                      ].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Entrada:
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
                </>
              ) : (
                <>
                  <label>
                    Code:
                    <input
                      type="number"
                      value={newProduct.CODIGO}
                      onChange={(e) => handleAddModalChange(e, "CODIGO")}
                    />
                  </label>
                  <label>
                    Nombre:
                    <input
                      type="text"
                      value={newProduct.DESCRIPCION}
                      onChange={(e) => handleAddModalChange(e, "DESCRIPCION")}
                    />
                  </label>
                  <label>
                    Categoría:
                    <select
                      value={newProduct.CATEGORIA}
                      onChange={(e) => handleAddModalChange(e, "CATEGORIA")}
                    >
                      {[
                        "Desechables",
                        "Salsas y Aderezos",
                        "Limpieza",
                        "Servicio",
                        "Bebidas",
                        "Latas",
                        "Aceites",
                        "Postres",
                        "Refrescos",
                        "Cervezas",
                        "Alcohol",
                        "Pan",
                        "Sopas",
                        "Especias",
                        "Verduras",
                        "Pescados y Mariscos",
                        "Insumos Preparados",
                        "Proteínas",
                        "Complementos",
                        "Lácteos",
                        "Embutidos",
                        "Tortillas",
                        "Verdura"
                      ].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Almacen:
                    <select
                      value={newProduct.ALMACEN}
                      onChange={(e) => handleAddModalChange(e, "ALMACEN")}
                    >
                      {[
                        "Alacena",
                        "Congelador 1",
                        "Congelador 2",
                        "Refrigerador de verdura",
                        "Refrigerador Marisco del dia",
                        "Alacena especias"
                      ].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Proveedor:
                    <select
                      value={newProduct.PROVEEDOR}
                      onChange={(e) => handleAddModalChange(e, "PROVEEDOR")}
                    >
                      {[
                        "Carmelita",
                        "Sanito",
                        "Gamesa",
                        "Venegas",
                        "CityClub",
                        "Aguas Frescas",
                        "Grupo Modelo",
                        "CocaCola",
                        "Charal",
                        "Muñoz",
                        "Abuelo",
                        "CarneMart",
                        "Tigre Feliz",
                        "N/A"
                      ].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Stock Min:
                    <input
                      type="number"
                      value={newProduct.STOCK}
                      onChange={(e) => handleAddModalChange(e, "STOCK")}
                    />
                  </label>
                  <label>
                    Inventario:
                    <input
                      type="number"
                      value={newProduct.ENTRADA}
                      onChange={(e) => handleAddModalChange(e, "ENTRADA")}
                    />
                  </label>
                  <label>
                    Estatus:
                    <select
                      value={newProduct.ESTATUS || ""}
                      onChange={(e) => handleAddModalChange(e, "ESTATUS")}
                    >
                      {["Solicitar material", "Hay suficiente", "N/A"].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    UDM:
                    <select
                      value={newProduct.UDM}
                      onChange={(e) => handleAddModalChange(e, "UDM")}
                    >
                      {[
                        "Carmelita",
                        "Sanito",
                        "Gamesa",
                        "Venegas",
                        "CityClub",
                        "Aguas Frescas",
                        "Grupo Modelo",
                        "CocaCola",
                        "Charal",
                        "Muñoz",
                        "Abuelo",
                        "CarneMart",
                        "Tigre Feliz",
                        "N/A"
                      ].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              )}
            </div>
            <div className="modal-buttons">
              <button onClick={handleAddProduct}>Add Product</button>
              <button onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar producto */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this product?</p>
            <div className="modal-buttons">
              <button
                className="confirm-btn"
                onClick={() => {
                  handleDeleteProduct(productToDelete);
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
              >
                Confirm
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Almacen;
