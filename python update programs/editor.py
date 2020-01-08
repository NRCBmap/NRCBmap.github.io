import json
# import math
# import random
import os
import webbrowser

def backup():
    os.system('python "python update programs\\packup.py"')

jsonData = {"error":"nothing loaded"}

def loadData():
    global jsonData
    file = open("data.json", "r")
    jsonData = json.loads(file.read())
    file.close()

def saveData(argument):
    if input("backup? y/n") != "n":
        backup()
    else:
        print("No backup done.")
    file = open("data.json", "w")
    file.write(json.dumps(jsonData))
    file.close()
    return "done."

def checkIdInList(id, listToCheck):
    for i in range(len(listToCheck)):
        if str(listToCheck[i]["id"]) == str(id):
            return True
    return False

def findID(id, listToCheck):
    for i in range(len(listToCheck)):
        if str(listToCheck[i]["id"]) == str(id):
            return i
    print("\n\nerror in findID: could not find id '" + str(id) + "' in list:\n" + str(listToCheck) + "\n\n")
    return 0

def makeUnusedID(list):
    highestId = 0
    for i in range(len(list)):
        if int(list[i]["id"]) > highestId:
            highestId = list[i]["id"]
    return highestId + 1

def getPath(path):
    if "error" in jsonData:
        return jsonData
    nowSelection = jsonData
    for i in path:
        if isinstance(nowSelection,list):
            nowSelection = nowSelection[findID(i, nowSelection)]
        else:
            nowSelection = nowSelection[i]
    return nowSelection

def editPath(path, newVal):
    location = getPath(path[:-1])[path[-1]] = newVal
    return getPath(path)

def addPath(path, idName):
    nowPath = getPath(path)
    if isinstance(nowPath, list):
        nowPath.append({"id":idName})
        return idName
    elif isinstance(nowPath, dict):
        nowPath[idName] = "undefined"
        return idName
    else:
        return False

def deletePath(path):
    itemRoot = getPath(path[:-1])
    if isinstance(itemRoot, list):
        del itemRoot[findID(path[-1])]
    else:
        del itemRoot[path[-1]]
    return itemRoot

path = []
def getCurrentPath():
    return getPath(path)

def getStrStructure(dictionary, depth, indent):
    if depth == 0:
        return ""
    stringToReturn = ""
    if isinstance(dictionary, dict):
        for i in dictionary.keys():
            if not (isinstance(dictionary[i], list) or isinstance(dictionary[i], dict)):
                stringToReturn += "| "*max(indent, 0) + "|-" + str(i) + ": " + str(dictionary[i]) + "\n"
            elif depth > 1:
                stringToReturn += "| "*max(indent, 0) + "|-. " + str(i) + ": \n"
                stringToReturn += getStrStructure(dictionary[i], depth-1, indent+1)
            else:
                stringToReturn += "| "*max(indent, 0) + "|-" + str(i) + "\n"
    elif isinstance(dictionary, list):
        for i in range(len(dictionary)):
            if depth > 1:
                if "id" in dictionary[i]:
                    stringToReturn += "| "*max(indent, 0) + "|-. " + str(dictionary[i]["id"]) + ": \n"
                    stringToReturn += getStrStructure(dictionary[i], depth-1, indent+1)
                else:
                    if isinstance(dictionary[i], (str, int, float)):
                        stringToReturn += "| "*max(indent, 0) + "|- " + str(dictionary[i]) + "\n"
                    else:
                        stringToReturn += "| "*max(indent, 0) + "|-. " + str(i) + ": \n"
            else:
                if "id" in dictionary[i]:
                    stringToReturn += "| "*max(indent, 0) + "|-" + str(dictionary[i]["id"]) + "\n"
                else:
                    stringToReturn += "| "*max(indent, 0) + "|-" + str(i) + "\n"
    else:
        stringToReturn += "| "*max(indent, 0) + "|-" + str(dictionary) + "\n"
    return stringToReturn

def getNationInf(id):
    for i in jsonData['nations']:
        if i['id'] == id:
            return i
    return {'id':0, 'name':'getNationInf error', 'description':'getNationInf error', "discord tag": "getNationInf error"}

def findUserName(text):
    foundTags = []
    for i in jsonData['nations']:
        nowTag = i['discord tag']
        if nowTag in text:
            foundTags.append(nowTag)
    return foundTags

def cmd_goto(argument):
    if argument == "..":
        if len(path) == 0:
            return "error: already in root"
        path.pop()
        return getStrStructure(getCurrentPath(), 1, 0)
    currentPath = getCurrentPath()
    if isinstance(currentPath, dict):
        if argument not in getCurrentPath():
            return "error: '" + argument + "' does not exist in this context"
        path.append(argument)
    elif isinstance(currentPath, list):
        if not checkIdInList(argument, currentPath):
            return "error: '" + argument + "' does not exist in this context"
        path.append(argument)
    returnStr = getStrStructure(getCurrentPath(), 1, 0)
    if len(path) >= 1:
        returnStr = path[-1] + "\n" + returnStr
    returnStr = ""
    return returnStr

