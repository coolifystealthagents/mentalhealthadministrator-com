#!/usr/bin/env python3
import json,hashlib
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[2];data=json.loads((ROOT/'publishing/2026-10-13/release-data.json').read_text());W,H=1200,630
bold='/System/Library/Fonts/Supplemental/Arial Bold.ttf';regular='/System/Library/Fonts/Supplemental/Arial.ttf'
def font(path,size):
 try:return ImageFont.truetype(path,size)
 except:return ImageFont.load_default()
def wrap(draw,text,face,width):
 lines=[];line=''
 for word in text.split():
  test=(line+' '+word).strip()
  if draw.textbbox((0,0),test,font=face)[2]<=width:line=test
  else:lines.append(line);line=word
 if line:lines.append(line)
 return lines
def create(item,index,kind):
 palettes=[((246,242,233),(53,92,91),(210,112,92)),((245,240,248),(83,64,112),(90,143,126)),((240,246,245),(44,91,105),(197,122,151)),((249,244,237),(93,83,60),(102,137,171))]
 bg,ink,accent=palettes[index%4];image=Image.new('RGB',(W,H),bg);draw=ImageDraw.Draw(image);draw.rectangle((0,0,22,H),fill=accent);draw.rounded_rectangle((735,70,1125,555),32,fill=(255,253,250),outline=ink,width=5)
 seed=int(hashlib.sha256(item['slug'].encode()).hexdigest()[:8],16)
 for row in range(6):
  y=132+row*62;length=205+((seed>>(row*3))&120);draw.rounded_rectangle((785,y,785+length,y+25),7,fill=(accent if row%2 else ink));draw.ellipse((1058,y-3,1090,y+29),fill=bg,outline=ink,width=3)
 draw.text((70,62),'RESEARCH BRIEF' if kind=='research' else 'PRACTICE GUIDE',font=font(bold,24),fill=accent)
 size=47
 while size>31:
  face=font(bold,size);lines=wrap(draw,item['title'],face,605)
  if len(lines)<=4:break
  size-=2
 y=135
 for line in lines:draw.text((70,y),line,font=face,fill=ink);y+=size+12
 draw.text((72,525),'MENTAL HEALTH ADMINISTRATOR',font=font(bold,21),fill=ink);draw.text((72,563),'EVIDENCE • OWNERSHIP • REVIEW',font=font(regular,18),fill=accent)
 return image
for i,item in enumerate(data['blogs']):create(item,i,'blog').save(ROOT/'public/blog'/f"{item['slug']}.webp",'WEBP',quality=86,method=6)
for i,item in enumerate(data['research']):create(item,i+12,'research').save(ROOT/'public/research'/f"{item['slug']}.webp",'WEBP',quality=86,method=6)
print('Generated 17 exact-title 1200x630 WebP thumbnails.')
