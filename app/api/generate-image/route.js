import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt, numImages, size, imagesData } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid prompt' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GOOGLE_GEMINI_API_KEY not set' }, { status: 500 });
    }

    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent';

    const imagesToGenerate = Math.max(1, Math.min(4, parseInt(numImages || '1', 10) || 1));

    const runOnce = async () => {
      const promptWithHints = size ? `${prompt}\n\nPrefer output size: ${size}` : prompt;
      // Build message parts: optional images + text instruction
      const messageParts = [];
      // If images provided (as data URLs), include them as inlineData parts
      if (Array.isArray(imagesData) && imagesData.length > 0) {
        for (const url of imagesData.slice(0, 4)) {
          if (typeof url !== 'string') continue;
          const match = url.match(/^data:(.*?);base64,(.*)$/);
          if (!match) continue;
          const mimeType = match[1] || 'image/png';
          const data = match[2] || '';
          if (data) {
            messageParts.push({ inlineData: { mimeType, data } });
          }
        }
        // Add guidance text to combine the provided images
        messageParts.push({ text: `Compose a final image based on the prompt, combining all provided images in a cohesive way. ${promptWithHints}` });
      } else {
        messageParts.push({ text: promptWithHints });
      }
      const res = await fetch(`${endpoint}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: messageParts,
            },
          ],
          generationConfig: {
            responseModalities: ["IMAGE", "TEXT"],
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(async () => ({ message: await res.text().catch(() => '') }));
        const message = err?.error?.message || err?.message || `Upstream error ${res.status}`;
        const upstream = err?.error || err;
        const e = new Error(message);
        // @ts-ignore
        e.upstream = upstream;
        throw e;
      }

      const json = await res.json();
      const parts = json?.candidates?.[0]?.content?.parts || [];
      const out = { images: [], text: '' };
      for (const part of parts) {
        const mime = part?.inlineData?.mimeType || part?.inline_data?.mime_type;
        const data = part?.inlineData?.data || part?.inline_data?.data;
        if ((mime && mime.startsWith('image/')) && data) {
          out.images.push(`data:${mime};base64,${data}`);
        } else if (part?.text) {
          out.text += part.text + '\n';
        }
      }
      return out;
    };

    const results = await Promise.all(Array.from({ length: imagesToGenerate }).map(() => runOnce()));
    const images = results.flatMap(r => r.images);
    const text = results.map(r => r.text).join('\n').trim();

    return NextResponse.json({ images, text });
  } catch (error) {
    console.error('generate-image route error:', error);
    const message = (error && typeof error === 'object' && 'message' in error) ? error.message : String(error);
    // @ts-ignore
    const upstream = error?.upstream;
    return NextResponse.json({ error: message, details: upstream || null }, { status: 500 });
  }
}
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


