#!/usr/bin/env python3
"""Fail when prohibited dash characters appear in rendered visitor or crawler text."""
from html.parser import HTMLParser
import pathlib
import re
import sys

BAD = {'\u2014': 'em dash', '\u2013': 'en dash', '--': 'reader facing double hyphen'}
RENDERED_EXTENSIONS = {'.html', '.htm', '.xml', '.txt', '.svg'}
VISIBLE_ATTRIBUTES = {'alt', 'title', 'content', 'aria-label'}

class RenderedTextParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.hidden: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]):
        values = dict(attrs)
        if tag in {'style', 'template'}:
            self.hidden.append(tag)
        elif tag == 'script' and values.get('type') != 'application/ld+json':
            self.hidden.append(tag)
        for name, value in attrs:
            if name in VISIBLE_ATTRIBUTES and value:
                self.parts.append(value)

    def handle_endtag(self, tag: str):
        if self.hidden and self.hidden[-1] == tag:
            self.hidden.pop()

    def handle_data(self, data: str):
        if not self.hidden:
            self.parts.append(data)


def rendered_text(path: pathlib.Path) -> str:
    raw = path.read_text(errors='ignore')
    if path.suffix.lower() == '.txt':
        return raw
    parser = RenderedTextParser()
    parser.feed(raw)
    return '\n'.join(parser.parts)


def main() -> int:
    root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.')
    found: list[str] = []
    for path in root.rglob('*'):
        if not path.is_file() or path.suffix.lower() not in RENDERED_EXTENSIONS:
            continue
        try:
            text = rendered_text(path)
        except OSError:
            continue
        for token, name in BAD.items():
            if token in text:
                sample = re.sub(r'\s+', ' ', text[text.index(token) - 35:text.index(token) + 45]).strip()
                found.append(f'{path}: {name}: {sample}')
    if found:
        print('\n'.join(found))
        return 1
    print('Rendered dash scan passed.')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
