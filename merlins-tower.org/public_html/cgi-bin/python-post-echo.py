#!/usr/bin/python3
import cgi, cgitb, sys
cgitb.enable()

print("Content-type: text/html\n\n")
print("Message body: <br>")

for line in sys.stdin:
    print(str(line))