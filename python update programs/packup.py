backupCountFile = open("data_backups/backupCount.txt","r")
backupCount = int(backupCountFile.read())
backupCountFile.close()
backupCount += 1;

dataFile = open("data.json", "r")
backupFile = open("data_backups/dataBackup_" + str(backupCount) + ".json", "w")
backupFile.write(dataFile.read())
dataFile.close()
backupFile.close()

backupCountFile = open("data_backups/backupCount.txt","w")
backupCountFile.write(str(backupCount))
backupCountFile.close()

print("made backup at data_backups/dataBackup_" + str(backupCount) + ".json")
