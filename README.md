# 🚀 Proyecto ETL de Datasets Europeos

Este proyecto implementa una pequeña **pipeline de extracción, transformación y carga (ETL)** que obtiene información de datasets públicos desde la API de **[data.europa.eu](https://data.europa.eu/en)**, almacena los datos relevantes en una base de datos local y los expone a través de un backend **Flask**, consumido por una interfaz **React**.

---

## 📁 Organización del repositorio

```
├── backend/
│   ├── app.py               # Servidor Flask y endpoints
│   ├── fetch_data.py        # Lógica de extracción y procesamiento de datasets
│   ├── config.py            # Configuración previa de SQLite
│   ├── datasets.db          # Base de datos SQLite generada automáticamente
│   └── requirements.txt     # Dependencias del backend
│
├── frontend/
│   ├── src/
│   │   ├── App.js              # Página principal de React
│   │   ├── components/         
│   │       └── DatasetTable.js # Componente reutilizables
│   │   └── services/        
│   │       └── api.js          # Llamadas al backend
│   ├── package.json            # Dependencias y scripts de React
│
├── README.md                   # Este documento
```

---

## ⚙️ Pipeline de extracción y procesamiento

El flujo de datos sigue una estructura ETL clásica:

```mermaid
flowchart TD
    A[API data.europa.eu - Search] -->|Obtener 50 primeros IDs| B[Extracción de IDs]
    B --> C[API data.europa.eu - Details]
    C -->|Procesar JSON, extraer campos relevantes| D[Transformación]
    D -->|Guardar en SQLite (Dataset)| E[Base de datos local]
    E -->|Flask /datasets| F[Backend API]
    F -->|Axios Fetch| G[Frontend React]
    G -->|Renderizado de tabla y métricas| H[Visualización]
```

### 🔍 Detalle de pasos

1. **Extracción:**
   Se consultan los 50 primeros *datasets* a través del endpoint `/search/datasets` de la API de *data.europa.eu*.
   De esa respuesta se obtiene la lista de identificadores (`id`).

2. **Transformación:**
   Para cada `id`, se hace una llamada al endpoint `/api/hub/datasets/{id}`.
   De la respuesta JSON se extraen los campos:

   * `identifier`
   * `title`
   * `publisher.name`
   * `quality_meas.scoring`

3. **Carga:**
   Los datos transformados se almacenan en una base de datos **SQLite** mediante SQLAlchemy.
   Esto ocurre automáticamente al iniciar el backend (no en la primera request).

4. **Exposición:**
   El endpoint `/datasets` de Flask devuelve los registros almacenados en formato JSON.

5. **Visualización:**
   El frontend React consume ese endpoint y muestra los datasets en una tabla o lista interactiva.

---

## 🧱 Tecnologías empleadas

| Componente  | Tecnología         | Descripción                                          |
| ----------- | ------------------ | ---------------------------------------------------- |
| Backend     | Flask + SQLAlchemy | API REST y persistencia en SQLite                    |
| Frontend    | React + Vite       | Interfaz web ligera para visualizar datasets         |
| API externa | data.europa.eu     | Fuente oficial de datos abiertos europeos            |
| BD local    | SQLite             | Almacenamiento persistente de los datasets extraídos |

---

## ⚡ Ejecución local

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend se servirá normalmente en [http://localhost:3000](http://localhost:3000)
y el backend en [http://localhost:5000](http://localhost:5000).

---

## 📌 Información adicional

* Los datasets solo se cargan **una vez al iniciar el servidor**.
  Si ya existen en la base, no se vuelven a insertar.
* Se validan los campos obligatorios para evitar registros incompletos o duplicados.
* El diseño del pipeline está desacoplado del backend, facilitando su extensión a otros orígenes de datos o bases de datos relacionales.

---

**Autor:** *Gabriel Postigo Vitoria*
**Versión:** 1.0
**Licencia:** MIT