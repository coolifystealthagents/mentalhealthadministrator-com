#!/usr/bin/env python3
import argparse,csv,json,math,pathlib,re

def front(path):
 text=path.read_text(errors='ignore');title='';slug=path.stem
 for line in text.splitlines()[:40]:
  if line.lower().startswith('title:'):title=line.split(':',1)[1].strip().strip('"\'')
  if line.lower().startswith('slug:'):slug=line.split(':',1)[1].strip().strip('"\'')
 return slug,title or slug.replace('-',' ').title()
def main():
 p=argparse.ArgumentParser();p.add_argument('--config',required=True);p.add_argument('--content',required=True);p.add_argument('--out',required=True);p.add_argument('--limit',type=int);p.add_argument('--min-concepts',type=int,default=30);p.add_argument('--strict',action='store_true');a=p.parse_args();c=json.load(open(a.config));concepts=c['template_concepts'];missing=[]
 for key in concepts:
  if key not in c['classifier'] or key not in c['category_labels'] or key not in c['subtitles']:missing.append(key)
 if len(concepts)<a.min_concepts or missing:
  msg=f'Configuration incomplete. concepts={len(concepts)} missing={missing}'
  if a.strict:raise SystemExit(msg)
  print('WARNING:',msg)
 files=sorted([x for x in pathlib.Path(a.content).rglob('*') if x.suffix in {'.md','.mdx'} and '_drafts' not in x.parts]);files=files[:a.limit] if a.limit else files;loads={k:0 for k in concepts};rows=[];cap=math.ceil(max(1,len(files))/len(concepts)*c['even_distribution']['cap_factor'])
 for f in files:
  slug,title=front(f);hay=title.lower();scores={k:sum(1 for word in c['classifier'][k] if word in hay) for k in concepts};ordered=sorted(concepts,key=lambda k:(-scores[k],c['tiebreak_priority'].index(k)));eligible=ordered+c['general_pool']+[c['default_template']];choice=next((k for k in eligible if loads[k]<cap),min(concepts,key=lambda k:loads[k]));loads[choice]+=1;rows.append([slug,title,choice,c['category_labels'][choice],c['subtitles'][choice]])
 with open(a.out,'w',newline='') as h:w=csv.writer(h);w.writerow(['slug','title','template','categoryLabel','subtitle']);w.writerows(rows)
if __name__=='__main__':main()
