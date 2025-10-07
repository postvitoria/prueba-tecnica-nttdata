import React, { useState } from "react";

const DatasetTable = ({ datasets }) => {
  const [sortField, setSortField] = useState("scoring");
  const [sortDirection, setSortDirection] = useState("desc");

  if (datasets.length === 0) {
    return (
      <div className="no-data">
        <div className="no-data-icon">📊</div>
        <h3>No hay datos disponibles</h3>
        <p>No se pudieron cargar los datasets en este momento.</p>
      </div>
    );
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedDatasets = [...datasets].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "scoring") {
      aValue = aValue || 0;
      bValue = bValue || 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const getSortIcon = (field) => {
    if (sortField !== field) return "";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const getScoreColor = (score) => {
    if (score === null || score === undefined) return "#6c757d";
    if (score > 200) return "#20c997";
    if (score <= 200 && score > 150) return "#0dcaf0";
    if (score >= 150) return "#ffc107";
    return "#dc3545";
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Datasets Ordenados por Calidad</h2>
        <span className="dataset-count">{datasets.length} resultados</span>
      </div>
      
      <div className="table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("identifier")}>
                Identifier {getSortIcon("identifier")}
              </th>
              <th onClick={() => handleSort("title")}>
                Título {getSortIcon("title")}
              </th>
              <th onClick={() => handleSort("publisher_name")}>
                Publicador {getSortIcon("publisher_name")}
              </th>
              <th onClick={() => handleSort("scoring")}>
                Score {getSortIcon("scoring")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDatasets.map((dataset, index) => (
              <tr key={dataset.identifier || index} className="dataset-row">
                <td className="identifier-cell">
                  <span className="identifier-text">{dataset.identifier}</span>
                </td>
                <td className="title-cell">
                  <div className="title-content">
                    <span className="title-text">{dataset.title || "Sin título"}</span>
                  </div>
                </td>
                <td className="publisher-cell">
                  <span className="publisher-text">{dataset.publisher_name || "N/A"}</span>
                </td>
                <td className="scoring-cell">
                  <div 
                    className="score-badge"
                    style={{ 
                      backgroundColor: getScoreColor(dataset.scoring),
                      opacity: dataset.scoring ? 1 : 0.6
                    }}
                  >
                    {dataset.scoring ? dataset.scoring.toFixed(1) : "N/A"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DatasetTable;