#!/usr/bin/env python3
import json,hashlib
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[2]; data=json.loads((ROOT/'publishing/2026-10-12/release-data.json').read_text()); W,H=1200,630
bold='/System/Library/Fonts/Supplemental/Arial Bold.ttf'; regular='/System/Library/Fonts/Supplemental/Arial.ttf'
def f(p,s):
 try:return ImageFont.truetype(p,s)
 except:return ImageFont.load_default()
def wrap(d,text,font,maxw):
 lines=[]; line=''
 for word in text.split():
  test=(line+' '+word).strip()
  if d.textbbox((0,0),test,font=font)[2]<=maxw:line=test
  else:lines.append(line);line=word
 if line:lines.append(line)
 return lines
def draw(item,i,kind):
 palettes=[((247,243,234),(97,121,105),(233,130,99)),((250,246,238),(111,91,126),(101,142,121)),((244,239,230),(67,104,109),(213,118,93)),((249,244,238),(87,111,91),(190,139,166))]
 bg,mid,accent=palettes[i%4]; im=Image.new('RGB',(W,H),bg);d=ImageDraw.Draw(im)
 d.rectangle((0,0,20,H),fill=accent); d.rounded_rectangle((700,65,1115,555),28,fill=(255,253,252),outline=(43,32,43),width=5)
 seed=int(hashlib.sha256(item['slug'].encode()).hexdigest()[:8],16)
 for n in range(6):
  y=125+n*65; width=235+((seed>>(n*3))&95);d.rounded_rectangle((755,y,755+width,y+28),8,fill=[mid,accent,(221,213,231)][n%3]);d.ellipse((1040,y-2,1074,y+32),fill=(255,253,252),outline=(43,32,43),width=3)
 d.text((70,66),'RESEARCH BRIEF' if kind=='research' else 'PRACTICE GUIDE',font=f(bold,24),fill=mid)
 size=49
 while size>32:
  font=f(bold,size); lines=wrap(d,item['title'],font,555)
  if len(lines)<=4:break
  size-=2
 y=132
 for line in lines:d.text((70,y),line,font=font,fill=(43,32,43));y+=size+11
 d.text((72,520),'MENTAL HEALTH ADMINISTRATOR',font=f(bold,21),fill=mid);d.text((72,558),'2026-10-12',font=f(regular,18),fill=(91,81,91))
 return im
for i,item in enumerate(data['blogs']):
 im=draw(item,i,'blog');stem=ROOT/'public/blog'/item['slug'];im.save(str(stem)+'.png',optimize=True);im.save(str(stem)+'.webp','WEBP',quality=88,method=6)
for i,item in enumerate(data['research']):
 im=draw(item,i+12,'research');stem=ROOT/'public/research'/item['slug'];im.save(str(stem)+'.png',optimize=True);im.save(str(stem)+'.webp','WEBP',quality=88,method=6)
