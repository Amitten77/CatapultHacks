from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import base64
import requests
# store api key on config file as: api_key = "YOUR_OPENAI_API_KEY"
import config
import cv2

api_key = config.api_key
client = OpenAI(api_key=api_key)

def extract_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

def food_classify():
  
  image_data = extract_image("first.jpg")

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
  print(response)
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

def find_food_movement(food_items):
  image_data = extract_image("second.jpg")
  image_data_prev = extract_image("first.jpg")
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
          "text": f"Look at the following items in the first image: {food_items_str}. List out whether the item is closer or farther in the second image. Use ONLY the words closer and farther in a csv format, such as: closer, farther, farther. Do this for exactly {len(food_items)} items."
        },
        {
          "type": "image_url",
          "image_url": {
            "url": f"data:image/jpeg;base64,{image_data_prev}"
          }
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

food_items, status_code = food_classify()
if status_code == 200 and len(food_items) > 0 and food_items[0] != '':
    food_movement, status_code = find_food_movement(food_items)
    print(food_items)
    print(food_movement)
    print(status_code)
    # print(jsonify({"message": {"food_item" : food_items, "food_movement": food_movement}}), status_code)
else:
    print(food_items)
    print(status_code)
    # print(jsonify({"message": {"food_item" : food_items, "food_movement": []}}), status_code)
print()