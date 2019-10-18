import json
dataJSON = {}

def getData():
    txtFile = open("data.txt", "r")
    dataJSON = json.loads(txtFile.read())
    print(txtFile.read())
    txtFile.close()

getData()
print(dataJSON)
