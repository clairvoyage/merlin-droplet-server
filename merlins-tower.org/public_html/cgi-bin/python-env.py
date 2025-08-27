#!/usr/bin/python3
# Importing the cgi module
import cgi, sys, cgitb, os
cgitb.enable()

# Send HTTP header saying content is HTML
print("Content-type: text/html\n\n")

# Code from https://www.go4expert.com/articles/print-cgi-environment-vairables-python-t2025/
for name, value in os.environ.items():
    print("%s\t= %s <br/>" % (name, value))