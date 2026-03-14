import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib
import os

# Load dataset
print("Loading dataset...")
df = pd.read_csv('dataset/tickets.csv')

print(f"Total samples: {len(df)}")
print(f"Categories: {df['category'].unique()}")

# ── Train Category Classifier ──
print("\nTraining category classifier...")
X = df['text']
y_category = df['category']
y_priority = df['priority']

X_train, X_test, y_train, y_test = train_test_split(
    X, y_category, test_size=0.2, random_state=42
)

category_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=5000,
        stop_words='english'
    )),
    ('clf', RandomForestClassifier(
        n_estimators=100,
        random_state=42
    ))
])

category_pipeline.fit(X_train, y_train)
y_pred = category_pipeline.predict(X_test)

print("\nCategory Classification Report:")
print(classification_report(y_test, y_pred))

# ── Train Priority Classifier ──
print("Training priority classifier...")
X_train2, X_test2, y_train2, y_test2 = train_test_split(
    X, y_priority, test_size=0.2, random_state=42
)

priority_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=5000,
        stop_words='english'
    )),
    ('clf', RandomForestClassifier(
        n_estimators=100,
        random_state=42
    ))
])

priority_pipeline.fit(X_train2, y_train2)
y_pred2 = priority_pipeline.predict(X_test2)

print("\nPriority Classification Report:")
print(classification_report(y_test2, y_pred2))

# ── Save Models ──
print("\nSaving models...")
os.makedirs('model', exist_ok=True)
joblib.dump(category_pipeline, 'model/category_classifier.pkl')
joblib.dump(priority_pipeline, 'model/priority_classifier.pkl')
print("Models saved to model/ folder successfully!")