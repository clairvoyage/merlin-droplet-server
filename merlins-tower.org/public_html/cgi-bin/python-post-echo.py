#!/usr/bin/python3
import cgi, cgitb, sys
cgitb.enable()

print("Content-type: text/html\n\n")
print("Message body: <br>")

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