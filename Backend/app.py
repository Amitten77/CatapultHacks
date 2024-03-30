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

app = Flask(__name__)
CORS(app) # This line is important to handle Cross-Origin Resource Sharing (CORS).

def extract_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

@app.route('/upload', methods=['POST'])
def upload():
    food_item, status_code = food_classify()
    if status_code == 200 and len(food_item) > 0 and food_item[0] is not '':
        food_movement, status_code = food_classify()
    return jsonify({"message": {"food_item" : food_item, "food_movement": food_movement}}), status_code

if __name__ == '__main__':
    app.run(debug=True)