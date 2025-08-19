#!/usr/bin/python3
# Importing the JSON module and cgi module
import json
import cgi

# Send HTTP header saying content is JSON
print("Cache-Control: no-cache\n")
print("Content-type: application/json\n\n")

print(json.dumps({"title": "Hello Python!", "heading": "Hello Python!"}))

