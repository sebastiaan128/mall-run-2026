// De routelijn wordt niet met de hand getekend: de pagina wordt langer zodra er
// deelnemers bijkomen. Elke sectie meldt zijn verticale positie en zijn kant, en
// deze functie legt daar één pad doorheen.
//
// Zowel x als y staan in echte paginapixels: de viewBox is precies zo breed en
// hoog als de SVG zelf, dus er is geen rek en geen non-scaling-stroke nodig.
//
// De inhoud van de pagina staat in een kolom van maximaal 1200px met 24px
// (of 40px vanaf md) lucht opzij. De lijn hoort naast die kolom te lopen, niet
// erdoorheen: hij hangt dus aan de rand van de kolom, niet aan een percentage
// van het venster.
export const CONTENT_MAX = 1200;
export const CONTENT_GUTTER = 28;
export const EDGE_MARGIN = 20;

export function routeColumns(width) {
  const content = Math.min(CONTENT_MAX, width);
  const contentLeft = (width - content) / 2;
  return {
    left: Math.max(EDGE_MARGIN, contentLeft - CONTENT_GUTTER),
    right: Math.min(width - EDGE_MARGIN, contentLeft + content + CONTENT_GUTTER),
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function round(n) {
  return Math.round(n * 100) / 100;
}

// Verbindt twee opeenvolgende punten. Staan ze aan dezelfde kant, dan is dat
// een rechte lijn omlaag: de lijn blijft dan gewoon in de marge, buiten de
// tekstkolom. Staan ze aan verschillende kanten, dan loopt de lijn eerst recht
// door tot een band van 2B boven de volgende halte — daar zit de sectiepadding
// en staat geen tekst — en pas daarbinnen ligt de S-bocht die naar de halte
// overwisselt. De bocht eindigt exact op de halte (`cur.x cur.y`) en heeft aan
// beide kanten een verticale raaklijn (het tweede controlepunt deelt zijn x
// met het eindpunt, het eerste met het startpunt), dus er zit geen knik in.
function segmentTo(prev, cur) {
  if (round(prev.x) === round(cur.x)) {
    return ` L ${round(cur.x)} ${round(cur.y)}`;
  }

  const B = Math.min(80, (cur.y - prev.y) / 2);
  const bandY = cur.y - 2 * B;

  return (
    ` L ${round(prev.x)} ${round(bandY)}` +
    ` C ${round(prev.x)} ${round(bandY + 2 * B * 0.55)},` +
    ` ${round(cur.x)} ${round(cur.y - 2 * B * 0.55)},` +
    ` ${round(cur.x)} ${round(cur.y)}`
  );
}

// Rechtop in de marge, met korte overgangen vlak boven een halte. Begint
// bovenaan de pagina op de x van de eerste halte en eindigt onderaan op de x
// van de laatste.
function verticalRoute(points, height) {
  const first = points[0];
  let d = `M ${round(first.x)} 0`;
  let prev = { x: first.x, y: 0 };

  for (const cur of points) {
    d += segmentTo(prev, cur);
    prev = cur;
  }

  d += ` L ${round(prev.x)} ${round(height)}`;
  return d;
}

export function buildRoutePath(stops, size) {
  const height = size?.height ?? 0;
  const width = size?.width ?? 0;
  if (!stops.length || height <= 0 || width <= 0) return '';

  const columns = routeColumns(width);
  const points = stops.map((stop) => ({
    x: stop.side === 'right' ? columns.right : columns.left,
    y: clamp(stop.y, 0, height),
  }));

  if (points.length === 1) {
    const x = round(points[0].x);
    return `M ${x} 0 L ${x} ${round(height)}`;
  }

  return verticalRoute(points, height);
}
