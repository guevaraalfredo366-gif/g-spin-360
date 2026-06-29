// Proxy de descarga para videos cross-origin de Cloudinary.
// Añade Content-Disposition: attachment para forzar descarga en iOS Safari y Android.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url      = searchParams.get('url');
  const filename = searchParams.get('name') ?? 'gspin360.mp4';

  if (!url || !url.startsWith('https://res.cloudinary.com/ddsylhrzz/')) {
    return new Response('URL inválida', { status: 400 });
  }

  let upstream;
  try {
    upstream = await fetch(url, { cache: 'no-store' });
  } catch {
    return new Response('No se pudo obtener el video', { status: 502 });
  }

  if (!upstream.ok) {
    return new Response('Video no disponible', { status: upstream.status });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type':        'video/mp4',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control':       'no-store',
    },
  });
}
