#!/usr/bin/python3
# Importing the cgi module
import cgi, sys, cgitb, os
cgitb.enable()

# Send HTTP header saying content is HTML
print("Content-type: text/html\n\n")

print("Protocol: {0}<br>".format(os.environ.get("SERVER_PROTOCOL")))
print("Method: {0}<br>".format(os.environ.get("REQUEST_METHOD")))

