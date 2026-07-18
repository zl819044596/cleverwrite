import json

with open('/Volumes/Data/GitHub/cleverwrite/src/data/programmatic-pages.json') as f:
    pages = json.load(f)

translate_types = [
    ("essay", "Essay"), ("article", "Article"), ("email", "Email"),
    ("blog-post", "Blog Post"), ("cover-letter", "Cover Letter"),
    ("resume", "Resume"), ("webpage", "Web Page"), ("document", "Document"),
    ("letter", "Letter"), ("report", "Report"), ("speech", "Speech"),
    ("social-media-post", "Social Media Post"),
]

new_pages = []
for slug_part, display_name in translate_types:
    desc = f"Translate your {display_name.lower()} between languages. Free online translation tool."
    keywords = f"translate {display_name.lower()}, {display_name.lower()} translator"
    h1 = f"Translate {display_name} — Free AI Tool"
    new_pages.append({
        "slug": f"translate-{slug_part}",
        "verb": "translate",
        "displayVerb": "Translate",
        "displayAction": "Translate",
        "contentType": display_name,
        "h1": h1, "desc": desc, "keywords": keywords
    })

existing_slugs = {p['slug'] for p in pages}
deduped = [p for p in new_pages if p['slug'] not in existing_slugs]
pages.extend(deduped)
pages.sort(key=lambda p: p['slug'])

with open('/Volumes/Data/GitHub/cleverwrite/src/data/programmatic-pages.json', 'w') as f:
    json.dump(pages, f, indent=2)

from collections import Counter
vc = Counter(p['verb'] for p in pages)
print(f"Total: {len(pages)}")
for v, c in sorted(vc.items()):
    print(f"  {v}: {c}")
