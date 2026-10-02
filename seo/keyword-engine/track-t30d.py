#!/usr/bin/env python3
import csv,datetime,pathlib
p=pathlib.Path(__file__).with_name('keyword-queue.csv');rows=list(csv.DictReader(p.open()));print(f'{datetime.date.today().isoformat()}: {len(rows)} tracked keywords')
