from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Dataset(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    identifier = db.Column(db.String, unique=True, nullable=False)
    title = db.Column(db.String, nullable=False)
    publisher_name = db.Column(db.String)
    scoring = db.Column(db.Float)