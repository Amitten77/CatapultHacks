'''
python3 -m venv venv
source venv/bin/activate
pip install Flask
export FLASK_APP=app.py
flask run
'''
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # This line is important to handle Cross-Origin Resource Sharing (CORS).

@app.route('/upload', methods=['POST'])
def upload():
    image_data = request.json.get('image')
    # Process the image data here. The image_data is a base64-encoded string of the image.
    print("Image received")
    return jsonify({"message": "Image received successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)