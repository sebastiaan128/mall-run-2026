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
