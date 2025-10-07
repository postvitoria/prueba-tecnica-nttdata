export const fetchDatasets = async () => {
  try {
    const response = await fetch("http://localhost:5000/datasets");
    if (!response.ok) throw new Error("Error al obtener los datasets");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
