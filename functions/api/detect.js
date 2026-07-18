export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { text } = await request.json();

    if (!text || text.length > 10000) {
      return new Response(JSON.stringify({
        error: text ? 'Text too long (max 10000 chars)' : 'Text is required'
      }), { status: 400, headers: { 'Content-Type': 'application/json' }});
    }

    const systemPrompt = `You are an AI content detector. Analyze the given text and determine if it was written by AI or a human.

Respond with ONLY a JSON object (no markdown, no explanation):
{
  "score": <0-100 number>,
  "label": "AI-generated" | "Likely AI" | "Uncertain" | "Likely Human" | "Human-written",
  "reasons": ["reason1", "reason2"],
  "highlights": ["suspicious phrase 1", "suspicious phrase 2"]
}

Score: 0-100 (100 = definitely AI, 0 = definitely human)
Label mapping: 80-100 = "AI-generated", 60-79 = "Likely AI", 40-59 = "Uncertain", 20-39 = "Likely Human", 0-19 = "Human-written"
Reasons: 2-3 short reasons for your assessment
Highlights: 2-3 specific phrases that seem AI-like (if AI detected)`;

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
        temperature: 0.3,
        max_tokens: 1024
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

    // Parse the JSON response from DeepSeek
    let analysis;
    try {
      analysis = JSON.parse(data.choices[0].message.content.trim());
    } catch {
      // Fallback if response isn't valid JSON
      analysis = {
        score: 50,
        label: "Uncertain",
        reasons: ["Analysis parsing error"],
        highlights: []
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Detect error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
