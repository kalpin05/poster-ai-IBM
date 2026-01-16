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

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)

clf = LogisticRegression()
clf.fit(X, labels)

joblib.dump(vectorizer, "vectorizer.pkl")
joblib.dump(clf, "reward_model.pkl")

print("Reward model trained.")