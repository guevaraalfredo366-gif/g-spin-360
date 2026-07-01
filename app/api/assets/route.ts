import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CLOUD = 'ddsylhrzz';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
};

function parseDurationSec(publicId: string): number | null {
  const file = publicId.split('/').pop() ?? '';
  const m = file.match(/_(\d+)s(?:ec)?(?:[_.]|$)/i);
  return m ? parseInt(m[1], 10) : null;
}

function parseLabel(publicId: string): string {
  const file = publicId.split('/').pop() ?? '';
  return file
    .replace(/\.[^.]+$/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function listFolder(
  prefix: string,
  type: 'image' | 'video',
  auth: string,
): Promise<{ public_id: string }[]> {
  const qs = new URLSearchParams({ prefix, type: 'upload', max_results: '500' });
  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD}/resources/${type}?${qs}`,
      { headers: { Authorization: auth } },
    );
    if (!res.ok) return [];
    const data = await res.json() as { resources?: { public_id: string }[] };
    return data.resources ?? [];
  } catch {
    return [];
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: { ...CORS_HEADERS, 'Access-Control-Allow-Methods': 'GET' } });
}

export async function GET() {
  const apiKey    = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json({ intro: [], outro: [], frame: [], music: [] }, { headers: CORS_HEADERS });
  }

  const auth = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;

  const [intros, outros, frames, music] = await Promise.all([
    listFolder('eventos360/intros', 'video', auth),
    listFolder('eventos360/outros', 'video', auth),
    listFolder('eventos360/frames', 'image', auth),
    listFolder('eventos360/musica', 'video',  auth),
  ]);

  const toAssets = (list: { public_id: string }[]) =>
    list.map((r, i) => ({
      id:          r.public_id,
      label:       parseLabel(r.public_id),
      publicId:    r.public_id,
      durationSec: parseDurationSec(r.public_id),
      order:       i,
    }));

  return NextResponse.json(
    { intro: toAssets(intros), outro: toAssets(outros), frame: toAssets(frames), music: toAssets(music) },
    { headers: CORS_HEADERS },
  );
}
