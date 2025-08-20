#!/usr/bin/python3
import cgi, cgitb, os, sys, sys, requests, secrets
cgitb.enable()

# Headers
print("Content-type: text/html\n\n")
print("Cache-Control: no-cache\n")

# Set up Python session
session = requests.Session()
session.close()

