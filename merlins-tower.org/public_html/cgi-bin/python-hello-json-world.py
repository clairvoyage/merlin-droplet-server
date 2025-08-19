#!/usr/bin/python3
# Importing the JSON module and cgi module
import json
import cgi

# Send HTTP header saying content is JSON
print("Cache-Control: no-cache\n")
print("Content-type: application/json\n\n")

data = {"title": "Hello Python!", "heading": "Hello Python!"}
json_string = json.dumps(data, indent=4)

# Write to JSON file
with open ("../json/python-hello-json-world.json", "w") as f:
    f.write(json_string)