def cmd_findDict(argument):
    if len(argument.split(", ")) != 2:
        return "error: wrong number of arguments. usage: find <property name> <property value>"
    currentPath = getCurrentPath()
    if not isinstance(currentPath, list):
        return "error: this command can only be used in lists of dictionaries. This is not a list"
    if len(currentPath) == 0:
        return "error: the list you are searching in is empty."
    # if not isinstance(currentPath[0], dict):
    #     return "error: this command can only be used in lists of dictionaries. This is a list with no dictionaries"
    prName = eval(argument.split(", ")[0])
    prVal = eval(argument.split(", ")[1])
    totalCount = len(currentPath)
    dictCount = 0
    hasNameCount = 0
    foundIDs = []
    itemN = 0
    for i in currentPath:
        if isinstance(i, dict):
            dictCount += 1
            if prName in i:
                hasNameCount += 1
                if i[prName] == prVal:
                    if "id" in i:
                        foundIDs.append("id: " + str(i["id"]))
                    else:
                        foundIDs.append("item#: " + str(itemN))
        itemN += 1
    if dictCount == 0:
        return "error: could not find any dictionaries in the " + str(totalCount) + " items in this list."
    if hasNameCount == 0:
        return "error: could not find property '" + str(prName) + "' in the " + str(dictCount) + " dictionaries"
    if len(foundIDs) == 0:
        return "error: could not find any object with " + str(prName) + "=" + str(prVal) + " out of " + str(dictCount) + " dictionaries, of wich there are " + str(hasNameCount) + " dictionaries with that property."
    returnStr = "Success. Found " + str(len(foundIDs)) + "dictionaries where " + str(prName) + "=" + str(prVal) + " out of " + str(dictCount) + " dictionaries, of wich there are " + str(hasNameCount) + " dictionaries with that property."
    for i in foundIDs:
        returnStr += "\n" + i
    return returnStr

def cmd_backup(argument):
    backup()
    return "backup succesful"

def cmd_edit(argument):
    currentPath = getCurrentPath()
    if not isinstance(currentPath, (float, int, str)):
        print("warning: not editing a float, int or string.")
        if not input("continue? y/n") == "y":
            return "cancelled";
    valToWrite = "error"
    try:
        valToWrite = eval(argument)
    except:
        return "error in evaluation of argument. This could be a syntax error in the argument."
    if not isinstance(valToWrite, (float, int, str)):
        print("warning: not writing a float, int or string.")
        if not input("continue? y/n") == "y":
            return "cancelled";
    if valToWrite == "error":
        print("waring: something might have gone wrong, but it's not certain. If you tried to write \"error\", everything is fine.")
    return editPath(path, valToWrite)

def cmd_tree(argument):
    depth = 0
    try:
        depth = int(argument)
    except:
        return "error: could not convert " + argument + " to an integer."
    if depth < 1:
        return "error: depth cannot be smaller than 1."
    if len(path) >= 1:
        strToReturn = str(path[-1]) + "\n"
    else:
        strToReturn = "data\n"
    strToReturn += getStrStructure(getCurrentPath(), depth, 0)
    return strToReturn

def cmd_newUnisedID(argument):
    if not isinstance(getCurrentPath(), list):
        return "error: can only do this in lists."
    if not isinstance(getCurrentPath()[0], dict):
        return "error: can only do this in lists with dicts."
    if "id" not in getCurrentPath()[0]:
        return "error: can only do this in lists with dicts with an id property"
    return makeUnusedID(getCurrentPath())

def cmd_new(argument):
    currentPath = getCurrentPath()
    if not isinstance(currentPath, (dict, list)):
        return "error: you can only add to dict or list"
    parArg = "error"
    try:
        parArg = eval(argument)
    except:
        return "error in eval. Maybe a syntax error"
    return addPath(path, parArg)

def cmd_del(argument):
    currentPath = getCurrentPath()
    if not isinstance(currentPath, (dict, list)):
        return "error: you can only delete an item of a dict or list"
    parArg = "error"
    try:
        parArg = eval(argument)
    except:
        return "error in eval. Possibly a syntax error in argument"
    if parArg not in currentPath:
        return "error: " + str(parArg) + " not in current context."
    deletePath(path + [parArg])
    return "done."

