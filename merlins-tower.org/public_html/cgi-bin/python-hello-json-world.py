#!/usr/bin/python3
# Importing the JSON module and cgi module
import json
import cgi
import datetime
import socket

# Get current date and time
current_time = datetime.datetime.now()
# Get IP address
host = socket.gethostname()
IPAddress = socket.gethostbyname(host + ".local")

# Send HTTP header saying content is JSON
print("Cache-Control: no-cache\n")
print("Content-type: application/json\n\n")

data = {"title": "Hello Python!", "heading": "Hello Python!", "date-time": current_time.strftime("%Y-%m-%d %H:%M:%S"), "IP-address": IPAddress}
hello_python_json = json.dumps(data, indent=4)

# Write to JSON file
with open ("/var/www/merlins-tower.org/public_html/json/python-hello-json-world.json", "w") as f:
    f.write(hello_python_json)