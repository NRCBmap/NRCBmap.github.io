from PIL import Image, ImageDraw
import random
import math
import noise

def getSeaLVL(x,y):
    noiseOut = noise.pnoise2((x/scale)+xOff, (y/scale)+yOff, octaves=octaves, persistence=persistence, lacunarity=lacunarity, repeatx=10000000000000, repeaty=10000000000000, base=0)
    borderFade = 0
    if x < borderWidth:
        borderFade += (borderWidth - x)/borderWidth*borderIntendsity
    if y < borderWidth:
        borderFade += (borderWidth - y)/borderWidth*borderIntendsity
    if x > im.size[0]-borderWidth:
        borderFade += ((borderWidth-im.size[0])+x)/borderWidth*borderIntendsity
    if y > im.size[1]-borderWidth:
        borderFade += ((borderWidth-im.size[1])+y)/borderWidth*borderIntendsity
    # if borderFade != 0:
    #     print(x,y,borderFade)
    noiseOut -= borderFade
    return noiseOut

def compCol(c1, c2):
    return (c1[0] != c2[0] or c1[1] != c2[1] or c1[2] != c2[2])

def nearestProvince(x, y, pChunks):
    global provinces
    nearProvince = [0,0,(1,1,1), 0]
    prid = 0
    nearDist = 100000000000000000
    for provinceI in pChunks[gchx(x)][gchy(y)]:
        nowDist =  math.pow(provinces[provinceI][0]-x,2)+math.pow(provinces[provinceI][1]-y,2)
        if nearDist > nowDist:
            nearDist = nowDist
            nearProvince = provinces[provinceI]
            prid = provinceI
    provinces[prid][3] = provinces[prid][3] + 1
    return nearProvince

def nearestCityColor(cities, x, y):
    nearColor = (1,1,1)
    nearDist = 100000000000000
    for cityI in chunks[gchx(x)][gchy(y)]:
        nowDist =  math.pow(cities[cityI][0]-x,2)+math.pow(cities[cityI][1]-y,2)
        if nearDist > nowDist:
            nearDist = nowDist
            nearColor = cities[cityI][2]
            # if cities[cityI][2][0] == 0:
            #     print(cities[cityI])
    return nearColor

def gchx(x):
    return math.floor(x/xChunkSize)

def gchy(y):
    return math.floor(y/yChunkSize)

def nearest2Cities(cities, x, y):
    nearID1 = 0
    nearDist1 = 100000000000000000
    nearID2 = 0
    nearDist2 = 100000000000000000
    for i in chunks[gchx(x)][gchy(y)]:
        nowDist =  math.pow(cities[i][0]-x,2)+math.pow(cities[i][1]-y,2)
        if nearDist1 > nowDist:
            nearDist2 = nearDist1
            nearID2 = nearID1
            nearDist1 = nowDist
            nearID1 = i
        elif nearDist2 > nowDist:
            nearDist = nowDist
            nearID2 = i
    return((nearID1, nearID2))

def citiesInDistance(cities, x, y, maxDist):
    maxSQDist = math.pow(maxDist,2)
    citiesInRange = []
    for i in chunks[gchx(x)][gchy(y)]:
        nowDist =  math.pow(cities[i][0]-x,2)+math.pow(cities[i][1]-y,2)
        if nowDist < maxSQDist:
            citiesInRange.append(i)
    return(citiesInRange)

def putInChunks(cityID, cities, chunks):
    city = cities[cityID]
    chx = math.floor((city[0]/xChunkSize)-0.5)
    chy = math.floor((city[1]/yChunkSize)-0.5)
    putInChunk(cityID, chx,   chy,   chunks)
    putInChunk(cityID, chx,   chy+1, chunks)
    putInChunk(cityID, chx+1, chy,   chunks)
    putInChunk(cityID, chx+1, chy+1, chunks)

def putInChunk(cityID, chx, chy, chunks):
    if chx >= 0 and chx < xChunkCount and chy >= 0 and chy < yChunkCount:
        chunks[chx][chy].append(cityID)

