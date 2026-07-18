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
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const systemPrompt = `You are a professional Grammar Checker. Analyze the provided text and return a detailed grammar report.

Output ONLY valid JSON with this structure (no markdown, no explanation):
{
  "errorCount": <number>,
  "correctedText": "<full corrected version of the input text>",
  "issues": [
    {
      "type": "grammar|spelling|punctuation|style|readability",
      "original": "<the problematic phrase>",
      "suggestion": "<the correction suggestion>",
      "explanation": "<brief explanation of the rule>"
    }
  ],
  "readabilityScore": <number 0-100>,
  "suggestions": "<2-3 brief improvement tips as a single paragraph>"
}

If there are no issues, return:
{
  "errorCount": 0,
  "correctedText": "<original text unchanged>",
  "issues": [],
  "readabilityScore": <number>,
  "suggestions": "Your text looks good! Consider reading it aloud for a final check."
}

Be strict but helpful. Focus on real errors — don't flag things unnecessarily.`;

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
        temperature: 0.1,
        max_tokens: 4096
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Grammar API error:', data);
      return new Response(JSON.stringify({ error: 'Grammar API error' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let result;
    try {
      const content = data.choices[0].message.content.trim();
      // Remove markdown code blocks if present
      const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(jsonStr);
    } catch (e) {
      // Fallback: return raw text as corrected
      result = {
        errorCount: 0,
        correctedText: data.choices[0].message.content.trim(),
        issues: [],
        readabilityScore: 75,
        suggestions: 'Analysis complete. Review the corrected text above.'
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Grammar check error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
