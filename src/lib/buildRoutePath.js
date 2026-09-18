// De routelijn wordt niet met de hand getekend: de pagina wordt langer zodra er
// deelnemers bijkomen. Elke sectie meldt zijn verticale positie en zijn kant, en
// deze functie legt daar één vloeiend pad doorheen.
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

// Catmull-Rom door de punten, omgezet naar cubische beziers: dat geeft een
// kromme die alle haltes exact raakt, zonder dat we controlepunten verzinnen.
function curveThrough(points) {
  let d = `M ${round(points[0].x)} ${round(points[0].y)}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? points[i + 1];

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${round(c1x)} ${round(c1y)}, ${round(c2x)} ${round(c2y)}, ${round(p2.x)} ${round(p2.y)}`;
  }

  return d;
}

export function buildRoutePath(stops, size) {
  const height = size?.height ?? 0;
  const width = size?.width ?? 0;
  if (!stops.length || height <= 0 || width <= 0) return '';

  const columns = routeColumns(width);
  const middle = stops.map((stop) => ({
    x: stop.side === 'right' ? columns.right : columns.left,
    y: clamp(stop.y, 0, height),
  }));

  const first = middle[0];
  const last = middle[middle.length - 1];

  if (middle.length === 1) {
    return `M ${round(first.x)} 0 L ${round(first.x)} ${round(height)}`;
  }

  // De lijn loopt door tot boven- en onderrand, zodat hij nergens los hangt.
  const points = [{ x: first.x, y: 0 }, ...middle, { x: last.x, y: height }];
  return curveThrough(points);
}
