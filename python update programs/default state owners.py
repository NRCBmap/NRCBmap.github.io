import json
import os

os.system('python "python update programs\\packup.py"')

file = open("data.json", "r")
jsonData = json.loads(file.read())
file.close()

print(jsonData["provinces"])

for i in jsonData["provinces"]:
    i["natOwned"] = 1
    i["colonyId"] = 1

print(jsonData["provinces"])

file = open("data.json", "w")
file.write(json.dumps(jsonData))
file.close()
