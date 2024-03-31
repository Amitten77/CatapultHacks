from langchain_community.llms import Ollama
from googleapiclient.discovery import build
from openai import OpenAI
import datetime
import requests
import config

llm = Ollama(model="llama2")

def get_expiry(name):
  api_key = config.api_key
  payload = {
  "model": "gpt-3.5-turbo-0125",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": f"Give me, only in the number of days in the format <name> - <days> days, the shelf life in a refrigerator of fresh\/unopenned {name} and if it is in weeks, convert it to days as well."
        },
      ]
    }
  ],
  "max_tokens": 100
}

  headers = {
      "Content-Type": "application/json",
      "Authorization": f"Bearer {api_key}"
  }

  response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)  # Adjust URL as needed
  content = response.json()['choices'][0]['message']['content']
  long_prompt = list(map(str.strip, content.split(',')))
  date_index = str(long_prompt).rfind("days")
  start_index = date_index - 2
  while(1):
    if not str(long_prompt)[start_index].isnumeric():
      break
    start_index -= 1
    date = str(long_prompt)[start_index + 1:date_index - 1]

  print(str(long_prompt))
  print(date)
  if not date.isnumeric() or date == '':
    return datetime.date.today() + datetime.timedelta(days=5)
  return datetime.date.today() + datetime.timedelta(days=int(date))

print(get_expiry("fried chicken sandwich"))

def get_type(name):
    long_prompt = llm.invoke("Give me if " + name + " is a fruit, vegetable, drink, leftovers, condiment, or other. Only give the catagory in this format <object> - <Catagory>.")
    num_iterations = 1
    catagory = long_prompt.split(" - ")[1]
    while catagory.lower() not in ["fruit", "vegetable", "drink", "leftovers", "condiment", "other"] and num_iterations < 3:
        long_prompt = llm.invoke("Give me if " + name + " is a fruit, vegetable, drink, leftovers, condiment, or other. Only give the catagory in this format <object> - <Catagory>.")
        catagory = long_prompt.split(" - ")[1]
        num_iterations += 1
    if (catagory.lower() not in ["fruit", "vegetable", "drink", "leftovers", "condiment", "other"]):
        return "other"
    return catagory.lower()