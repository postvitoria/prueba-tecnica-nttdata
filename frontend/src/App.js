import React, { useEffect, useState } from "react";
import DatasetTable from "./components/DatasetTable";
import { fetchDatasets } from "./services/api";
import "./App.css";

function App() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDatasets();
      setDatasets(data);
    } catch (err) {
      setError("Error al cargar los datos");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">

            <h1>Calidad de Datasets</h1>
            <span className="subtitle">datos.gob.es</span>
          </div>
          <button className="reload-btn" onClick={loadData} disabled={loading}>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <span>Recargar Datos</span>
            )}
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="stats-bar">
          <div className="stat-card">
            <span className="stat-number">{datasets.length}</span>
            <span className="stat-label">Total Datasets</span>
          </div>
          
          <div className="stat-card">
            <span className="stat-number">
              {datasets.length > 0 
                ? Math.max(...datasets.map(d => d.scoring || 0)).toFixed(1)
                : "0.0"
              }
            </span>
            <span className="stat-label">Max Scoring</span>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={loadData}>Reintentar</button>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando datasets...</p>
          </div>
        ) : (
          <DatasetTable datasets={datasets} />
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by React • EU Open Data Portal</p>
      </footer>
    </div>
  );
}

export default App;