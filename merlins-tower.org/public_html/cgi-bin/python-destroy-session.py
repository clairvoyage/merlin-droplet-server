#!/usr/bin/python3
import cgi, cgitb, os, sys, sys, requests, secrets
cgitb.enable()

# Headers
print("Content-type: text/html\n\n")

# Set up Python session
session = requests.Session()
session.close()

print("Destroyed session")
print("<a href=\"/python-cgiform.html\">CGI Form</a><br>")
print("<a href=\"/cgi-bin/python-sessions-1.py\">Session 1</a><br>")
print("<a href=\"/cgi-bin/python-sessions-2.py\">Session 2</a><br>")