def cmd_infrastructure(argument):
    splitArg = argument.split(';');
    natName = splitArg[0];
    pr1Id = int(splitArg[1]);
    pr2Id = int(splitArg[2]);
    type = splitArg[3];
    conf = int(splitArg[4]);
    pr1 = jsonData['provinces'][findID(pr1Id, jsonData['provinces'])]
    pr2 = jsonData['provinces'][findID(pr2Id, jsonData['provinces'])]
    if (getNationInf(pr1['natOwned'])['name'] != natName or getNationInf(pr2['natOwned'])['name'] != natName):
        return "error: province not owned by maker of road."
    if (pr1Id == pr2Id):
        return "error: road goes to origin."
    if (conf != (pr1Id + pr2Id)%7):
        return "error: invalid conf num. This might be a hack attempt."
    if (not (type == 'r' or type == 'c' or type == 't')):
        return "error: invalid road type"
    for i in jsonData['infrastructure']:
        if i['pr1'] == pr1Id and i['pr2'] == pr2Id and i['type'] == type:
            return "error: road already exists with id " + str(i["id"]) + "."
    x = str((pr1.x+pr2.x)/2)
    y = str((pr1.y+pr2.y)/2)
    webbrowser.open("http://127.0.0.1:8000?script=setCamTo(" + x + "," + y + ",15);", new=2)
    if input("is this OK? y/n") == "n":
        return "error: road not approved by admin. Reason: " + input("give reason: ")
    newId = makeUnusedID(jsonData['infrastructure'])
    jsonData['infrastructure'].append({'id':newId, 'type':type, 'pr1': pr1Id, 'pr2': pr2Id})
    return "Made " + type + " by " + natName + " from " + pr1['name'] + " to " + pr2['name'] + "."

def cmd_reload(argument):
    if input('are you sure you want to reload? y/n: ') == 'y':
        loadData()
        return "reloaded"
    return "cancelled"

# colonise <provinceId>;<nationId>;<colonyId>;<confnum (sum%7)>
def cmd_colonise(argument):
    splitArg = argument.split(";")
    if len(splitArg) != 4:
        return "error: wrong number of arguments."
    for i in range(len(splitArg)):
        try:
            splitArg[i] = int(splitArg[i])
        except Exception as e:
            return "error: argument #" + str(i) + " is not a number."
    confnum = (splitArg[0] + splitArg[1] + splitArg[2])%7
    if confnum != splitArg[3]:
        return "error: invalid confnum. This might be a hack attempt."
    province = jsonData["provinces"][findID(splitArg[0], jsonData["provinces"])]
    nation = jsonData["nations"][findID(splitArg[1], jsonData["nations"])]
    colony = nation["colonies"][findID(splitArg[2], nation["colonies"])]
    input("Can " + nation["name"] + " with his colony " + colony["name"] + " colonise to " + province["name"] + "? Press enter to show on map.")
    webbrowser.open("http://127.0.0.1:8000?script=setCamToThing('provinces'," + str(province["id"]) + ')', new=2)
    yn = "a"
    while yn != "y" and yn != "n":
        yn = input("? y/n")
    if yn == "n":
        return "error: not approved by admin. Reason: " + input("give a reason: ")
    else:
        province["natOwned"] = nation["id"]
        province["colonyId"] = colony["id"]
        return province["name"] + " is now owned by " + nation["name"] + "(" + nation["discord tag"] + ") in colony " + colony["name"] + "."

discAllowedCMDs = ["infrastructure", "colonise"]
def cmd_impDiscord(argument):
    line = ""
    lines = []
    while line != "/done72":
        line = input("/done72 when you are done.> ")
        lines.append(line)
    print("Executing " + str(len(lines)) + " commands...")
    currentTag = "@error"
    messagesToSend = ["Map updated. Here are some messages:"]
    for i in range(len(lines)):
        cmd = lines[i].split(" ", 1)
        if cmd[0] in discAllowedCMDs:
            print("Allowing \"" + lines[i] + "\".")
            commandRes = commands[cmd[0]](cmd[1])
            if commandRes[:6] == "error:":
                messagesToSend.append(currentTag + " an error occured on your command \"" + lines[i] + "\": " + commandRes)
            else:
                messagesToSend.append(currentTag[:1] + " result of command \"" + lines[i] + "\": " + commandRes)
            print(commandRes)
        else:
            print("Not allowing \"" + lines[i] + "\".")
            userNamesFound = findUserName("@" + lines[i])
            if len(userNamesFound) == 1:
                currentTag = userNamesFound[0]
    print("")
    for i in messagesToSend:
        print(i)
    print("")
    return "Done. Don't forget to save!"


commands = {"goto":cmd_goto,
            "findDict":cmd_findDict,
            "backup":cmd_backup,
            "edit": cmd_edit,
            "tree": cmd_tree,
            "save": saveData,
            "unusedID": cmd_newUnisedID,
            "new": cmd_new,
            "del": cmd_del,
            "infrastructure":cmd_infrastructure,
            "reload":cmd_reload,
            "colonise":cmd_colonise,
            "impDiscord":cmd_impDiscord}

loadData()

while True:
    pathString = "data"
    for i in path:
        pathString += "/" + str(i)
    inputCmd = input(pathString + " > ").split(" ", 1)
    if inputCmd == [""]:
        continue
    if inputCmd[0] in commands:
        if len(inputCmd) == 1:
            print("error: no argument given")
        else:
            print(commands[inputCmd[0]](inputCmd[1]))
    else:
        print("error: command " + inputCmd[0] + " does not exist.")
