import { IncomingMessage, ServerResponse } from 'http';

export function getValidId(
  req: IncomingMessage,
  res: ServerResponse,
): number | undefined {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const idParam = url.searchParams.get('id');
  if (!idParam) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing id query parameter' }));
    return;
  }
  const id = parseInt(idParam);
  if (!id || isNaN(id)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid or missing ID' }));
    return;
  }
  if (id.toString().length > 9) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        error: `Value '${id}' is out of range for type integer`,
      }),
    );
    return;
  }
  return id;
}
