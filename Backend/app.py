'''
python3 -m venv venv
source venv/bin/activate
pip install Flask
export FLASK_APP=app.py
flask run
'''
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import base64
import requests
# store api key on config file as: api_key = "YOUR_OPENAI_API_KEY"
import config
from gpt4_food_classifier import food_classify
from black import is_black_screen
import numpy as np
import cv2

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

def is_black_screen(image_data, threshold=5):
    image_np = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    if image is None:
        return False

    avg_color = np.mean(image, axis=(0, 1))
    print(avg_color)

    avg = (avg_color[0] + avg_color[1] + avg_color[2]) / 3
    print(avg)

    return avg <= threshold

@app.route('/upload', methods=['POST'])
def upload():
    data = request.get_json()  # Get the JSON data sent from frontend
    if 'image' not in data:
        return jsonify({"message": "No image data found"}), 400
    image_data = data['image']
    if image_data.startswith('data:image/jpeg;base64,'):
        header, image_data = image_data.split(',', 1)
    # Decode the base64 string to bytes
    image_data_bytes = base64.b64decode(image_data)
    if is_black_screen(image_data_bytes):
        return jsonify({"message": "Fridge is closed."}), 200

    api_key = config.api_key

    payload = {
    "model": "gpt-4-vision-preview",
    "messages": [
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": "List out the food items in this image in a csv format such as: \neggs, strawberries, lemons. If there are no food items, respond with a single space"
            },
            {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{image_data}",
                "detail": "low"
            }
            }
        ]
        }
    ],
    "max_tokens": 300
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)  # Adjust URL as needed
    content = response.json()['choices'][0]['message']['content']
    if "sorry" in content.lower():
        return jsonify({"message": []}), 200
    food_items = list(map(str.strip, content.split(',')))

    if response.status_code == 200:
        return jsonify({"message": food_items}), 200
    else:
        return jsonify({"error": "Failed to process image"}), response.status_code


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)