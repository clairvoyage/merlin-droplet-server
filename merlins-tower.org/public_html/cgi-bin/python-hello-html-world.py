#!/usr/bin/python3
import cgi
import datetime
import socket

# Get current date and time
current_time = datetime.datetime.now()
# Get IP address
host = socket.gethostname()
IPAdrress = socket.gethostbyaddr(host)

# Send HTTP header saying content is HTML
print("Content-type: text/html\n\n")

# Hello world in an HTML document
print("<html><body>")
print("<h1>Hello world, from Merlin and Jinwoong!</h1>")
print("<p>Current time: " + current_time + "</p>")
print("<p>IP Address: " + ' '.join(IPAdrress) + "</p>")

print("</body></html>")