import random
import math

klinkers = "aeoui"
medeklinkers = "bcdfghjklmnpqrstvwxyz"
combis = []
for i in klinkers:
    for j in medeklinkers:
        combis += [i+j]

print(combis)
print(len(combis))

takenNames = []

while True:
    # input()
    name = ""
    length = math.floor(random.random()*3)+2
    for i in range(length):
        name += random.choice(combis)
    name += random.choice(klinkers)
    if name in takenNames:
        continue
    takenNames += [name]
    print(name-m)
