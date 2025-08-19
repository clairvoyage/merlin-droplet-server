#!/usr/bin/python3
# Importing the 'cgi' module
import cgi

# Send HTTP header saying content is HTML
print("Content-type: text/html\n\n")

# Hello world in an HTML document
print("<html><body>")
print("<h1>Hello world, from our team!</h1>")
print("</body></html>")