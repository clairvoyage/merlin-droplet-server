#!/usr/bin/python3
import cgi, cgitb, os, sys, sys, requests, secrets
cgitb.enable()

# Headers
print("Content-type: text/html\n\n")

# Set up Python session
session = requests.Session()
session.headers.update({"CGISESSID": secrets.token_urlsafe(16)})

cookie = session.headers.get("Cookie")
if cookie == "" or cookie == None:
    print("Name: Not set")
else:
    print("Name: {0}<br>".format(session.headers.get("Cookie")))
    print("CGISESSID: {0}<br>".format(session.headers.get("CGISESSID")))



print("<a href=\"/python-cgiform.html\">CGI Form</a>")
print("<a href=\"/cgi-bin/python-sessions-1.py\">Session 1</a>")
print("<form style=\"margin-top:30px\" action=\"/cgi-bin/python-destroy-session.php\" method=\"get\">")
print("<button type=\"submit\">Destroy Session</button>")
print("</form>")