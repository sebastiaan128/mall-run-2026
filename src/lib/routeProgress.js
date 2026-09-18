// De punt van de getekende lijn staat altijd op 60% van de schermhoogte: daar
// "komt" een halte aan. Door zowel de lijnlengte als het activeren van haltes op
// dat ene punt te baseren, lopen ze nooit uit de pas.
export const ARRIVAL_RATIO = 0.6;

function clamp01(value) {
  return Math.min(Math.max(value, 0), 1);
}

function tipPosition(scrollY, viewportHeight) {
  return scrollY + viewportHeight * ARRIVAL_RATIO;
}

export function drawnFraction(scrollY, viewportHeight, documentHeight) {
  if (documentHeight <= 0 || documentHeight <= viewportHeight) return 1;
  return clamp01(tipPosition(scrollY, viewportHeight) / documentHeight);
}

export function isStopReached(stopY, scrollY, viewportHeight) {
  return stopY <= tipPosition(scrollY, viewportHeight);
}

// Verdeelt de haltes gelijkmatig over de zeven kilometer van één ronde: halte 0
// staat op km 0, de laatste op km 7, de rest ertussenin naar rato.
export function stopKilometres(count) {
  if (count <= 0) return [];
  if (count === 1) return [0];
  return Array.from({ length: count }, (_, i) => Math.round(((7 * i) / (count - 1)) * 10) / 10);
}
