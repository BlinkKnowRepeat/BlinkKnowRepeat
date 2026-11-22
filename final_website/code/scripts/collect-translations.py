"""Collect public copy from the English edition of a running local server."""
import json
import re
import sys
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import urlopen

SKIP = {'script', 'style', 'code', 'pre'}
ATTRIBUTES = {'aria-label', 'aria-roledescription', 'title', 'placeholder', 'alt',
              'data-pause', 'data-play', 'data-save-text', 'data-unsave-text',
              'data-save-label', 'data-remove-label', 'data-stop', 'data-listen-label',
              'data-copied', 'data-copy', 'data-label', 'data-unavailable', 'data-resume'}
SOURCE = Path('src/lib')
ROUTES = ['', 'slideshow/', 'news/', 'news/?topic=india', 'news/?topic=world',
          'news/?topic=technology', 'news/?topic=science', 'news/?topic=economy',
          'news/?q=NO_RESULTS_TEST', 'research/', 'events/', 'approach/', 'contact/',
          'saved/', 'account/', 'languages/', 'search/', 'search/?all=1', 'watch/', 'latest/',
          'news/?topic=india&from=2020-01-01&to=2020-01-02',
          'world/', 'technology/', 'ai/', 'science/', 'economy/', 'explain/', 'learn/',
          'article/wifi-packet/', 'article/why-the-sky-is-blue/', 'article/reading-an-inflation-number/',
          'article/generative-ai-basics/', 'article/reading-a-map/']
ROUTES += [f'post/{slug}/' for slug in re.findall(r"slug: '([a-z0-9-]+)'", (SOURCE / 'posts.ts').read_text())]
ROUTES += [f'{slug}/' for slug in re.findall(r"^  '?([a-z-]+)'?: \{ title:", (SOURCE / 'policies.ts').read_text(), re.M)]

def clean(value):
    return ' '.join(value.split())

class Reader(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ignored = 0
        self.keys = set()

    def add(self, text):
        value = clean(text)
        if re.search(r'[a-zA-Z]', value) and value not in {'en', 'EN', 'UTC'} and not value.startswith(('https://', 'http://')):
            self.keys.add(value)

    def handle_starttag(self, tag, attrs):
        if tag in SKIP:
            self.ignored += 1
        if self.ignored:
            return
        attrs = dict(attrs)
        for key in ATTRIBUTES:
            if attrs.get(key):
                self.add(attrs[key])
        if tag == 'meta' and (attrs.get('name') == 'description' or attrs.get('property') in {'og:title', 'og:description', 'og:site_name'}):
            self.add(attrs.get('content', ''))

    def handle_endtag(self, tag):
        if tag in SKIP:
            self.ignored = max(0, self.ignored - 1)

    def handle_data(self, data):
        if not self.ignored:
            self.add(data)

def collect(path):
    parser = Reader()
    with urlopen(f'{ORIGIN}/en/{path}', timeout=30) as response:
        parser.feed(response.read().decode())
    return parser.keys

ORIGIN = (sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:4321').rstrip('/')
with ThreadPoolExecutor(max_workers=4) as workers:
    keys = set().union(*workers.map(collect, ROUTES))

# Client-side messages and fragments whose numeric suffixes are formatted at runtime.
keys.update({
    'Cookie settings saved.', 'Saved language cleared', 'Google sign-in is temporarily unavailable.',
    'No voice for this language is installed on your device. Try English or install a voice.',
    'Please enter a valid email address.', 'Network error. Please try again.', 'Something went wrong. Please try again.',
    'Email address saved. The newsletter has not started yet.', 'Subscriptions are not available right now.',
    'Request not allowed.', 'Unsupported request.', 'Invalid request.', 'Thanks.', 'Saved.', 'Copied',
    'Machine-translated edition', 'min', 'stories', 'story', 'Last website check',
    'Profile link pending', 'Translated edition', 'No upcoming events are listed.', 'No past events are listed.',
    'Load video from YouTube', 'Watch on YouTube', 'YouTube video player', 'YouTube channel', 'Transcript',
    'Editorial desk', 'Sign out', 'Google',
})
print(json.dumps(sorted(keys), ensure_ascii=False, indent=2))
