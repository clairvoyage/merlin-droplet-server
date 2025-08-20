#!/usr/bin/python3
import os

query_string = os.environ.get("QUERY_STRING")
params = query_string.split('&')
for param in params:
    print(params)





