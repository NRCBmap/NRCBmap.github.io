import json
# import math
# import random
import os

def backup():
    os.system('python "python update programs\\packup.py"')

jsonData = {"error":"nothing loaded"}

def loadData():
    global jsonData
    file = open("data.json", "r")
    jsonData = json.loads(file.read())
    file.close()

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
                stringToReturn += "  "*max(indent, 0) + "|-" + str(i) + ": " + str(dictionary[i]) + "\n"
            elif depth > 1:
                stringToReturn += "  "*max(indent, 0) + "|-. " + str(i) + ": \n"
                stringToReturn += getStrStructure(dictionary[i], depth-1, indent+1)
            else:
                stringToReturn += "  "*max(indent, 0) + "|-" + str(i) + "\n"
    elif isinstance(dictionary, list):
        for i in range(len(dictionary)):
            if depth > 1:
                stringToReturn += "  "*max(indent, 0) + "|-. " + str(dictionary[i]["id"]) + ": \n"
                stringToReturn += getStrStructure(dictionary[i], depth-1, indent+1)
            else:
                stringToReturn += "  "*max(indent, 0) + "|-" + str(dictionary[i]["id"]) + "\n"
    else:
        stringToReturn += "  "*max(indent, 0) + "|-" + str(dictionary) + "\n"
    return stringToReturn


def cmd_cd(argument):
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
        return "error: execute this command in and float, int or str"
    valToWrite = "error"
    try:
        valToWrite = eval(argument)
    except:
        return "error in evaluation of argument. This could be a syntax error in the argument."
    if not isinstance(valToWrite, (float, int, str)):
        return "error: only write float, int or str"
    if valToWrite == "error":
        print("waring: something might have gone wrong, but it's not certain. If you tried to write \"error\", everything is fine.")
    return editPath(path, argument)

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

commands = {"cd":cmd_cd, "findDict":cmd_findDict, "backup":cmd_backup, "edit": cmd_edit, "tree": cmd_tree}

loadData()

# print(getStrStructure(jsonData, 1, 0))
# print(getStrStructure(jsonData, 2, 0))
# print(getStrStructure(jsonData, 3, 0))
# print(getStrStructure(jsonData, 4, 0))

# for i in jsonData.keys():
#     print(i)

# print(jsonData)

# print(getPath(["states",2]))

# print(getPathStr(["continents", 1, "name"]))

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
