import json
dataJSON = [];

def getData():
    global dataJSON
    txtFile = open("data.txt", "r")
    dataText = txtFile.read()
    txtFile.close()
    dataJSON = json.loads(dataText)

getData()
print(dataJSON)
