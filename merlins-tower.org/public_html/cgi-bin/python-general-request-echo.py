#!/usr/bin/python3
# Importing the cgi module
import cgi, sys, cgitb, os
cgitb.enable()

# Send HTTP header saying content is HTML
print("Content-type: text/html\n\n")
protocol = os.environ.get("SERVER_PROTOCOL")
method = os.environ.get("REQUEST_METHOD")
print("Protocol: {0}<br>".format(protocol))
print("Method: {0}<br>".format(method))

params = ""

if protocol == "GET":
    query_string = os.environ.get("QUERY_STRING")
    params = query_string.split('&')

if protocol == "POST":
    post_body = sys.stdin.read()
    params = post_body.split('&')

for param in params:
    param = param.split('=')
    name = param[0]
    if(len(param)) > 1:
        value = param[1]
        print("{0} = {1}<br>".format(name, value))
        continue
    print("{0}<br>".format(name))
