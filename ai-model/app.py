from flask import Flask, request, jsonify
import joblib
import re
import os

app = Flask(__name__)

# Load trained models
print("Loading AI models...")
category_model = joblib.load('model/category_classifier.pkl')
priority_model = joblib.load('model/priority_classifier.pkl')
print("Models loaded successfully!")

# Clean text helper
def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# Generate 2-line summary
def generate_summary(text, category, priority):
    text = text.strip()
    sentences = text.split('.')
    first = sentences[0].strip() if sentences[0].strip() else text[:100]
    summary = f"Customer reported a {category} issue with {priority} priority. {first}."
    return summary

# Health check
@app.route('/', methods=['GET'])
def health():
    return jsonify({"message": "AI Service Running", "status": "ok"})

# Main prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400

        raw_text = data['text']
        cleaned = clean_text(raw_text)

        # Predict category
        category = category_model.predict([cleaned])[0]

        # Predict priority
        priority = priority_model.predict([cleaned])[0]

        # Generate 2-line summary
        summary = generate_summary(raw_text, category, priority)

        # Map category to team
        category_team_map = {
            'Billing Issue': 'finance_team',
            'Technical Problem': 'technical_team',
            'Feature Request': 'product_team',
            'Account Management': 'general_team',
            'General Query': 'general_team'
        }

        assigned_team = category_team_map.get(category, 'general_team')

        return jsonify({
            "category": category,
            "priority": priority,
            "summary": summary,
            "assignedTeam": assigned_team
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Batch prediction endpoint
@app.route('/predict/batch', methods=['POST'])
def predict_batch():
    try:
        data = request.get_json()

        if not data or 'tickets' not in data:
            return jsonify({"error": "No tickets provided"}), 400

        results = []
        for ticket in data['tickets']:
            cleaned = clean_text(ticket['text'])
            category = category_model.predict([cleaned])[0]
            priority = priority_model.predict([cleaned])[0]
            summary = generate_summary(ticket['text'], category, priority)

            results.append({
                "id": ticket.get('id', ''),
                "category": category,
                "priority": priority,
                "summary": summary
            })

        return jsonify({"results": results})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)