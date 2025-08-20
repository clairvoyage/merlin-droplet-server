#!/usr/bin/python3
import cgi, cgitb, os, sys
cgitb.enable()

print("Content-type: text/html\n\n")

query_string = os.environ.get("QUERY_STRING")
print("Query string: {0}".format(query_string))
params = query_string.split('&')

for param in params:
    param = param.split('=')
    name = param[0]
    if(len(param)) > 1:
        value = param[1]
        print("{0} = {1}\n".format(name, value))
        continue
    print("{0}\n".format(name))






