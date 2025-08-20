#!/usr/bin/python3
import cgi, cgitb, os, sys
cgitb.enable()

print("Content-type: text/html\n\n")

query_string = os.environ.get("QUERY_STRING")
print(str(query_string))
# params = query_string.split('&')
# for param in params:
#     print(params)





