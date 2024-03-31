import openai
import requests
import json

# Set your OpenAI API key
api_key = "YOUR_OPENAI_API_KEY"
openai.api_key = api_key

def get_image_caption(image_url):
    # Request to OpenAI's DALL-E model to generate a caption for the image
    response = requests.post(
        "https://api.openai.com/v1/davinci/complete",
        headers={"Authorization": f"Bearer {api_key}"},
        json={
            "prompt": f"Generate a caption for this image: {image_url}",
            "max_tokens": 50
        }
    )
    if response.status_code == 200:
        data = response.json()
        return data['choices'][0]['text'].strip()
    else:
        print("Error:", response.text)
        return None

def chat_with_gpt(prompt):
    # Chat with ChatGPT based on the prompt
    response = openai.Completion.create(
        engine="davinci",
        prompt=prompt,
        max_tokens=150
    )
    return response.choices[0].text.strip()

def main():
    # Input image URL
    image_url = input("Enter the URL of the image: ")
    
    # Get caption for the image
    image_caption = get_image_caption(image_url)
    print("Image Caption:", image_caption)
    
    # Input prompt for ChatGPT
    prompt = input("What food is within the fridge currently")
    
    # Generate output from ChatGPT
    output = chat_with_gpt(prompt)
    print("ChatGPT Output:", output)

if __name__ == "__main__":
    main()


