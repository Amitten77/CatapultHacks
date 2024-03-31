from fuzzywuzzy import fuzz
from fuzzywuzzy import process

def find_closest_entry(name, entries):
    if len(name.split()) > 3:
        return "invalid"
    match, score = process.extractOne(name, entries, scorer=fuzz.token_set_ratio)
    invalid_entries = ["sorry", "couldn't", "not", "unable"]
    _, invalid_score = process.extractOne(name, invalid_entries, scorer=fuzz.token_set_ratio)
    if invalid_score > score:
        return "invalid"
    else:
        if score >= 75:
            return match
        else:
            return name

print(find_closest_entry("cola", ["Coca-Cola", "I'm sorry", "I can't assist with that request"]))
