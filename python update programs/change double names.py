import json
import math
import random
import os

os.system('python "python update programs\\packup.py"')

file = open("data.json", "r")
jsonData = json.loads(file.read())
file.close()

namesFound = []

def makeNewName():
  a = "aeoiuy"
  b = "qwrtpsdfghjklzxcvbnm"
  c = []
  for i in range(len(a)):
    for j in range(len(b)):
      c.append(a[i]+b[j])

  d = math.floor(random.random()*2)+2
  e = ""
  if (random.random() < 0.7):
    e += b[math.floor(random.random()*len(b))]
  for i in range(d):
    e += c[math.floor(random.random()*len(c))]
  if (random.random() < 0.7):
    e += a[math.floor(random.random()*len(a))]
  return e

def makeUnName():
    name = makeNewName()
    while name in namesFound:
        name = makeNewName()
        print("retrying")
    return name

def doName(name):
    if name in namesFound:
        print("found name: " + name)
        newName = makeUnName()
        namesFound.append(newName)
        print("replaced: " + newName)
        return newName
    namesFound.append(name)
    return name


# doName('test1')
# doName('test2')
# doName('test1')
# doName('test3')
# doName('test2')
# print(namesFound)

# just a test that make a duplicate name.
# jsonData["provinces"][6]["name"] = jsonData["states"][2]["name"]

for i in jsonData["continents"]:
    i["name"] = doName(i["name"])

for i in jsonData["states"]:
    i["name"] = doName(i["name"])

for i in jsonData["provinces"]:
    i["name"] = doName(i["name"])

print(jsonData)

file = open("data.json", "w")
file.write(json.dumps(jsonData))
file.close()
