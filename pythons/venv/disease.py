import os
import base64
import requests
import re
import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Load models
crop_recommendation_model = joblib.load("crop_recommendation_model.pkl")
crop_yield_model = joblib.load("crop_yield_predictor.pkl")

# API Keys
TOMORROW_API_KEY = os.getenv("TOMORROW_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

HEADERS = {
    "Content-Type": "application/json"
}

# Helper to convert image to base64
def encode_image(file):
    return base64.b64encode(file.read()).decode("utf-8")

# Send image to Gemini API
def query_gemini(image_base64: str) -> str:
    prompt = """
You are a crop disease expert AI. From the given image, detect the crop disease and respond in this exact JSON format:

{
  "disease": "Disease name",
  "duration": "How long the disease lasts or affects the crop",
  "causative_agents": ["List of bacteria, fungi, or reasons"],
  "untreated_result": "What happens if it's not treated",
  "preventive_measures": ["List of preventive steps"],
  "treatment": ["List of treatment methods"]
}

Only respond with valid JSON, no explanation, no markdown.
"""

    body = {
        "contents": [
            {
                "parts": [
                    {"text": prompt},
                    {
                        "inlineData": {
                            "mimeType": "image/jpeg",
                            "data": image_base64
                        }
                    }
                ]
            }
        ]
    }

    response = requests.post(GEMINI_API_URL, headers=HEADERS, json=body)
    res = response.json()

    try:
        content = res["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError):
        return None

    # Extract JSON using regex
    json_match = re.search(r'\{[\s\S]*\}', content)
    if json_match:
        import json
        try:
            return json.loads(json_match.group())
        except json.JSONDecodeError:
            return None
    return None

@app.route("/predict-disease", methods=["POST"])
def predict_disease():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    image_file = request.files["image"]
    image_base64 = encode_image(image_file)

    result = query_gemini(image_base64)
    if result:
        return jsonify(result)
    else:
        return jsonify({"error": "Failed to detect disease"}), 500

@app.route("/weather")
def get_weather():
    state = request.args.get("state")
    if not state:
        return jsonify({"error": "State not provided"}), 400

    try:
        url = f"https://api.tomorrow.io/v4/weather/realtime?location={state}&apikey={TOMORROW_API_KEY}"
        response = requests.get(url)
        data = response.json()

        weather_data = {
            "temperature": data['data']['values']['temperature'],      # °C
            "humidity": data['data']['values']['humidity'],            # %
            "rainfall": data['data']['values'].get('precipitationIntensity', 0) * 24  
                  }
        return jsonify(weather_data)
    except Exception as e:
        print("Weather fetch error:", e)
        return jsonify({"error": "Failed to fetch weather data"}), 500

@app.route("/recommend-crop", methods=["POST"])
def recommend_crop():
    try:
        data = request.get_json()
        print("Received data:", data)

        features = [
            float(data['temperature']),
            float(data['humidity']),
            float(data['ph']),
            float(data['rainfall'])
        ]
        print("Features:", features)

        prediction = crop_recommendation_model.predict([features])[0]
        print("Predicted crop:", prediction)

        crop_info = {
            "Rice": {
                "icon": "🌾",
                "yield": "45–60 quintals/hectare",
                "profit": "₹35,000–50,000/hectare",
                "season": "Kharif",
                "suitability": 92,
                "tips": ["Use quality seeds", "Ensure proper irrigation", "Apply organic fertilizers"]
            },

        }

        result = crop_info.get(prediction, {
            "icon": "🌿",
            "yield": "N/A",
            "profit": "N/A",
            "season": "N/A",
            "suitability": 70,
            "tips": ["No specific tips available"]
        })
        result["name"] = prediction

        return jsonify(result)

    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": "Prediction failed"}), 500
    
@app.route("/api/predict-yield", methods=["POST"])
def predict_yield():
    try:
        data = request.get_json()
        print("Yield prediction request data:", data)

        # Extract features from request
        temperature = float(data['temperature'])
        humidity = float(data['humidity'])
        rainfall = float(data['rainfall'])
        crop_type = data['crop_type'] 
        land_size = float(data['land_size'])


        crop_mapping = {
            "wheat": 0,
            "rice": 1,
            "maize": 2,

        }
        crop_encoded = crop_mapping.get(crop_type.lower(), -1)
        if crop_encoded == -1:
            return jsonify({"error": "Unsupported crop type"}), 400

        features = np.array([[temperature, humidity, rainfall, crop_encoded, land_size]])
        predicted_yield = crop_yield_model.predict(features)[0]


        predicted_yield = round(predicted_yield, 2)

        return jsonify({"predicted_yield": predicted_yield})

    except Exception as e:
        print("Yield prediction error:", e)
        return jsonify({"error": "Failed to predict yield"}), 500


if __name__ == "__main__":
    app.run(debug=True)
