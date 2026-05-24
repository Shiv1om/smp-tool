export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const API_KEY = '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';

  try {
    const { image, mediaType } = req.body;
    if (!image) return res.status(400).json({ error: 'No image provided' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: image }
            },
            {
              type: 'text',
              text: `You are a warm, honest SMP (Scalp Micropigmentation) consultant at Look Young Clinic in Delhi. Help this person visualise how SMP could transform their look.

Write a personalised SMP preview in 3 short paragraphs:

Paragraph 1: Kind, honest observation about their current hair situation. 2 sentences max. Warm, never harsh.

Paragraph 2: Vivid description of how SMP would look on THEM — the hairline that would be recreated, density effect on their crown, how it complements their face shape and beard if any. Make it visual and real. 3 sentences.

Paragraph 3: One honest practical note — maintenance, shaving routine, longevity. 1-2 sentences. End with a sentence that makes them curious to see it in person.

Under 130 words total. No bullet points, no medical claims, no hype.`
            }
          ]
        }]
      })
    });

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return res.status(response.status).json(data);
    } catch(e) {
      return res.status(500).json({ error: 'Anthropic error', detail: text.slice(0, 300) });
    }

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
