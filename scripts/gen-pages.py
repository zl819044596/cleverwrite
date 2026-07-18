import json

# Content types grouped by category
content_types = {
    "academic": [
        ("essay", "Essay", "essays and papers"),
        ("college-essay", "College Essay", "college application essays"),
        ("thesis", "Thesis", "thesis papers"),
        ("dissertation", "Dissertation", "dissertations"),
        ("research-paper", "Research Paper", "research papers"),
        ("term-paper", "Term Paper", "term papers"),
        ("book-report", "Book Report", "book reports"),
        ("lab-report", "Lab Report", "lab reports"),
        ("statement-of-purpose", "Statement of Purpose", "SOPs"),
        ("personal-statement", "Personal Statement", "personal statements"),
        ("recommendation-letter", "Recommendation Letter", "recommendation letters"),
        ("homework", "Homework", "homework assignments"),
    ],
    "professional": [
        ("resume", "Resume", "resumes"),
        ("cover-letter", "Cover Letter", "cover letters"),
        ("job-description", "Job Description", "job descriptions"),
        ("performance-review", "Performance Review", "performance reviews"),
        ("business-proposal", "Business Proposal", "business proposals"),
        ("case-study", "Case Study", "case studies"),
        ("white-paper", "White Paper", "white papers"),
        ("grant-proposal", "Grant Proposal", "grant proposals"),
        ("pitch-deck", "Pitch Deck", "pitch decks"),
        ("executive-summary", "Executive Summary", "executive summaries"),
        ("memo", "Memo", "memos"),
        ("report", "Report", "reports"),
    ],
    "email": [
        ("email", "Email", "emails"),
        ("cold-email", "Cold Email", "cold emails"),
        ("follow-up-email", "Follow-up Email", "follow-up emails"),
        ("introduction-email", "Introduction Email", "introduction emails"),
        ("sales-email", "Sales Email", "sales emails"),
        ("newsletter", "Newsletter", "newsletters"),
    ],
    "social": [
        ("linkedin-post", "LinkedIn Post", "LinkedIn posts"),
        ("linkedin-summary", "LinkedIn Summary", "LinkedIn summaries"),
        ("facebook-post", "Facebook Post", "Facebook posts"),
        ("instagram-caption", "Instagram Caption", "Instagram captions"),
        ("reddit-post", "Reddit Post", "Reddit posts"),
        ("twitter-thread", "Twitter Thread", "Twitter threads"),
        ("tiktok-script", "TikTok Script", "TikTok scripts"),
    ],
    "content": [
        ("blog-post", "Blog Post", "blog posts"),
        ("article", "Article", "articles"),
        ("marketing-copy", "Marketing Copy", "marketing copy"),
        ("sales-page", "Sales Page", "sales pages"),
        ("landing-page", "Landing Page", "landing pages"),
        ("product-description", "Product Description", "product descriptions"),
        ("service-description", "Service Description", "service descriptions"),
        ("about-page", "About Page", "about pages"),
        ("press-release", "Press Release", "press releases"),
        ("seo-description", "SEO Description", "SEO descriptions"),
    ],
    "creative": [
        ("story", "Story", "stories"),
        ("novel-chapter", "Novel Chapter", "novel chapters"),
        ("poem", "Poem", "poems"),
        ("song-lyrics", "Song Lyrics", "song lyrics"),
        ("youtube-script", "YouTube Script", "YouTube scripts"),
        ("podcast-script", "Podcast Script", "podcast scripts"),
    ],
    "web": [
        ("bio", "Bio", "bios"),
        ("testimonial", "Testimonial", "testimonials"),
        ("review", "Review", "reviews"),
        ("faq", "FAQ", "FAQs"),
    ],
}

verbs = [
    ("humanize", "Humanize", "Humanize", "all"),
    ("rewrite", "Rewrite", "Rewrite", "all"),
    ("paraphrase", "Paraphrase", "Paraphrase", "all"),
    ("improve", "Improve", "Improve", "all"),
    ("polish", "Polish", "Polish", "all"),
    ("summarize", "Summarize", "Summarize", ["academic", "professional", "content", "email"]),
    ("expand", "Expand", "Expand", ["academic", "professional", "content", "creative"]),
    ("shorten", "Shorten", "Shorten", ["academic", "professional", "content", "email"]),
    ("formalize", "Formalize", "Make Formal", ["email", "social", "creative"]),
    ("simplify", "Simplify", "Simplify", ["academic", "professional", "content"]),
]

verb_descs = {
    "humanize": "Make your AI-written {name} sound naturally human. Bypass AI detectors.",
    "rewrite": "Rewrite your {name} with different wording and sentence structures.",
    "paraphrase": "Paraphrase your {name} to express the same ideas in new words.",
    "improve": "Improve your {name}: fix errors, enhance clarity, and boost readability.",
    "polish": "Polish your {name}: fix grammar, spelling, and sentence flow.",
    "summarize": "Summarize your {name} to its key points. Save time reading.",
    "expand": "Expand your {name} with more detail, examples, and depth.",
    "shorten": "Shorten your {name} to be concise and direct. Remove fluff.",
    "formalize": "Make your {name} more formal and professional in tone.",
    "simplify": "Simplify your {name} to be easier to understand. Use plain language.",
}

verb_keywords = {
    "humanize": "humanize {content}, {content} humanizer, make {content} sound human",
    "rewrite": "rewrite {content}, {content} rewriter, rewrite {content} online free",
    "paraphrase": "paraphrase {content}, {content} paraphraser, rephrase {content} online",
    "improve": "improve {content}, {content} improver, make {content} better online",
    "polish": "polish {content}, {content} polisher, fix {content} grammar and style",
    "summarize": "summarize {content}, {content} summarizer, {content} summary generator",
    "expand": "expand {content}, {content} expander, make {content} longer and detailed",
    "shorten": "shorten {content}, {content} shortener, make {content} shorter and concise",
    "formalize": "formalize {content}, make {content} formal, formal {content} writing",
    "simplify": "simplify {content}, {content} simplifier, plain language {content}",
}

pages = []

for verb_id, display_verb, display_action, applicable in verbs:
    for cat_key, types in content_types.items():
        if applicable != "all" and cat_key not in applicable:
            continue
        
        for slug_part, display_name, plural_desc in types:
            slug = f"{verb_id}-{slug_part}"
            desc = verb_descs.get(verb_id, "Process your {name}.").format(name=display_name.lower())
            kw_template = verb_keywords.get(verb_id, "{verb} {content}")
            keywords = kw_template.format(content=plural_desc, verb=display_verb.lower())
            h1 = f"{display_verb} {display_name} — Free AI Tool"
            
            pages.append({
                "slug": slug,
                "verb": verb_id,
                "displayVerb": display_verb,
                "displayAction": display_action,
                "contentType": display_name,
                "h1": h1,
                "desc": desc,
                "keywords": keywords
            })

# Deduplicate
seen = set()
deduped = []
for p in pages:
    if p["slug"] not in seen:
        seen.add(p["slug"])
        deduped.append(p)

print(f"Total pages: {len(deduped)}")
for v in sorted(set(p["verb"] for p in deduped)):
    count = sum(1 for p in deduped if p["verb"] == v)
    print(f"  {v}: {count}")

with open('/Volumes/Data/GitHub/cleverwrite/src/data/programmatic-pages.json', 'w') as f:
    json.dump(deduped, f, indent=2)

print("Done")
