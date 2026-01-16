from flask import Flask, request, jsonify
import joblib
import os
from pathlib import Path

app = Flask(__name__)

# Get the project root and find models in backend/models
project_root = Path(__file__).resolve().parent.parent
models_dir = project_root / "backend" / "models"
vectorizer_path = models_dir / "vectorizer.pkl"
model_path = models_dir / "reward_model.pkl"

print(f"Loading models from: {models_dir}")
print(f"Vectorizer path: {vectorizer_path}")
print(f"Model path: {model_path}")

vectorizer = joblib.load(str(vectorizer_path))
clf = joblib.load(str(model_path))

print("Models loaded successfully!")

@app.route("/score", methods=["POST"])
def score():
    data = request.json
    prompts = data.get("prompts", [])

    scores = []
    for p in prompts:
        X = vectorizer.transform([p])
        prob = clf.predict_proba(X)[0][1]
        scores.append(prob)

    return jsonify({"scores": scores})

if __name__ == "__main__":
    app.run(port=5001)