import requests

SEARCH_URL = "https://data.europa.eu/api/hub/search/datasets/"
DETAIL_URL_BASE = "https://data.europa.eu/api/hub/search/datasets/"

def fetch_dataset_ids(limit=50):
    params = {
        "catalogue": "datos-gob-es",
        "size": limit
    }

    response = requests.get(SEARCH_URL, params=params)
    response.raise_for_status()
    ids = response.json()

    if not isinstance(ids, list):
        raise ValueError("El endpoint no devolvió una lista de IDs")

    return ids[:limit]


def fetch_dataset_details(dataset_id):
    response = requests.get(f"{DETAIL_URL_BASE}{dataset_id}")
    if response.status_code != 200:
        print(f"Error obteniendo detalles de {dataset_id}: {response.status_code}")
        return None

    data = response.json().get("result")
    if not data:
        print(f"No se encontró 'result' en la respuesta de {dataset_id}")
        return None

    identifier = data.get("id")
    if not identifier:
        id_list = data.get("identifier")
        if isinstance(id_list, list) and len(id_list) > 0:
            identifier = id_list[0]

    title_field = data.get("title")
    publisher_name = (data.get("publisher") or {}).get("name")
    scoring = (data.get("quality_meas") or {}).get("scoring")
    
    return {
        "identifier": identifier,
        "title": title_field["es"],
        "publisher_name": publisher_name,
        "scoring": scoring
    }
