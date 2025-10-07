from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from fetch_data import fetch_dataset_ids, fetch_dataset_details

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///datasets.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class Dataset(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    identifier = db.Column(db.String(255), unique=True, nullable=False)
    title = db.Column(db.String(500))
    publisher_name = db.Column(db.String(255))
    scoring = db.Column(db.Float)

def load_data(db, Dataset):
    db.create_all()

    if Dataset.query.count() == 0:
        print("Cargando datasets desde data.europa.eu...")

        dataset_ids = fetch_dataset_ids(limit=50)
        for dataset_id in dataset_ids:
            details = fetch_dataset_details(dataset_id)
            if not details or not details.get("identifier"):
                continue
            dataset = Dataset(
                identifier=details["identifier"],
                title=details["title"],
                publisher_name=details["publisher_name"],
                scoring=details["scoring"],
            )
            db.session.add(dataset)
        db.session.commit()

        print(f"{Dataset.query.count()} datasets insertados en la base de datos.")


@app.route("/datasets", methods=["GET"])
def get_datasets():
    datasets = Dataset.query.order_by(Dataset.scoring.desc().nullslast()).all()
    result = [
        {
            "identifier": d.identifier,
            "title": d.title,
            "publisher_name": d.publisher_name,
            "scoring": d.scoring,
        }
        for d in datasets
    ]
    return jsonify(result)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        load_data(db, Dataset)

    app.run(debug=True)
