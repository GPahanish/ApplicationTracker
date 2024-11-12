from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)

# Configure CORS properly
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Configure SQLite database
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'applications.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

#Table to store job applications
class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    date_applied = db.Column(db.Date, nullable=False)
    notes = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'company': self.company,
            'position': self.position,
            'status': self.status,
            'dateApplied': self.date_applied.isoformat(),
            'notes': self.notes
        }

# Create tables
with app.app_context():
    db.create_all()

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response
# Routes
@app.route('/api/applications', methods=['GET'])
def get_applications():
    try:
        applications = Application.query.all()
        return jsonify([app.to_dict() for app in applications])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/applications', methods=['POST'])
def add_application():
    try:
        data = request.json
        new_application = Application(
            company=data['company'],
            position=data['position'],
            status=data['status'],
            date_applied=datetime.strptime(data['dateApplied'], '%Y-%m-%d').date(),
            notes=data['notes']
        )
        db.session.add(new_application)
        db.session.commit()
        return jsonify(new_application.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/api/applications/<int:id>', methods=['DELETE'])
def delete_application(id):
    try:
        application = Application.query.get_or_404(id)
        db.session.delete(application)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)