def generate(seed, resType):
    global im, draw, shape, scale, octaves, persistence, lacunarity, xOff, yOff, borderWidth, borderIntendsity
    global seaLVL, xChunkSize, yChunkSize, xChunkCount, yChunkCount, chunks, provinces
    if resType == 0:
        im = Image.new("RGB", (5632,2048), color=(255,255,255))   #real
        scale = 1000.0
        cityCountScale = 1
    elif resType == 1:
        im = Image.new("RGB", (1408,512), color=(255,255,255))      #real/4
        scale = 1000.0/4
        cityCountScale = 1/16
    elif resType == 2:
        im = Image.new("RGB", (563,204), color=(255,255,255))     #real/10
        scale = 1000.0/10
        cityCountScale = 1/100
    elif resType == 3:
        im = Image.new("RGB", (100,100), color=(255,255,255))
        scale = 1000.0/56
        cityCountScale = 1/3136

    draw = ImageDraw.Draw(im)

    octaves = 15
    persistence = 0.5
    lacunarity = 2.0

    xOff = (seed*57945)%25252
    yOff = (seed*34252)%34598

    borderWidth = im.size[0]/20
    borderIntendsity = 0.5

    seaLVL = 0

    print("making cities")
    cities = []

    chunks = []
    xChunkCount = round(250*math.sqrt(cityCountScale))
    yChunkCount = round(125*math.sqrt(cityCountScale))
    xChunkSize = im.size[0]/xChunkCount
    yChunkSize = im.size[1]/yChunkCount

    for x in range(xChunkCount):
        chunks.append([])
        for y in range(yChunkCount):
            chunks[x].append([])

    for i in range(round(200000*cityCountScale)):
        x = random.random()*im.size[0]
        y = random.random()*im.size[1]
        if getSeaLVL(x,y)>seaLVL:
            cities.append([x, y])
            putInChunks(len(cities)-1, cities, chunks)
    #
    # citySpacing = 4
    # for x in range(round(citySpacing/2), round(im.size[0]-(citySpacing/2)), citySpacing):
    #     for y in range(round(citySpacing/2), round(im.size[1]-(citySpacing/2)), citySpacing):
    #         cx = x+(((random.random()*citySpacing*2)-citySpacing)*2)
    #         cy = y+(((random.random()*citySpacing*2)-citySpacing)*2)
    #         if getSeaLVL(cx,cy)>seaLVL and len(chunks[gchx(cx)][gchy(cy)]) < 3:
    #             cities.append([cx, cy])
    #             putInChunks(len(cities)-1, cities, chunks)

    # print(chunks[0])

    print("making provinces")
    provinces = []
    pChunks = []

    for x in range(xChunkCount):
        pChunks.append([])
        for y in range(yChunkCount):
            pChunks[x].append([])

    for i in range(round(100000*cityCountScale)):
        x = random.random()*im.size[0]
        y = random.random()*im.size[1]
        if getSeaLVL(x,y)>seaLVL+0.01 and len(pChunks[gchx(x)][gchy(y)]) < 3:
            provinces.append([x, y, (round(random.random()*200)+50,round(random.random()*200)+50,round(random.random()*200)+50), 0])
            putInChunks(len(provinces)-1, provinces, pChunks)

    # provinceSpacing = 12
    # for x in range(round(provinceSpacing/2), round(im.size[0]-(provinceSpacing/2)), provinceSpacing):
    #     for y in range(round(provinceSpacing/2), round(im.size[1]-(provinceSpacing/2)), provinceSpacing):
    #         px = x+(((random.random()*provinceSpacing*2)-provinceSpacing)*2)
    #         py = y+(((random.random()*provinceSpacing*2)-provinceSpacing)*2)
    #         if getSeaLVL(px,py)>seaLVL and len(pChunks[gchx(px)][gchy(py)]) < 3:
    #             provinces.append([px, py, (round(random.random()*200)+25,round(random.random()*200)+25,round(random.random()*200)+25), 0])
    #             putInChunks(len(provinces)-1, provinces, pChunks)

    # prDist = 10
    # for i in range(len(provinces)):
    #     if i%100 == 0:
    #         print("spacing out provinces " + str(round(i/len(provinces)*100)) + "%")
    #     for j in range(i, len(provinces)):
    #         if i==j:
    #             continue
    #         relX = provinces[i][0]-provinces[j][0]
    #         relY = provinces[i][1]-provinces[j][1]
    #         if abs(relX) < prDist:
    #             if relX < 0:
    #                 provinces[i][0] += prDist/2
    #             else:
    #                 provinces[i][0] -= prDist/2
    #         if abs(relY) < prDist:
    #             if relY < 0:
    #                 provinces[i][1] += prDist/2
    #             else:
    #                 provinces[i][1] -= prDist/2
    #     putInChunks(i, provinces, pChunks)





    # provinceSurfaceArea = 200 # 150 + a buffer
    # provinceRadius = math.sqrt(provinceSurfaceArea/math.pi)
    # print("province radius: " + str(provinceRadius))
    # for i in range(len(provinces)):
    #     if i%round(len(provinces)/100) == 0:
    #         print("merging cities into provinces " + str(round(i/len(provinces)*100)) + "%")
    #     citiesInProvince = citiesInDistance(cities, provinces[i][0], provinces[i][1], provinceRadius)
    #     for j in citiesInProvince:
    #         if len(cities[j]) == 2: # city not yet in province
    #             cities[j].append(provinces[i][2])

    for i in range(len(cities)):
        if i%round(len(cities)/100) == 0:
            print("merging cities into provinces " + str(round(i/len(cities)*100)) + "%")
        closestP = nearestProvince(cities[i][0], cities[i][1], pChunks)
        cities[i].append(closestP[2])

    # for i in range(len(cities)):
    #     if i%round(len(cities)/100) == 0:
    #         print("checking cities " + str(round(i/len(provinces)*100)) + "%")
    #     if len(cities[i])==2:
    #         provinces.append([cities[i][0], cities[i][1], (round(random.random()*200)+25,round(random.random()*200)+50,round(random.random()*200)+25)])
    #         citiesInProvince = citiesInDistance(cities, provinces[-1][0], provinces[-1][1], provinceRadius)
    #         for j in citiesInProvince:
    #             if len(cities[j]) == 2: # city not yet in province
    #                 cities[j].append(provinces[-1][2])
    #
    #         citiesInProvince = citiesInDistance(cities, provinces[-1][0], provinces[-1][1], provinceRadius*0.6)
    #         for j in citiesInProvince:
    #             if len(cities[j]) == 2: # city not yet in province
    #                 cities[j].append(provinces[-1][2])
    #             else:
    #                 cities[j][2] = provinces[-1][2]

            # cities[i].append((255,255,255))


    for x in range(im.size[0]):
        if (x % 10 == 0):
            print("generating " + str(math.floor(x/im.size[0]*100)) + "%")
        # below = getSeaLVL(x,0)>seaLVL
        # both = getSeaLVL(x,1)>seaLVL
        for y in range(im.size[1]):
            here = getSeaLVL(x,y)>seaLVL
            # here = below
            # right = both
            # below = getSeaLVL(x,y+1)>seaLVL
            # both = getSeaLVL(x+1,y+1)>seaLVL
            # if (here != right or (here != below and both != here)):
            #     color = (0,0,0)
            if (not here):
                color = (0,0,255)
            else:
                # color = (255,255,255)
                color = nearestCityColor(cities, x, y)
            draw.point([x,y], fill=(color))
            # color = math.floor(getSeaLVL(x,y)*255)
            # draw.point([x,y], fill=(color,color,color))

    for x in range(im.size[0]-1):
        if x%10 == 0:
            print("drawing lines " + str(round(x/im.size[0]*100)) + "%")
        for y in range(im.size[1]-1):
            here = im.getpixel((x,y))
            below = im.getpixel((x,y+1))
            right = im.getpixel((x+1,y))
            both = im.getpixel((x+1, y+1))
            # if not (compCol(here, both) and compCol(below, right)):
            if (compCol(here, right) or (compCol(here, below) and compCol(both, here))):
                if here[0] == 0 or below[0] == 0 or right[0] == 0 or both[0] == 0:
                    draw.point([x,y], fill=(0,0,0))
                else:
                    draw.point([x,y], fill=(45,45,45))
            elif here[0] != 0:
                draw.point([x,y], fill=(255,255,255))


    del draw

    # write to stdout
    # im.save("random/random_" + str(seed) + "_" + str(resType) + ".png", "PNG")
    im.save("random/ColoProv_" + str(resType) + ".png", "PNG")

    f = open("provinces.txt", "w")
    f.write(str(provinces))
    f.close()

    print(str(len(provinces)) + " provinces, " + str(len(cities)) + " cities")

res = int(input("resolution? 0 = normal, 1 = 0.25, 2 = 0.1, 3 = 100*100"))
# inp = input("seed. type R for random, type I for infinite maps.")
inp = 1260
if inp == "R":
    seed = math.floor(random.random()*10000)
    generate(seed,res)
    print("seed: " + str(seed))
elif inp == "I":
    while True:
        generate(math.floor(random.random()*10000),res)
else:
    seed = int(inp)
    generate(seed,res)
    print("seed: " + str(seed))
