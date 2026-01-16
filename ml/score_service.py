from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

vectorizer = joblib.load("vectorizer.pkl")
clf = joblib.load("reward_model.pkl")

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