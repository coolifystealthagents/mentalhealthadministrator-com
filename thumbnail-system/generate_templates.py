#!/usr/bin/env python3
import argparse,base64,json,os,pathlib,time,urllib.request,urllib.error
from io import BytesIO

def main():
 p=argparse.ArgumentParser();p.add_argument('--config',default='thumbnail-system/brand_config.json');p.add_argument('concepts',nargs='*');a=p.parse_args();cfg=json.load(open(a.config));key=os.environ.get('GEMINI_API_KEY')
 if not key: raise SystemExit('GEMINI_API_KEY is required. No alternate image source will be used.')
 ids=a.concepts or list(cfg['template_concepts']);out=pathlib.Path(cfg['templates_dir']);out.mkdir(parents=True,exist_ok=True)
 for cid in ids:
  if cid not in cfg['template_concepts']:raise SystemExit(f'Unknown concept: {cid}')
  prompt=' '.join([cfg['style_prompt'],cfg['template_concepts'][cid],cfg['negative_prompt']])
  url=f"https://generativelanguage.googleapis.com/v1beta/models/{cfg['image_model']}:generateContent?key={key}"
  payload=json.dumps({'contents':[{'parts':[{'text':prompt}]}],'generationConfig':{'responseModalities':['TEXT','IMAGE']}}).encode()
  for attempt in range(4):
   try:
    with urllib.request.urlopen(urllib.request.Request(url,data=payload,headers={'Content-Type':'application/json'}),timeout=120) as r:data=json.load(r)
    break
   except urllib.error.HTTPError as e:
    detail=e.read().decode(errors='replace')
    if e.code==429 and attempt<3:time.sleep(15);continue
    raise SystemExit(f'Gemini error {e.code}: {detail}')
  parts=data['candidates'][0]['content']['parts'];blob=next((x.get('inlineData',{}).get('data') for x in parts if x.get('inlineData')),None)
  if not blob:raise SystemExit(f'No image payload returned for {cid}')
  from PIL import Image
  image=Image.open(BytesIO(base64.b64decode(blob))).convert('RGB').resize((cfg['canvas']['width'],cfg['canvas']['height']))
  image.save(out/f'{cid}.png');time.sleep(2)
if __name__=='__main__':main()
