import Levenshtein
from fuzzywuzzy import fuzz
from fuzzywuzzy import process

def find_match_Levenshtein(a, b):
    min_similarity = .75
    a_lower = a.lower()
    b_lower = b.lower()

    output = []
    # results = [[Levenshtein.jaro_winkler(x,y) for x in str1.split()] for y in str2.split()]
    results = Levenshtein.jaro_winkler(a_lower,b_lower)
    print(results)
    return results >= min_similarity

def fizz_match(a, b):
    min_similarity = 75
    a_lower = a.lower()
    b_lower = b.lower()

    output = []
    # results = [[Levenshtein.jaro_winkler(x,y) for x in str1.split()] for y in str2.split()]
    results = fuzz.token_set_ratio(a_lower, b_lower)
    print(results)
    return results >= min_similarity

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

print(find_match_Levenshtein("strawberry", "pineapple"))
print(fizz_match("Coca-Cola", "cola"))
print(find_closest_entry("cola", ["Coca-Cola", "I'm sorry", "I can't assist with that request"]))
