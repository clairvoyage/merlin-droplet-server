#!/usr/bin/python3
import cgi, cgitb, os, sys, sys, requests, secrets
cgitb.enable()

# Headers
print("Content-type: text/html\n\n")
print("Cache-Control: no-cache\n")

username = sys.stdin.read()

# Set up Python session
session = requests.Session()
session.headers.update({"Cookie": username})

cookie = session.headers.get("Cookie")
if cookie == "" or cookie == None:
    print("Name: Not set")
else:
    print("Name: {0}".format(session.headers.get("Cookie")))

print("<a href=\"/python-cgiform.html\">CGI Form</a>")
print("<form style=\"margin-top:30px\" action=\"/cgi-bin/php-destroy-cookie-session.php\" method=\"get\">")
print("<button type=\"submit\">Destroy Session</button>")
print("</form>")