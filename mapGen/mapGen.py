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

def generate(seed, resType):
    global im, draw, shape, scale, octaves, persistence, lacunarity, xOff, yOff, borderWidth, borderIntendsity, seaLVL
    if resType == 0:
        im = Image.new("RGB", (5632,2048), color=(255,255,255))   #real
        scale = 1000.0
    elif resType == 1:
        im = Image.new("RGB", (1408,512), color=(255,255,255))      #real/4
        scale = 1000.0/4
    elif resType == 2:
        im = Image.new("RGB", (563,204), color=(255,255,255))     #real/10
        scale = 1000.0/10
    elif resType == 3:
        im = Image.new("RGB", (100,100), color=(255,255,255))
        scale = 1000.0/56

    draw = ImageDraw.Draw(im)

    octaves = 15
    persistence = 0.5
    lacunarity = 2.0

    xOff = (seed*57945)%25252
    yOff = (seed*34252)%34598

    borderWidth = im.size[0]/20
    borderIntendsity = 0.5

    seaLVL = 0

    for x in range(im.size[0]):
        if (x % 10 == 0):
            print(str(math.floor(x/im.size[0]*100)) + "%")
        below = getSeaLVL(x,0)>seaLVL
        both = getSeaLVL(x,1)>seaLVL
        for y in range(im.size[1]):
            here = below
            right = both
            below = getSeaLVL(x,y+1)>seaLVL
            both = getSeaLVL(x+1,y+1)>seaLVL
            if (here != right or (here != below and both != here)):
                color = (0,0,0)
            elif (not here):
                color = (0,0,255)
            else:
                color = (255,255,255)
            draw.point([x,y], fill=(color))
            # color = math.floor(getSeaLVL(x,y)*255)
            # draw.point([x,y], fill=(color,color,color))

    del draw

    # write to stdout
    im.save("random/random_" + str(seed) + "_" + str(resType) + ".png", "PNG")

res = int(input("resolution? 0 = normal, 1 = 0.25, 2 = 0.1, 3 = 100*100"))
inp = input("seed. type R for random, type I for infinite maps.")
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
