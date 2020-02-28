from PIL import Image, ImageDraw
import random
import math
import json

klinkers = "aeoui"
medeklinkers = "bcdfghjklmnpqrstvwxyz"
combis = []
takenNames = [""]
for i in klinkers:
    for j in medeklinkers:
        combis += [i+j]

def makeName():
    global takenNames
    name = ""
    while name in takenNames:
        name = ""
        length = math.floor(random.random()*3)+2
        for i in range(length):
            name += random.choice(combis)
        name += random.choice(klinkers)
    takenNames += [name]
    return(name)

def compCol(c1, c2):
    return (c1[0] == c2[0] and c1[1] == c2[1] and c1[2] == c2[2])

def makeUnusedID(list):
    highestId = 0
    for i in range(len(list)):
        if int(list[i]["id"]) > highestId:
            highestId = list[i]["id"]
    return highestId + 1

print("opening image...")
mapIm = Image.open("random/ColoProv_0.png").convert("RGB")
mapDraw = ImageDraw.Draw(mapIm)

dotsFound = []

for x in range(0,mapIm.size[0]):
    if x%100 == 0:
        print("finding dots " + str(round(x/mapIm.size[0]*1000)/10) + "%")
    for y in range(0,mapIm.size[1]):
        nowColor = mapIm.getpixel((x,y))
        if nowColor[0] > 80 and not (nowColor[0] == 255 and nowColor[1] == 255 and nowColor[0] == 255):
            dotsFound.append([x,y,nowColor])
            mapDraw.point([x,y], fill=(255,255,255))

# print(dotsFound)
print("found " + str(len(dotsFound)) + " dots.")

print("listing colors...")
colors = []

def colorInColors(color):
    for i in range(len(colors)):
        if compCol(color, colors[i]):
            return i
    return -1

def listColor(color):
    i = colorInColors(color)
    if i >= 0:
        return i
    else:
        colors.append(color)
        return len(colors)-1

for i in range(len(dotsFound)):
    dotsFound[i][2] = listColor(dotsFound[i][2])

# print(colors)
print("found " + str(len(colors)) + " distinct colors")

print("initialising states...")

states = []
for i in range(len(colors)):
    states.append([i,makeName(),[]])

# print(states)
print("made " + str(len(states)) + " states")

print("making provinces...")

provinces = []
for dot in dotsFound:
    provinces.append([dot[0], dot[1], dot[2], makeName()])

# print(provinces)
print("made " + str(len(provinces)) + " provinces")

print("adding provinces to states...")
for i in range(len(provinces)):
    states[provinces[i][2]][2].append(i)

print("calculating state centers...")
for state in states:
    x = 0
    y = 0
    for i in state[2]:
        x += provinces[i][0]
        y += provinces[i][1]
    x = x/len(state[2])
    y = y/len(state[2])
    state.append(x)
    state.append(y)

print("opening main data.json...")
f = open("../data.json", "r")
dataJSON = json.loads(f.read())
f.close()

print("making unique province id's...")
highestID = 0
for province in dataJSON["provinces"]:
    if province["id"] > highestID:
        highestID = province["id"]
highestID += 1

for i in range(len(provinces)):
    provinces[i].append(highestID+i)

print("making unique state id's...")
highestID = 0
for state in dataJSON["states"]:
    if state["id"] > highestID:
        highestID = state["id"]
highestID += 1

for i in range(len(states)):
    states[i].append(highestID+i)

print("making province JSON...")
for province in provinces:
    dataJSON["provinces"].append({"x":province[0], "y":province[1], "id":province[4], "name":province[3], "parentID":states[province[2]][5]})

print("making state JSON...")
for state in states:
    dataJSON["states"].append({"x":state[3], "y":state[4], "id":state[5], "name":state[1]})

# print(json.dumps(dataJSON))

print("saving to data.json...")
f = open("../data.json", "w")
f.write(json.dumps(dataJSON))
f.close()

if input("do you want to remove the dots? y/n") == "y":
    mapIm.save("random/ColoProv_0.png", "PNG")
