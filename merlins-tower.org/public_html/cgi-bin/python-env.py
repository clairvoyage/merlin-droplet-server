#!/usr/bin/python3
# Importing the cgi module
import cgi
import cgitb
cgitb.enable()

# Send HTTP header saying content is HTML
print("Content-type: text/html\n\n")
cgi.print_environ_usage();
