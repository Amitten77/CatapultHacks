from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import base64
import requests
# store api key on config file as: api_key = "YOUR_OPENAI_API_KEY"
import config




def food_classify():
  data = request.get_json()  # Get the JSON data sent from frontend
  if 'image' not in data:
      return jsonify({"message": "No image data found"}), 400
  
  image_data = data['image']

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
            "url": f"data:image/jpeg;base64,{image_data}"
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
  food_items = list(map(str.strip, content.split(',')))

  if response.status_code == 200:
    return food_items, 200
  else:
    return [''], response.status_code

  # if response.status_code == 200:
  #     return jsonify({"message": food_items}), 200
  # else:
  #     return jsonify({"error": "Failed to process image"}), response.status_code

def food_movement(food_items):
  data = request.get_json()  # Get the JSON data sent from frontend
  if 'image' not in data:
      return jsonify({"message": "No image data found"}), 400
  
  image_data = data['image']
  # food_items = data['food_items']
  food_items_str = ','.join(str(item) for item in food_items)

  api_key = config.api_key

  payload = {
  "model": "gpt-4-vision-preview",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": f"For each of the following items, {food_items_str}, list out whether the item is moving closer or farther away. Use only the words closer and farther in a csv format, such as: farther, closer, closer. If there are no food items, respond with a single space"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": f"data:image/jpeg;base64,{image_data}"
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
  food_movement = list(map(str.strip, content.split(',')))

  if response.status_code == 200:
    return food_movement, 200
  else:
    return [''], response.status_code

  # if response.status_code == 200:
  #     return jsonify({"message": food_movement}), 200
  # else:
  #     return jsonify({"error": "Failed to process image"}), response.status_code
