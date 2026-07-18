export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { text, verb = 'humanize', tone = 'casual' } = await request.json();

    if (!text || text.length > 5000) {
      return new Response(JSON.stringify({
        error: text ? 'Text too long (max 5000 chars)' : 'Text is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const verbInstructions = {
      humanize: 'Make it sound natural and conversational, like a native English speaker. Remove AI patterns, vary sentence structure, add natural colloquialisms.',
      rewrite: 'Rewrite this text completely using different words and sentence structures while preserving the original meaning and key information.',
      paraphrase: 'Paraphrase this text — express the same ideas using different vocabulary and sentence structures. Keep the meaning identical.',
      summarize: 'Summarize this text to its key points. Be concise — keep only the most important information. Output a clear, readable summary.',
      improve: 'Improve this text: fix grammar errors, enhance clarity, improve flow, and make it more readable while preserving the original voice and meaning.',
      expand: 'Expand this text by adding more detail, examples, and depth. Make it more informative and comprehensive while staying on topic.',
      shorten: 'Shorten this text while keeping all key information. Remove fluff, redundant words, and unnecessary phrases. Make it tight and direct.',
      polish: 'Polish this text: fix grammar, spelling, and punctuation. Improve sentence flow and readability. Keep the original meaning and tone intact.',
      formalize: 'Make this text more formal and professional. Use sophisticated vocabulary, formal sentence structures, and appropriate academic/business tone.',
      simplify: 'Simplify this text to make it easier to understand. Use simpler words, shorter sentences, and clearer structure. Keep the core meaning.',
      translate: 'Translate this text to natural, fluent English. If the text is already in English, translate it to clear, conversational Chinese. If the text is in another language, translate it to natural English. Keep the original meaning, tone, and style. Output ONLY the translation, nothing else.'
    };

    const systemPrompt = `You are a professional writing assistant. Your job is to ${verb} text according to the instructions below.

Rules:
1. Keep the original meaning and factual content
2. Output ONLY the processed text, nothing else — no notes, no explanations, no markdown
3. Do NOT add phrases like "Here is your rewritten text" or "Sure, I'd be happy to"
4. Just output the ${verb}ed version directly
5. ${verbInstructions[verb] || verbInstructions.rewrite}`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + env.DEEPSEEK_API_KEY
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: verb === 'summarize' || verb === 'shorten' ? 0.3 : 0.7,
        max_tokens: 8192
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('DeepSeek API error:', data);
      return new Response(JSON.stringify({ error: 'AI service error' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({
      result,
      verb
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Tool API error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
