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
    import re

    text = ' '.join(text.split()).strip()
    full_text = text.lower()

    problem_phrases = {
        'crashes': 'application is crashing',
        'crash': 'application is crashing',
        'freezes': 'application is freezing',
        'not working': 'feature is not working',
        'not loading': 'page is not loading',
        'error': 'an error is occurring',
        'cannot login': 'user cannot login',
        'locked out': 'account is locked out',
        'charged twice': 'duplicate charge detected',
        'wrong amount': 'incorrect billing amount',
        'refund': 'refund has been requested',
        'not received': 'item or response not received',
        'not responding': 'system is not responding',
        'down': 'service is down',
        'broken': 'feature is broken',
        'hacked': 'account security compromised',
        'cannot access': 'user cannot access the resource',
        'data loss': 'data loss reported',
        'not syncing': 'sync issue detected',
        'upload': 'file upload issue reported',
        'download': 'file download issue reported',
        'timeout': 'connection timeout occurring',
        'payment failed': 'payment failure reported',
        'duplicate': 'duplicate entry detected',
        'dark mode': 'dark mode feature requested',
        'dark theme': 'dark theme feature requested',
        'feature': 'new feature has been requested',
        'add': 'new functionality has been requested',
        'request': 'enhancement has been requested',
        'suggestion': 'improvement has been suggested',
        'integration': 'integration feature requested',
        'export': 'export feature requested',
        'import': 'import feature requested',
        'notification': 'notification feature requested',
    }

    detected_problem = None
    for keyword, description in problem_phrases.items():
        if keyword in full_text:
            detected_problem = description
            break

    if not detected_problem:
        detected_problem = f"{category.lower()} issue reported"

    tried_phrases = []
    if 'clear' in full_text and 'cache' in full_text:
        tried_phrases.append('cleared cache')
    if 'different browser' in full_text or 'another browser' in full_text:
        tried_phrases.append('tried different browsers')
    if 'restart' in full_text or 'reboot' in full_text:
        tried_phrases.append('restarted the system')
    if 'reinstall' in full_text:
        tried_phrases.append('reinstalled the application')
    if 'update' in full_text or 'latest version' in full_text:
        tried_phrases.append('updated the application')

    affected_items = []
    if 'pdf' in full_text:
        affected_items.append('PDF files')
    if 'image' in full_text or 'jpg' in full_text or 'png' in full_text:
        affected_items.append('image files')
    if 'excel' in full_text or 'xlsx' in full_text:
        affected_items.append('Excel files')

    # Build summary - NO priority mention
    line1 = f"User reports {detected_problem}"
    if affected_items:
        line1 += f" affecting {' and '.join(affected_items)}"
    line1 += "."

    line2_parts = []
    if tried_phrases:
        line2_parts.append(f"Already attempted: {', '.join(tried_phrases)}.")
    if not line2_parts:
        if category == 'Feature Request':
            line2_parts.append("This request has been noted and forwarded to the product team.")
        elif category == 'Billing Issue':
            line2_parts.append("The billing team will investigate and respond promptly.")
        elif category == 'Technical Problem':
            line2_parts.append("The technical team will investigate this issue.")
        elif category == 'Account Management':
            line2_parts.append("The support team will assist with the account issue.")
        else:
            line2_parts.append("Our team will review and respond shortly.")

    summary = f"{line1} {' '.join(line2_parts)}"
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
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)