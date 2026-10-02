#!/usr/bin/env python3
import argparse,csv,json,pathlib,textwrap
from PIL import Image,ImageDraw,ImageFont,ImageEnhance

def main():
 p=argparse.ArgumentParser();p.add_argument('--config',required=True);p.add_argument('--assignments',required=True);a=p.parse_args();c=json.load(open(a.config));out=pathlib.Path(c['output_dir']);out.mkdir(parents=True,exist_ok=True);bold=ImageFont.truetype(c['fonts']['bold'],c['typography']['title_size']);regular=ImageFont.truetype(c['fonts']['regular'],c['typography']['subtitle_size']);label=ImageFont.truetype(c['fonts']['bold'],c['typography']['label_size'])
 for row in csv.DictReader(open(a.assignments)):
  source=pathlib.Path(c['templates_dir'])/(row['template']+'.png')
  if not source.exists():raise SystemExit(f'Missing accepted template: {source}')
  im=Image.open(source).convert('RGB').resize((c['canvas']['width'],c['canvas']['height']));overlay=Image.new('RGBA',im.size,(0,0,0,0));ImageDraw.Draw(overlay).rectangle((0,0,int(im.width*.58),im.height),fill=(12,32,51,205));im=Image.alpha_composite(im.convert('RGBA'),overlay);d=ImageDraw.Draw(im);x=c['typography']['left'];d.text((x,75),row['categoryLabel'],font=label,fill=(233,162,59));lines=textwrap.wrap(row['title'],width=26)[:4];y=145
  for line in lines:d.text((x,y),line,font=bold,fill=(251,247,237));y+=c['typography']['line_height']
  d.text((x,520),row['subtitle'],font=regular,fill=(198,226,220));im.convert('RGB').save(out/(row['slug']+'.webp'),'WEBP',quality=90)
if __name__=='__main__':main()
