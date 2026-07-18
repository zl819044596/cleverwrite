export async function onRequest(context) {
  const { request, env } = context;

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { text, tone = 'casual' } = await request.json();

    if (!text || text.length > 5000) {
      return new Response(JSON.stringify({
        error: text ? 'Text too long (max 5000 chars)' : 'Text is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const toneInstructions = {
      casual: 'Make it sound natural and conversational, like a native English speaker.',
      professional: 'Make it sound professional and polished, suitable for business communication.',
      academic: 'Make it sound formal and scholarly, suitable for academic writing.'
    };

    const systemPrompt = `You are a text humanizer. Your job is to rewrite AI-generated text to sound naturally human-written.

Rules:
1. Keep the original meaning and factual content
2. Vary sentence structure and length
3. Add natural transitions and colloquialisms where appropriate
4. Remove AI-like patterns (repetitive structures, overly perfect grammar, unnatural word choices)
5. Do NOT add any markers, notes, or explanations
6. Output ONLY the rewritten text, nothing else
7. ${toneInstructions[tone] || toneInstructions.casual}`;

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
        temperature: 0.7,
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
      detected_as_human: true
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Humanize error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
