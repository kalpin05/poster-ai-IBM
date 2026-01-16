import json
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

DATA_PATH = Path(__file__).resolve().parent / "data" / "feedback.json"

with open(DATA_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

texts = [d["prompt"] for d in data]
labels = [1 if d["rating"] >= 4 else 0 for d in data]

print(f"Training with {len(texts)} examples")
print(f"Positive examples: {sum(labels)}")
print(f"Negative examples: {len(labels) - sum(labels)}")

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)

clf = LogisticRegression()
clf.fit(X, labels)

# Save models to backend/models directory
project_root = Path(__file__).resolve().parent.parent
models_dir = project_root / "backend" / "models"
models_dir.mkdir(exist_ok=True)

vectorizer_path = models_dir / "vectorizer.pkl"
model_path = models_dir / "reward_model.pkl"

joblib.dump(vectorizer, str(vectorizer_path))
joblib.dump(clf, str(model_path))

print(f"Models saved to: {models_dir}")
print("Reward model trained.")