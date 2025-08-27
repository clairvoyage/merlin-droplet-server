#!/usr/bin/python3
import cgi, cgitb, os, sys, sys, requests, secrets
cgitb.enable()

# Headers
print("Content-type: text/html\n\n")

username = sys.stdin.read()

# Set up Python cookie
os.getenv({"Cookie": username})

cookie = session.headers.get("Cookie")
if cookie == "" or cookie == None:
    print("Name: Not set")
else:
    print("Name: {0}".format(session.headers.get("Cookie")))

print("<br><a href=\"/python-cgiform.html\">CGI Form</a><br>")
print("<a href=\"/cgi-bin/python-sessions-2.py\">Session 2</a><br>")
print("<form style=\"margin-top:30px\" action=\"/cgi-bin/python-destroy-session.py\" method=\"get\">")
print("<button type=\"submit\">Destroy Session</button>")
print("</form>")