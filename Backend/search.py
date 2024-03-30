from langchain_community.llms import Ollama
from googleapiclient.discovery import build
llm = Ollama(model="llama2")

def get_expiry(name):
    long_prompt = llm.invoke("Give me the shelf life of " + name + " in a refridgerator in days as an integer.")
    print(long_prompt + "\n")
    date_index = long_prompt.rfind("days")
    num_iterations = 1
    while(date_index == -1 and num_iterations < 3):
        long_prompt = llm.invoke("Give me the shelf life of " + name + " in a refridgerator in days as an integer.")
        date_index = long_prompt.rfind("days")
        num_iterations += 1
    if (date_index == -1):
        return 5
    start_index = date_index - 2
    while(1):
        if not long_prompt[start_index].isnumeric():
            break
        start_index -= 1
    date = long_prompt[start_index + 1:date_index - 1]
    if not date.isnumeric():
        return 5
    return int(date)

def get_type(name):
    long_prompt = llm.invoke("Give me if " + name + " is a fruit, vegetable, drink, leftovers, condiment, or other. Only give the catagory in this format <object> - <Catagory>.")
    print(long_prompt + "\n")
    num_iterations = 1
    catagory = long_prompt.split(" - ")[1]
    while catagory.lower() not in ["fruit", "vegetable", "drink", "leftovers", "condiment", "other"] and num_iterations < 3:
        long_prompt = llm.invoke("Give me if " + name + " is a fruit, vegetable, drink, leftovers, condiment, or other. Only give the catagory in this format <object> - <Catagory>.")
        catagory = long_prompt.split(" - ")[1]
        num_iterations += 1
    if (catagory.lower() not in ["fruit", "vegetable", "drink", "leftovers", "condiment", "other"]):
        return "other"
    return catagory.lower()

print(get_type("oreo"))