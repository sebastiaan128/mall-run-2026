# The Mall Run 2026 — herontwerp: implementatieplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** De publieke site van The Mall Run 2026 herbouwen rond één doorlopende routelijn die met de scroll wordt getekend, met een nieuwe identiteit (Bricolage Grotesque, YFC-oranje) en zichtbare betrokkenheid van Youth for Christ Veenendaal.

**Architecture:** Alle rekenwerk zit in pure functies in `src/lib/` (padbouw, voortgang, contrast) die los getest worden. Eén dunne hook koppelt die functies aan de scrollpositie en schrijft per frame rechtstreeks naar de DOM — nooit naar React-state, anders rendert de pagina elke frame opnieuw. Secties melden zich bij de lijn via een `data-route-stop`-attribuut, zodat er geen contextplumbing door de hele componentboom loopt.

**Tech Stack:** React 18, Vite 5, Tailwind 3, Firebase (ongewijzigd), Vitest + jsdom + @testing-library/react (nieuw).

**Spec:** `docs/superpowers/specs/2026-09-17-mall-run-herontwerp-design.md`

## Global Constraints

- Kleurtokens, exact: `paper #FFFFFF`, `base #FAFAF9`, `panel #EDEDEA`, `line #D6D5D1`, `ink #17181A`, `body #3A3937`, `muted #6E6B66`, `brand #E85812`, `brandInk #C2420E`.
- Knoppen met oranje vulling krijgen **asfaltzwarte** tekst (`ink` op `brand` = 4,95:1). Wit op `brand` is verboden (3,6:1).
- `brand` als tekstkleur alleen bij ≥ 24px bold of voor grafische elementen. Kleine oranje tekst gebruikt `brandInk`.
- Eén letterfamilie: Bricolage Grotesque (variabel, assen `wdth` en `opsz`). Archivo en Source Serif 4 worden verwijderd.
- Eén bewegingsregel: alleen de routelijn beweegt. Geen fade-ins, geen inschuivende secties.
- Bij `prefers-reduced-motion: reduce` staat de lijn meteen volledig en start er geen animatielus.
- De route-SVG is `aria-hidden="true"` en `pointer-events: none`.
- Alle zichtbare teksten zijn Nederlands.
- Geen nieuwe runtime-dependencies. Alleen devDependencies voor tests.

---

### Task 1: Testopstelling en de padbouwer

**Files:**
- Create: `src/lib/buildRoutePath.js`
- Create: `src/lib/buildRoutePath.test.js`
- Create: `vitest.config.js`
- Modify: `package.json` (scripts + devDependencies)

**Interfaces:**
- Consumes: niets.
- Produces: `buildRoutePath(stops, size) -> string`, met `stops: Array<{ y: number, side: 'left' | 'right' }>` en `size: { height: number }`. Exporteert ook de constanten `LEFT_X = 28` en `RIGHT_X = 72` (x-posities in het viewBox-stelsel van 0..100).

- [ ] **Step 1: Git-repository starten (alleen als die er nog niet is)**

Dit project staat nog niet onder versiebeheer, en dit plan commit per taak.

```bash
git rev-parse --git-dir 2>/dev/null || (git init && git add -A && git commit -m "chore: bestaande site onder versiebeheer")
```

- [ ] **Step 2: Testgereedschap installeren**

```bash
npm install -D vitest@^2 jsdom@^25 @testing-library/react@^16 @testing-library/jest-dom@^6
```

- [ ] **Step 3: Vitest configureren**

Maak `vitest.config.js`:

```js
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

Voeg in `package.json` aan `"scripts"` toe:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Schrijf de falende test**

Maak `src/lib/buildRoutePath.test.js`:

```js
import { describe, expect, it } from 'vitest';
import { buildRoutePath, LEFT_X, RIGHT_X } from './buildRoutePath.js';

describe('buildRoutePath', () => {
  it('geeft een lege string zonder haltes', () => {
    expect(buildRoutePath([], { height: 1000 })).toBe('');
  });

  it('geeft een lege string bij een hoogte van nul', () => {
    expect(buildRoutePath([{ y: 10, side: 'left' }], { height: 0 })).toBe('');
  });

  it('trekt bij één halte een rechte lijn van boven naar beneden', () => {
    expect(buildRoutePath([{ y: 500, side: 'left' }], { height: 1000 })).toBe(
      `M ${LEFT_X} 0 L ${LEFT_X} 1000`
    );
  });

  it('begint bovenaan bij de eerste halte en eindigt onderaan bij de laatste', () => {
    const d = buildRoutePath(
      [
        { y: 200, side: 'left' },
        { y: 800, side: 'right' },
      ],
      { height: 1000 }
    );
    expect(d.startsWith(`M ${LEFT_X} 0`)).toBe(true);
    expect(d.trimEnd().endsWith(`${RIGHT_X} 1000`)).toBe(true);
  });

  it('gebruikt bezierkrommen tussen haltes aan verschillende kanten', () => {
    const d = buildRoutePath(
      [
        { y: 200, side: 'left' },
        { y: 800, side: 'right' },
      ],
      { height: 1000 }
    );
    expect(d).toContain('C');
  });

  it('klemt haltes die buiten de pagina vallen', () => {
    const d = buildRoutePath(
      [
        { y: -400, side: 'left' },
        { y: 4000, side: 'right' },
      ],
      { height: 1000 }
    );
    expect(d).not.toContain('-');
    expect(d).not.toContain('4000');
  });
});
```

- [ ] **Step 5: Draai de test en controleer dat hij faalt**

Run: `npm test -- src/lib/buildRoutePath.test.js`
Verwacht: FAIL — `Failed to resolve import "./buildRoutePath.js"`

- [ ] **Step 6: Schrijf de implementatie**

Maak `src/lib/buildRoutePath.js`:

```js
// De routelijn wordt niet met de hand getekend: de pagina wordt langer zodra er
// deelnemers bijkomen. Elke sectie meldt zijn verticale positie en zijn kant, en
// deze functie legt daar één vloeiend pad doorheen.
//
// x-waarden staan in het viewBox-stelsel (0..100 breed), y in paginapixels. De
// SVG wordt niet-proportioneel opgerekt; de lijndikte blijft gelijk doordat de
// component `vector-effect="non-scaling-stroke"` zet.

export const LEFT_X = 28;
export const RIGHT_X = 72;

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
  if (!stops.length || height <= 0) return '';

  const middle = stops.map((stop) => ({
    x: stop.side === 'right' ? RIGHT_X : LEFT_X,
    y: clamp(stop.y, 0, height),
  }));

  const first = middle[0];
  const last = middle[middle.length - 1];

  if (middle.length === 1) {
    return `M ${first.x} 0 L ${first.x} ${round(height)}`;
  }

  // De lijn loopt door tot boven- en onderrand, zodat hij nergens los hangt.
  const points = [{ x: first.x, y: 0 }, ...middle, { x: last.x, y: height }];
  return curveThrough(points);
}
```

- [ ] **Step 7: Draai de tests en controleer dat ze slagen**

Run: `npm test -- src/lib/buildRoutePath.test.js`
Verwacht: PASS, 6 tests.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.js src/lib/buildRoutePath.js src/lib/buildRoutePath.test.js
git commit -m "feat: padbouwer voor de routelijn, met Vitest-opstelling"
```

---

### Task 2: De voortgangsberekening

**Files:**
- Create: `src/lib/routeProgress.js`
- Create: `src/lib/routeProgress.test.js`

**Interfaces:**
- Consumes: niets.
- Produces: `ARRIVAL_RATIO = 0.6`, `drawnFraction(scrollY, viewportHeight, documentHeight) -> number` (0..1) en `isStopReached(stopY, scrollY, viewportHeight) -> boolean`. Beide gebruiken dezelfde "aankomstlijn" op 60% van de viewporthoogte, zodat de punt van de lijn en het activeren van een halte op precies hetzelfde moment gebeuren.

- [ ] **Step 1: Schrijf de falende test**

Maak `src/lib/routeProgress.test.js`:

```js
import { describe, expect, it } from 'vitest';
import { ARRIVAL_RATIO, drawnFraction, isStopReached } from './routeProgress.js';

describe('drawnFraction', () => {
  it('is bovenaan de pagina al een stukje getekend', () => {
    // De punt van de lijn staat op 60% van het scherm, dus bij scrollpositie 0
    // is er al 600 / 4000 getekend.
    expect(drawnFraction(0, 1000, 4000)).toBeCloseTo(0.15);
  });

  it('is 1 als de punt de onderkant bereikt', () => {
    expect(drawnFraction(3400, 1000, 4000)).toBe(1);
  });

  it('klemt een negatieve scrollpositie (rubber-band op iOS)', () => {
    expect(drawnFraction(-800, 1000, 4000)).toBe(0);
  });

  it('is 1 als de pagina korter is dan het scherm', () => {
    expect(drawnFraction(0, 1000, 600)).toBe(1);
  });

  it('is 1 bij een documenthoogte van nul', () => {
    expect(drawnFraction(0, 1000, 0)).toBe(1);
  });
});

describe('isStopReached', () => {
  it('is bereikt zodra de halte boven de aankomstlijn staat', () => {
    expect(isStopReached(500, 0, 1000)).toBe(true);
  });

  it('is precies op de grens bereikt', () => {
    expect(isStopReached(1000 * ARRIVAL_RATIO, 0, 1000)).toBe(true);
  });

  it('is nog niet bereikt als de halte eronder staat', () => {
    expect(isStopReached(900, 0, 1000)).toBe(false);
  });
});
```

- [ ] **Step 2: Draai de test en controleer dat hij faalt**

Run: `npm test -- src/lib/routeProgress.test.js`
Verwacht: FAIL — `Failed to resolve import "./routeProgress.js"`

- [ ] **Step 3: Schrijf de implementatie**

Maak `src/lib/routeProgress.js`:

```js
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
```

- [ ] **Step 4: Draai de tests en controleer dat ze slagen**

Run: `npm test -- src/lib/routeProgress.test.js`
Verwacht: PASS, 8 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/routeProgress.js src/lib/routeProgress.test.js
git commit -m "feat: voortgangsberekening voor de routelijn"
```

---

### Task 3: Kleurtokens met een contrastbewaker

**Files:**
- Create: `src/theme/colors.js`
- Create: `src/lib/contrast.js`
- Create: `src/theme/colors.test.js`
- Modify: `tailwind.config.js`

**Interfaces:**
- Consumes: niets.
- Produces: `colors` (default export van `src/theme/colors.js`) met de sleutels `paper base panel line ink body muted brand brandInk`, en `contrastRatio(hexA, hexB) -> number` uit `src/lib/contrast.js`.

De test is hier geen formaliteit: de contrastregels uit de spec zijn de reden dat knoppen zwarte tekst krijgen. Zodra iemand later het oranje "even iets lichter" maakt, moet de test omvallen.

- [ ] **Step 1: Schrijf de falende test**

Maak `src/theme/colors.test.js`:

```js
import { describe, expect, it } from 'vitest';
import colors from './colors.js';
import { contrastRatio } from '../lib/contrast.js';

describe('contrastRatio', () => {
  it('is 21 voor zwart op wit', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
  });

  it('is 1 voor een kleur op zichzelf', () => {
    expect(contrastRatio('#E85812', '#E85812')).toBeCloseTo(1, 5);
  });
});

describe('kleurtokens', () => {
  it('gebruikt het oranje van Youth for Christ', () => {
    expect(colors.brand).toBe('#E85812');
  });

  it('laat asfaltzwarte tekst op oranje toe', () => {
    expect(contrastRatio(colors.ink, colors.brand)).toBeGreaterThanOrEqual(4.5);
  });

  it('verbiedt witte tekst op oranje', () => {
    // Deze staat er als vastlegging: wit op brand haalt de norm niet, en daarom
    // krijgen oranje knoppen zwarte tekst.
    expect(contrastRatio(colors.paper, colors.brand)).toBeLessThan(4.5);
  });

  it('laat wit op het diepe oranje wel toe', () => {
    expect(contrastRatio(colors.paper, colors.brandInk)).toBeGreaterThanOrEqual(4.5);
  });

  it('heeft leesbare lopende tekst op de achtergrond', () => {
    expect(contrastRatio(colors.body, colors.base)).toBeGreaterThanOrEqual(4.5);
  });

  it('heeft leesbare bijschriften op de achtergrond', () => {
    expect(contrastRatio(colors.muted, colors.base)).toBeGreaterThanOrEqual(4.5);
  });

  it('heeft kleine oranje tekst die de norm haalt', () => {
    expect(contrastRatio(colors.brandInk, colors.base)).toBeGreaterThanOrEqual(4.5);
  });
});
```

- [ ] **Step 2: Draai de test en controleer dat hij faalt**

Run: `npm test -- src/theme/colors.test.js`
Verwacht: FAIL — `Failed to resolve import "./colors.js"`

- [ ] **Step 3: Schrijf de contrastfunctie**

Maak `src/lib/contrast.js`:

```js
// Contrastverhouding volgens WCAG 2.1. Wordt gebruikt om de kleurtokens te
// bewaken, zodat een latere kleurwijziging niet stilletjes de toegankelijkheid
// sloopt.

function channel(value) {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(hexA, hexB) {
  const a = luminance(hexA);
  const b = luminance(hexB);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}
```

- [ ] **Step 4: Schrijf de kleurtokens**

Maak `src/theme/colors.js`:

```js
// De kleuren van de route: beton, asfalt en het oranje van Youth for Christ.
// Deze waarden zijn de bron; tailwind.config.js leest ze hieruit.
const colors = {
  paper: '#FFFFFF',
  base: '#FAFAF9',
  panel: '#EDEDEA',
  line: '#D6D5D1',
  ink: '#17181A',
  body: '#3A3937',
  muted: '#6E6B66',
  brand: '#E85812',
  brandInk: '#C2420E',
};

export default colors;
```

- [ ] **Step 5: Draai de tests en controleer dat ze slagen**

Run: `npm test -- src/theme/colors.test.js`
Verwacht: PASS, 9 tests.

- [ ] **Step 6: Koppel de tokens aan Tailwind**

Vervang de volledige inhoud van `tailwind.config.js`:

```js
import colors from './src/theme/colors.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '58ch',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 7: Controleer dat de build nog draait**

Run: `npx vite build`
Verwacht: `✓ built in …` zonder foutmeldingen. De site ziet er nu tijdelijk verkeerd uit — oude klassen als `bg-surface` bestaan niet meer. Dat repareren de volgende taken.

- [ ] **Step 8: Commit**

```bash
git add src/theme/colors.js src/theme/colors.test.js src/lib/contrast.js tailwind.config.js
git commit -m "feat: kleurtokens met contrastbewaking"
```

---

### Task 4: Letters en basisstijlen

**Files:**
- Modify: `index.html`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: de tokens uit Task 3.
- Produces: de hulpklassen `.u-wide` (breedte-as 125) en `.u-narrow` (breedte-as 85) voor Bricolage Grotesque.

- [ ] **Step 1: Wissel de letters in `index.html`**

Vervang de `<link rel="stylesheet">` naar Google Fonts door:

```html
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&display=swap"
    />
```

- [ ] **Step 2: Herschrijf `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-base text-body font-sans antialiased;
}

h1, h2, h3, h4 {
  @apply text-ink;
}

/* Bricolage Grotesque is variabel op breedte en optische grootte. Koppen staan
   breed, labels smal; dat is wat hiërarchie geeft nu de kaders weg zijn. */
.u-wide {
  font-variation-settings: 'wdth' 100, 'opsz' 96;
}

.u-narrow {
  font-variation-settings: 'wdth' 85, 'opsz' 14;
}

/* Verborgen radio bij de afstandskeuze; het label ernaast is de knop. */
.pill-input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}

:focus-visible {
  outline: 2px solid #17181A;
  outline-offset: 3px;
}

.on-dark :focus-visible {
  outline-color: #ffffff;
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Controleer de build**

Run: `npx vite build`
Verwacht: `✓ built in …`

- [ ] **Step 4: Commit**

```bash
git add index.html src/index.css
git commit -m "feat: Bricolage Grotesque als enige letterfamilie"
```

---

### Task 5: Het YFC-logo als component

**Files:**
- Create: `src/assets/yfc-logo.svg`
- Create: `src/components/YfcLogo.jsx`
- Create: `src/components/YfcLogo.test.jsx`

**Interfaces:**
- Consumes: niets.
- Produces: `<YfcLogo variant="mark" | "full" className="" title="" />`. `mark` toont alleen het oranje vierkant (viewBox `0 0 167.239 141.732`), `full` de volledige lockup inclusief de Veenendaal-balk (viewBox `0 0 167.239 189.681`).

- [ ] **Step 1: Haal het officiële logo op**

```bash
curl -sL "https://veenendaal.yfc.nl/wp-content/uploads/sites/9/2020/01/YouthForChrist_Veenendaal-Logo-Oranje-DIAP.svg" -o src/assets/yfc-logo.svg
test -s src/assets/yfc-logo.svg && head -c 120 src/assets/yfc-logo.svg
```

Verwacht: het bestand bestaat en begint met `<?xml version="1.0" encoding="UTF-8"?>`.

- [ ] **Step 2: Schrijf de falende test**

Maak `src/components/YfcLogo.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import YfcLogo from './YfcLogo.jsx';

describe('YfcLogo', () => {
  it('toont standaard alleen het vierkant', () => {
    const { container } = render(<YfcLogo />);
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 167.239 141.732');
  });

  it('toont de volledige lockup als daarom gevraagd wordt', () => {
    const { container } = render(<YfcLogo variant="full" />);
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 167.239 189.681');
  });

  it('heeft een toegankelijke naam', () => {
    render(<YfcLogo title="Youth for Christ Veenendaal" />);
    expect(screen.getByRole('img', { name: 'Youth for Christ Veenendaal' })).toBeInTheDocument();
  });

  it('is verborgen voor schermlezers zonder titel', () => {
    const { container } = render(<YfcLogo />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
```

Voeg bovenaan `vitest.config.js` een setupbestand toe zodat `toBeInTheDocument` bestaat:

```js
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
  },
});
```

Maak `vitest.setup.js`:

```js
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 3: Draai de test en controleer dat hij faalt**

Run: `npm test -- src/components/YfcLogo.test.jsx`
Verwacht: FAIL — `Failed to resolve import "./YfcLogo.jsx"`

- [ ] **Step 4: Schrijf de component**

Genereer `src/components/YfcLogo.jsx` uit het gedownloade bestand, zodat de paden
letterlijk overkomen en er niets met de hand wordt overgetypt:

```bash
python3 - <<'GEN'
import re
svg = open('src/assets/yfc-logo.svg').read()
# Alleen de tekenende elementen; de <svg>-huls maken we zelf.
shapes = re.findall(r'<(rect|path|polygon|polyline|circle)\b[^>]*?/?>', svg)
jsx = []
for tag in shapes:
    tag = tag.replace('class=', 'className=').replace('xml:space="preserve"', '')
    tag = re.sub(r'\s*/?>$', ' />', tag)
    jsx.append('      ' + tag)
body = '\n'.join(jsx)
component = open('src/components/YfcLogo.template.jsx').read()
open('src/components/YfcLogo.jsx', 'w').write(component.replace('{/* SHAPES */}', body))
GEN
```

Zet daarvoor eerst het sjabloon neer als `src/components/YfcLogo.template.jsx`
(verwijder dat bestand na het genereren):

```jsx
// Het officiële logo van Youth for Christ Veenendaal, inline gezet zodat het geen
// extra netwerkverzoek kost en op elk formaat scherp blijft. De bron is het
// bestand in src/assets/yfc-logo.svg; kleuren en paden zijn ongewijzigd
// overgenomen — dit is hun merk, niet het onze.
//
// De lockup is 167.239 × 189.681: bovenin het oranje vierkant met "YOUTH FOR
// CHRIST" (tot y = 141.732), daaronder de balk met "Veenendaal". In de navbar
// gebruiken we alleen het vierkant, omdat die balk daar onleesbaar klein wordt.

const MARK_VIEWBOX = '0 0 167.239 141.732';
const FULL_VIEWBOX = '0 0 167.239 189.681';

export default function YfcLogo({ variant = 'mark', className = '', title }) {
  return (
    <svg
      className={className}
      viewBox={variant === 'full' ? FULL_VIEWBOX : MARK_VIEWBOX}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title && <title>{title}</title>}
      {/* SHAPES */}
    </svg>
  );
}
```

Ruim daarna op en controleer het resultaat:

```bash
rm src/components/YfcLogo.template.jsx
grep -c "path" src/components/YfcLogo.jsx
```

Verwacht: een getal groter dan 30 — dat zijn de letterpaden. Is het 0, dan is het
SVG-bestand niet goed gedownload.

- [ ] **Step 5: Draai de tests en controleer dat ze slagen**

Run: `npm test -- src/components/YfcLogo.test.jsx`
Verwacht: PASS, 4 tests.

- [ ] **Step 6: Controleer het logo op beide achtergronden**

```bash
npx vite build && npx vite preview --port 5180 &
sleep 3
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --window-size=900,600 --virtual-time-budget=8000 --screenshot=/tmp/yfc-check.png "http://localhost:5180/"
```

Bekijk `/tmp/yfc-check.png`: het vierkant moet oranje zijn met witte letters, en op zowel de lichte achtergrond als in de donkere footer leesbaar.

- [ ] **Step 7: Commit**

```bash
git add src/assets/yfc-logo.svg src/components/YfcLogo.jsx src/components/YfcLogo.test.jsx vitest.config.js vitest.setup.js
git commit -m "feat: YFC-logo als inline SVG-component"
```

---

### Task 6: De routelijn

**Files:**
- Create: `src/hooks/useRouteLine.js`
- Create: `src/hooks/useRouteLine.test.jsx`
- Create: `src/components/route/RouteLine.jsx`
- Modify: `src/pages/Home.jsx` (de lijn in de pagina hangen)

**Interfaces:**
- Consumes: `buildRoutePath`, `drawnFraction`, `isStopReached`.
- Produces: `useRouteLine({ pathRef, dotRef, containerRef }) -> void` en `<RouteLine />`. Secties melden zich met `data-route-stop` en `data-route-side="left" | "right"` op een element; de hook zoekt die elementen zelf op en zet er `data-route-reached="true"` op zodra ze bereikt zijn.

- [ ] **Step 1: Schrijf de falende test**

Maak `src/hooks/useRouteLine.test.jsx`:

```jsx
import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRef } from 'react';
import { useRouteLine } from './useRouteLine.js';

function Harness() {
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const containerRef = useRef(null);
  useRouteLine({ pathRef, dotRef, containerRef });
  return (
    <div ref={containerRef}>
      <svg>
        <path ref={pathRef} />
      </svg>
      <span ref={dotRef} />
      <section data-route-stop data-route-side="left">een</section>
    </div>
  );
}

function mockMatchMedia(reduced) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: reduced,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
}

beforeEach(() => {
  // jsdom kent deze SVG-methodes niet; de hook mag er niet op stukvallen.
  SVGPathElement.prototype.getTotalLength = vi.fn().mockReturnValue(1000);
  SVGPathElement.prototype.getPointAtLength = vi.fn().mockReturnValue({ x: 10, y: 20 });
  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    disconnect: vi.fn(),
  }));
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useRouteLine', () => {
  it('tekent de lijn meteen volledig bij reduce motion', () => {
    mockMatchMedia(true);
    const { container } = render(<Harness />);
    expect(container.querySelector('path').style.strokeDashoffset).toBe('0');
  });

  it('activeert alle haltes bij reduce motion', () => {
    mockMatchMedia(true);
    const { container } = render(<Harness />);
    expect(container.querySelector('[data-route-stop]')).toHaveAttribute(
      'data-route-reached',
      'true'
    );
  });

  it('luistert passief naar scroll als beweging is toegestaan', () => {
    mockMatchMedia(false);
    const spy = vi.spyOn(window, 'addEventListener');
    render(<Harness />);
    const scrollCall = spy.mock.calls.find(([event]) => event === 'scroll');
    expect(scrollCall?.[2]).toEqual({ passive: true });
  });

  it('ruimt de scroll-listener op bij unmount', () => {
    mockMatchMedia(false);
    const spy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<Harness />);
    unmount();
    expect(spy.mock.calls.some(([event]) => event === 'scroll')).toBe(true);
  });
});
```

- [ ] **Step 2: Draai de test en controleer dat hij faalt**

Run: `npm test -- src/hooks/useRouteLine.test.jsx`
Verwacht: FAIL — `Failed to resolve import "./useRouteLine.js"`

- [ ] **Step 3: Schrijf de hook**

Maak `src/hooks/useRouteLine.js`:

```js
import { useEffect } from 'react';
import { buildRoutePath } from '../lib/buildRoutePath.js';
import { drawnFraction, isStopReached } from '../lib/routeProgress.js';

// De lijn wordt per frame bijgewerkt. Daarom schrijft deze hook rechtstreeks naar
// de DOM en nooit naar React-state: state zou de hele pagina elke frame opnieuw
// laten renderen. In de animatielus wordt niets gemeten — alle maten staan in de
// cache hieronder en worden alleen bij resize opnieuw gevuld.
export function useRouteLine({ pathRef, dotRef, containerRef }) {
  useEffect(() => {
    const path = pathRef.current;
    const dot = dotRef.current;
    const container = containerRef.current;
    if (!path || !container) return undefined;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let cache = { length: 0, height: 0, stops: [] };
    let frame = 0;
    let dirty = true;

    function measure() {
      const stopElements = Array.from(container.querySelectorAll('[data-route-stop]'));
      const height = container.scrollHeight;

      const stops = stopElements.map((element) => ({
        element,
        y: element.getBoundingClientRect().top + window.scrollY,
        side: element.dataset.routeSide === 'right' ? 'right' : 'left',
      }));

      // De viewBox is 100 breed (relatief) en zo hoog als de pagina, zodat de
      // padbouwer gewoon in paginapixels kan rekenen.
      path.ownerSVGElement?.setAttribute('viewBox', `0 0 100 ${height}`);
      path.setAttribute('d', buildRoutePath(stops, { height }));
      const length = path.getTotalLength();
      path.style.strokeDasharray = String(length);

      cache = { length, height, stops };
    }

    function paint() {
      const fraction = drawnFraction(window.scrollY, window.innerHeight, cache.height);
      path.style.strokeDashoffset = String(cache.length * (1 - fraction));

      if (dot) {
        const point = path.getPointAtLength(cache.length * fraction);
        dot.style.transform = `translate(${point.x}px, ${point.y}px)`;
      }

      for (const stop of cache.stops) {
        const reached = isStopReached(stop.y, window.scrollY, window.innerHeight);
        stop.element.dataset.routeReached = reached ? 'true' : 'false';
      }
    }

    function paintStatic() {
      path.style.strokeDashoffset = '0';
      if (dot) dot.style.display = 'none';
      for (const stop of cache.stops) {
        stop.element.dataset.routeReached = 'true';
      }
    }

    function loop() {
      frame = window.requestAnimationFrame(loop);
      if (!dirty) return;
      dirty = false;
      paint();
    }

    function onScroll() {
      dirty = true;
    }

    function start() {
      measure();
      if (motion.matches) {
        paintStatic();
        return;
      }
      paint();
      window.addEventListener('scroll', onScroll, { passive: true });
      frame = window.requestAnimationFrame(loop);
    }

    function stop() {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    }

    function restart() {
      stop();
      start();
    }

    start();

    const observer = new ResizeObserver(() => {
      dirty = true;
      measure();
      if (motion.matches) paintStatic();
    });
    observer.observe(container);
    motion.addEventListener('change', restart);

    return () => {
      stop();
      observer.disconnect();
      motion.removeEventListener('change', restart);
    };
  }, [pathRef, dotRef, containerRef]);
}
```

- [ ] **Step 4: Draai de tests en controleer dat ze slagen**

Run: `npm test -- src/hooks/useRouteLine.test.jsx`
Verwacht: PASS, 4 tests.

- [ ] **Step 5: Schrijf de component**

Maak `src/components/route/RouteLine.jsx`:

```jsx
import { useRef } from 'react';
import { useRouteLine } from '../../hooks/useRouteLine.js';

// De lijn ligt achter de inhoud, over de volle paginahoogte. Hij is decoratie:
// de betekenis zit in de tekstvolgorde, dus hij is volledig verborgen voor
// schermlezers. preserveAspectRatio="none" rekt de viewBox op; de lijndikte
// blijft gelijk dankzij vector-effect.
export default function RouteLine({ containerRef }) {
  const pathRef = useRef(null);
  const dotRef = useRef(null);

  useRouteLine({ pathRef, dotRef, containerRef });

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <svg
        className="h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={pathRef}
          fill="none"
          stroke="#E85812"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span
        ref={dotRef}
        className="absolute left-0 top-0 -ml-[7px] -mt-[7px] block h-3.5 w-3.5 rounded-full bg-brand"
      />
    </div>
  );
}
```

De `viewBox="0 0 100 100"` hierboven is alleen de beginwaarde: `useRouteLine.measure()`
overschrijft hem met de werkelijke paginahoogte.

- [ ] **Step 6: Hang de lijn in de pagina**

In `src/pages/Home.jsx`: geef de buitenste `<div>` een ref en zet de lijn erin.

```jsx
import { useRef, useState } from 'react';
import RouteLine from '../components/route/RouteLine.jsx';
// … overige imports blijven staan

export default function Home() {
  const { settings } = useCampaignSettings();
  const [distance, setDistance] = useState('7 km');
  const pageRef = useRef(null);

  return (
    <div ref={pageRef} className="relative flex min-h-screen flex-col">
      <RouteLine containerRef={pageRef} />
      {/* … de bestaande secties blijven hier staan */}
    </div>
  );
}
```

- [ ] **Step 7: Controleer in de browser**

```bash
npx vite build && npx vite preview --port 5180 &
sleep 3
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --window-size=1440,6000 --virtual-time-budget=9000 --screenshot=/tmp/routeline.png "http://localhost:5180/"
```

Verwacht: een oranje lijn die van boven naar beneden door de pagina loopt. Haltes zijn er nog niet — die komen in de volgende taken; met nul haltes tekent `buildRoutePath` niets, dus als de lijn nog ontbreekt is dat op dit punt correct. Voeg tijdelijk `data-route-stop data-route-side="left"` toe aan twee bestaande secties om te controleren dat de kromme verschijnt, en haal dat daarna weer weg.

- [ ] **Step 8: Meet de prestaties**

Open de pagina in Chrome DevTools → Performance, zet CPU-throttling op 6×, neem tien seconden scrollen op.
Verwacht: geen frames boven de 16ms in de `requestAnimationFrame`-lus, en geen "Forced reflow"-waarschuwingen.
Lukt dat niet: stop hier en meld het. De terugvaloptie uit de spec (statische lijn met haltes) is dan aan de orde.

- [ ] **Step 9: Commit**

```bash
git add src/hooks/useRouteLine.js src/hooks/useRouteLine.test.jsx src/components/route/RouteLine.jsx src/pages/Home.jsx
git commit -m "feat: routelijn die met de scroll wordt getekend"
```

---

### Task 7: Sectie-omhulsel met halte

**Files:**
- Create: `src/components/route/RouteSectionShell.jsx`
- Create: `src/components/route/RouteSectionShell.test.jsx`
- Delete: `src/components/Section.jsx` (pas in Task 12, als geen enkele sectie hem meer gebruikt)

**Interfaces:**
- Consumes: niets (alleen DOM-attributen die `useRouteLine` leest).
- Produces: `<RouteSectionShell id label side="left" | "right" tone="base" | "panel" | "finish">`. Zet `data-route-stop` en `data-route-side` op het buitenste element en toont het label bij de halte.

- [ ] **Step 1: Schrijf de falende test**

Maak `src/components/route/RouteSectionShell.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import RouteSectionShell from './RouteSectionShell.jsx';

describe('RouteSectionShell', () => {
  it('meldt zich als halte bij de routelijn', () => {
    const { container } = render(
      <RouteSectionShell id="waarom" label="Waarom">inhoud</RouteSectionShell>
    );
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('data-route-stop');
    expect(section).toHaveAttribute('data-route-side', 'left');
  });

  it('kan aan de rechterkant hangen', () => {
    const { container } = render(
      <RouteSectionShell id="route" label="Route" side="right">inhoud</RouteSectionShell>
    );
    expect(container.querySelector('section')).toHaveAttribute('data-route-side', 'right');
  });

  it('toont het label en de inhoud', () => {
    render(<RouteSectionShell id="waarom" label="Waarom">de inhoud</RouteSectionShell>);
    expect(screen.getByText('Waarom')).toBeInTheDocument();
    expect(screen.getByText('de inhoud')).toBeInTheDocument();
  });

  it('is te vinden via zijn id', () => {
    const { container } = render(
      <RouteSectionShell id="waarom" label="Waarom">inhoud</RouteSectionShell>
    );
    expect(container.querySelector('#waarom')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Draai de test en controleer dat hij faalt**

Run: `npm test -- src/components/route/RouteSectionShell.test.jsx`
Verwacht: FAIL — `Failed to resolve import "./RouteSectionShell.jsx"`

- [ ] **Step 3: Schrijf de component**

Maak `src/components/route/RouteSectionShell.jsx`:

```jsx
// Elke sectie is een halte aan de route. Geen kaders en geen raster meer: de
// sectie kiest een kant en krijgt daar zijn label, de rest is witruimte.
// `data-route-reached` wordt door useRouteLine gezet zodra de lijn hier is.

const TONE = {
  base: 'bg-base',
  panel: 'bg-panel',
  finish: 'bg-ink text-white/80 on-dark',
};

export default function RouteSectionShell({
  id,
  label,
  side = 'left',
  tone = 'base',
  children,
}) {
  const right = side === 'right';

  return (
    <section
      id={id}
      data-route-stop
      data-route-side={side}
      className={`group relative ${TONE[tone]}`}
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 py-20 md:px-10 md:py-28 lg:py-32">
        <p
          className={`u-narrow mb-8 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-500 ${
            tone === 'finish' ? 'text-white/50' : 'text-muted'
          } group-data-[route-reached=true]:text-brandInk ${right ? 'md:text-right' : ''}`}
        >
          {label}
        </p>
        <div className={right ? 'md:ml-auto md:max-w-[62%]' : 'md:max-w-[62%]'}>{children}</div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Draai de tests en controleer dat ze slagen**

Run: `npm test -- src/components/route/RouteSectionShell.test.jsx`
Verwacht: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/route/RouteSectionShell.jsx src/components/route/RouteSectionShell.test.jsx
git commit -m "feat: sectie-omhulsel dat zich als halte meldt"
```

---

### Task 8: Navbar met YFC-vermelding

**Files:**
- Modify: `src/components/Header.jsx`
- Create: `src/components/Header.test.jsx`

**Interfaces:**
- Consumes: `YfcLogo`.
- Produces: niets voor andere taken.

- [ ] **Step 1: Schrijf de falende test**

Maak `src/components/Header.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Header from './Header.jsx';

describe('Header', () => {
  it('toont de naam van het evenement', () => {
    render(<Header />);
    expect(screen.getByText('The Mall Run')).toBeInTheDocument();
  });

  it('vermeldt wie het organiseert, met een link naar YFC', () => {
    render(<Header />);
    const link = screen.getByRole('link', { name: /Youth for Christ Veenendaal/i });
    expect(link).toHaveAttribute('href', 'https://veenendaal.yfc.nl/');
  });

  it('opent de YFC-link in een nieuw tabblad zonder referrer-lek', () => {
    render(<Header />);
    const link = screen.getByRole('link', { name: /Youth for Christ Veenendaal/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });
});
```

- [ ] **Step 2: Draai de test en controleer dat hij faalt**

Run: `npm test -- src/components/Header.test.jsx`
Verwacht: FAIL — de tekst "The Mall Run" staat er nog als "MALL RUN", en de YFC-link ontbreekt.

- [ ] **Step 3: Herschrijf de component**

Vervang de volledige inhoud van `src/components/Header.jsx`:

```jsx
import YfcLogo from './YfcLogo.jsx';

export default function Header() {
  const link = 'u-narrow text-[15px] font-medium text-body hover:text-brandInk';

  return (
    <header className="sticky top-0 z-50 bg-base/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6 px-6 py-4 md:px-10">
        <div className="flex items-center gap-4">
          <a href="#top" className="u-wide text-[19px] font-extrabold text-ink">
            The Mall Run
          </a>
          <span className="hidden h-6 w-px bg-line sm:block" />
          <a
            href="https://veenendaal.yfc.nl/"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2.5 sm:flex"
          >
            <span className="u-narrow text-[12px] leading-tight text-muted">
              een initiatief van
            </span>
            <YfcLogo className="h-7 w-auto" title="Youth for Christ Veenendaal" />
          </a>
        </div>

        <nav className="flex items-center gap-7">
          <a href="#waarom" className={`hidden sm:inline ${link}`}>Waarom</a>
          <a href="#deelnemers" className={`hidden sm:inline ${link}`}>Deelnemers</a>
          <a href="#route" className={`hidden sm:inline ${link}`}>Route</a>
          <a
            href="#inschrijven"
            className="u-narrow rounded-full bg-brand px-5 py-2.5 text-[14px] font-bold text-ink hover:bg-brandInk hover:text-paper"
          >
            Inschrijven
          </a>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Draai de tests en controleer dat ze slagen**

Run: `npm test -- src/components/Header.test.jsx`
Verwacht: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.jsx src/components/Header.test.jsx
git commit -m "feat: navbar met YFC-logo en organisatievermelding"
```

---

### Task 9: De kop van de pagina

**Files:**
- Modify: `src/components/Hero.jsx`

**Interfaces:**
- Consumes: niets.
- Produces: niets voor andere taken.

- [ ] **Step 1: Herschrijf de component**

Vervang de volledige inhoud van `src/components/Hero.jsx`:

```jsx
const LAPS = [
  { km: '7', rondes: 'één ronde' },
  { km: '14', rondes: 'twee rondes' },
  { km: '21,1', rondes: 'drie rondes' },
];

export default function Hero() {
  return (
    <section id="top" className="bg-base">
      <div className="mx-auto w-full max-w-[1200px] px-6 pb-24 pt-16 md:px-10 md:pb-32 md:pt-24">
        <p className="u-narrow text-[15px] font-semibold text-brandInk">
          Zaterdag 14 november 2026 · Veenendaal
        </p>

        <h1 className="u-wide mt-6 text-[clamp(48px,11vw,168px)] font-extrabold leading-[0.86] tracking-[-0.02em] text-ink">
          The Mall
          <br />
          Run 2026
        </h1>

        <p className="mt-10 max-w-prose text-[19px] leading-[1.6] text-body md:text-[21px]">
          Eén ronde door Veenendaal is zeven kilometer. Loop er één, twee of drie en haal met
          elke kilometer geld op voor jongerencentrum The Mall.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#inschrijven"
            className="u-narrow rounded-full bg-brand px-8 py-4 text-[15px] font-bold text-ink hover:bg-brandInk hover:text-paper"
          >
            Schrijf je in
          </a>
          <a
            href="#waarom"
            className="u-narrow rounded-full px-8 py-4 text-[15px] font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] hover:decoration-brand"
          >
            Waarom we rennen
          </a>
        </div>

        <dl className="mt-16 flex flex-wrap gap-x-12 gap-y-6">
          {LAPS.map((l) => (
            <div key={l.km}>
              <dt className="u-wide text-[clamp(40px,5vw,64px)] font-extrabold leading-none text-ink">
                {l.km}
                <span className="u-narrow ml-1.5 text-[14px] font-medium text-muted">km</span>
              </dt>
              <dd className="u-narrow mt-1 text-[14px] text-muted">{l.rondes}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Controleer de build**

Run: `npx vite build`
Verwacht: `✓ built in …`

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.jsx
git commit -m "feat: nieuwe kop zonder kaders"
```

---

### Task 10: De teller als capsule

**Files:**
- Modify: `src/components/ProgressBar.jsx`
- Create: `src/components/ProgressBar.test.jsx`

**Interfaces:**
- Consumes: niets.
- Produces: `<ProgressBar raised goal stretch size="lg" | "sm" />` (ongewijzigde props).

De balk van de teller moet duidelijk begrensd blijven: hij mag niet op de routelijn lijken, want die toont de scrollpositie en niet het opgehaalde bedrag.

- [ ] **Step 1: Schrijf de falende test**

Maak `src/components/ProgressBar.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProgressBar from './ProgressBar.jsx';

describe('ProgressBar', () => {
  it('leest bedrag, doel en percentage voor aan schermlezers', () => {
    render(<ProgressBar raised={4200} goal={10000} />);
    expect(
      screen.getByRole('img', { name: '€4.200 opgehaald van €10.000, 42 procent' })
    ).toBeInTheDocument();
  });

  it('gaat niet over de honderd procent heen', () => {
    render(<ProgressBar raised={99999} goal={10000} />);
    expect(screen.getByText('100% van het doel')).toBeInTheDocument();
  });

  it('valt terug op nul procent bij een doel van nul', () => {
    render(<ProgressBar raised={500} goal={0} />);
    expect(screen.getByText('0% van het doel')).toBeInTheDocument();
  });

  it('toont het stretchdoel alleen als het meegegeven is', () => {
    const { rerender } = render(<ProgressBar raised={100} goal={1000} />);
    expect(screen.queryByText(/Lukt het/)).not.toBeInTheDocument();
    rerender(<ProgressBar raised={100} goal={1000} stretch={2000} />);
    expect(screen.getByText(/Lukt het/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Draai de test en controleer dat hij faalt**

Run: `npm test -- src/components/ProgressBar.test.jsx`
Verwacht: FAIL op de eerste test — het huidige label heeft een andere volgorde.

- [ ] **Step 3: Herschrijf de component**

Vervang de volledige inhoud van `src/components/ProgressBar.jsx`:

```jsx
const TICKS = [25, 50, 75];

function euro(n) {
  return '€' + Number(n || 0).toLocaleString('nl-NL');
}

// De teller zit in een capsule op de routelijn. De balk heeft een eigen, duidelijk
// begrensde vorm: de routelijn toont waar je bent op de pagina, deze balk toont
// wat er is opgehaald. Die twee mogen niet op elkaar lijken.
export default function ProgressBar({ raised, goal, stretch, size = 'lg' }) {
  const pct = goal > 0 ? Math.max(0, Math.min(100, (raised / goal) * 100)) : 0;
  const big = size === 'lg';

  return (
    <div className={`rounded-[28px] bg-panel ${big ? 'p-8 md:p-10' : 'p-6'}`}>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span
          className={`u-wide font-extrabold leading-none text-ink ${
            big ? 'text-[clamp(40px,6vw,76px)]' : 'text-[32px]'
          }`}
        >
          {euro(raised)}
        </span>
        <span className="text-[16px] text-muted">opgehaald van {euro(goal)}</span>
      </div>

      <div
        className={`relative mt-6 overflow-hidden rounded-full bg-line ${big ? 'h-4' : 'h-2.5'}`}
        role="img"
        aria-label={`${euro(raised)} opgehaald van ${euro(goal)}, ${Math.round(pct)} procent`}
      >
        <div
          className="relative h-full rounded-full bg-brand transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        >
          {TICKS.filter((t) => t < pct).map((t) => (
            <span
              key={t}
              className="absolute top-0 h-full w-px bg-white/45"
              style={{ left: `${(t / pct) * 100}%` }}
            />
          ))}
        </div>
        {TICKS.filter((t) => t >= pct).map((t) => (
          <span
            key={t}
            className="absolute top-0 h-full w-px bg-ink/15"
            style={{ left: `${t}%` }}
          />
        ))}
      </div>

      <div className="u-narrow mt-3 flex flex-wrap justify-between gap-2 text-[13px] text-muted">
        <span>{Math.round(pct)}% van het doel</span>
        {stretch != null && <span>Lukt het? Dan gaan we door naar {euro(stretch)}</span>}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Draai de tests en controleer dat ze slagen**

Run: `npm test -- src/components/ProgressBar.test.jsx`
Verwacht: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/ProgressBar.jsx src/components/ProgressBar.test.jsx
git commit -m "feat: teller als capsule met eigen balk"
```

---

### Task 11: Afstanden als haltes

**Files:**
- Modify: `src/components/Distances.jsx`

**Interfaces:**
- Consumes: `RouteSectionShell`.
- Produces: `<Distances onChoose={(afstand: string) => void} />` (ongewijzigd).

- [ ] **Step 1: Herschrijf de component**

Vervang de volledige inhoud van `src/components/Distances.jsx`:

```jsx
import RouteSectionShell from './route/RouteSectionShell.jsx';

const DISTANCES = [
  {
    km: '7',
    rondes: 'Eén ronde',
    desc: "Goed te doen met vrienden, familie of collega's. Ook als je pas net bent begonnen met hardlopen.",
  },
  {
    km: '14',
    rondes: 'Twee rondes',
    desc: 'De middenafstand. Genoeg uitdaging om voor te trainen, kort genoeg om vol te houden.',
  },
  {
    km: '21,1',
    rondes: 'Drie rondes',
    desc: 'De halve marathon. Dezelfde route, drie keer, tot het laatste stuk langs The Mall.',
  },
];

export default function Distances({ onChoose }) {
  return (
    <RouteSectionShell id="afstanden" label="Afstanden" side="right">
      <h2 className="u-wide text-[clamp(30px,5vw,52px)] font-extrabold leading-[0.95] text-ink">
        Eén ronde is zeven kilometer
      </h2>
      <p className="mt-6 max-w-prose text-[17px] leading-[1.6]">
        Hoe ver je gaat bepaal je zelf. De route is voor iedereen hetzelfde; je loopt hem één,
        twee of drie keer.
      </p>

      <ol className="mt-14 space-y-12">
        {DISTANCES.map((d) => (
          <li key={d.km}>
            <div className="flex items-baseline gap-4">
              <span className="u-wide text-[clamp(52px,7vw,96px)] font-extrabold leading-[0.85] text-brand">
                {d.km}
              </span>
              <span className="u-narrow text-[15px] text-muted">km · {d.rondes.toLowerCase()}</span>
            </div>
            <p className="mt-3 max-w-prose text-[17px] leading-[1.6]">{d.desc}</p>
            <a
              href="#inschrijven"
              onClick={() => onChoose(`${d.km} km`)}
              className="u-narrow mt-4 inline-block rounded-full bg-panel px-5 py-2.5 text-[14px] font-semibold text-ink hover:bg-brand"
            >
              Kies {d.km} km
            </a>
          </li>
        ))}
      </ol>
    </RouteSectionShell>
  );
}
```

- [ ] **Step 2: Controleer de build**

Run: `npx vite build`
Verwacht: `✓ built in …`

- [ ] **Step 3: Commit**

```bash
git add src/components/Distances.jsx
git commit -m "feat: afstanden als haltes aan de route"
```

---

### Task 12: De overige secties omzetten

**Files:**
- Modify: `src/components/Mission.jsx`, `src/components/VideoSection.jsx`, `src/components/RouteSection.jsx`, `src/components/InstagramCTA.jsx`
- Delete: `src/components/Section.jsx`

**Interfaces:**
- Consumes: `RouteSectionShell`, `YfcLogo`.
- Produces: niets voor andere taken.

- [ ] **Step 1: Herschrijf `Mission.jsx` — hier staat de organisator voluit**

```jsx
import RouteSectionShell from './route/RouteSectionShell.jsx';

export default function Mission() {
  return (
    <RouteSectionShell id="waarom" label="Waarom" tone="panel">
      <h2 className="u-wide text-[clamp(30px,5vw,52px)] font-extrabold leading-[0.95] text-ink">
        The Mall is er voor jongeren in Veenendaal
      </h2>

      <div className="mt-8 max-w-prose space-y-6 text-[18px] leading-[1.7]">
        <p>
          Een plek waar jongeren gezien worden, zichzelf kunnen zijn, anderen ontmoeten en kunnen
          groeien. Maar jongerenwerk is niet vanzelfsprekend: we ontvangen geen subsidie van de
          gemeente en draaien op donateurs en mensen die geloven in wat we doen.
        </p>
        <p>
          Onze droom is dat The Mall een plek blijft — en steeds meer wordt — waar jongeren in
          Veenendaal zich gezien, gehoord en geliefd weten.
        </p>
        <p>
          The Mall Run wordt georganiseerd door{' '}
          <a
            href="https://veenendaal.yfc.nl/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-brandInk underline decoration-2 underline-offset-[5px]"
          >
            Youth for Christ Veenendaal
          </a>
          , de organisatie achter het jongerencentrum.
        </p>
      </div>

      <p className="u-wide mt-12 max-w-prose text-[21px] font-bold leading-[1.25] text-ink md:text-[27px]">
        Op 14 november komen we in beweging. Niet alleen voor de sport, maar om geld op te halen
        én The Mall zichtbaar te maken in Veenendaal.
      </p>
      <p className="u-narrow mt-4 text-[14px] text-muted">Het team van The Mall Run</p>
    </RouteSectionShell>
  );
}
```

- [ ] **Step 2: Herschrijf `VideoSection.jsx`**

```jsx
import RouteSectionShell from './route/RouteSectionShell.jsx';

export default function VideoSection() {
  return (
    <RouteSectionShell id="filmpje" label="In beeld" side="right">
      <h2 className="u-wide text-[clamp(26px,4vw,40px)] font-extrabold leading-[0.95] text-ink">
        Ons verhaal in beeld
      </h2>
      <p className="mt-5 max-w-prose text-[17px] leading-[1.6]">
        We filmen dit najaar in The Mall, met de jongeren zelf. Zodra het klaar is staat het hier.
      </p>
      <div className="mt-8 flex aspect-video items-center justify-center rounded-[28px] bg-panel">
        <div className="flex items-center gap-3">
          <svg width="15" height="17" viewBox="0 0 24 24" fill="#E85812" aria-hidden="true">
            <path d="M6 4v16l14-8z" />
          </svg>
          <span className="u-narrow text-[14px] font-semibold text-muted">Filmpje volgt</span>
        </div>
      </div>
    </RouteSectionShell>
  );
}
```

- [ ] **Step 3: Herschrijf `RouteSection.jsx`**

```jsx
import RouteSectionShell from './route/RouteSectionShell.jsx';

const LAPS = [
  ['7 km', 'één ronde'],
  ['14 km', 'twee rondes'],
  ['21,1 km', 'drie rondes'],
];

export default function RouteSection() {
  return (
    <RouteSectionShell id="route" label="De route">
      <h2 className="u-wide text-[clamp(26px,4vw,40px)] font-extrabold leading-[0.95] text-ink">
        Eén rondje Veenendaal
      </h2>
      <p className="mt-5 max-w-prose text-[17px] leading-[1.6]">
        De ronde is zeven kilometer lang en loopt door de stad, langs The Mall. Het exacte
        parcours en de starttijden maken we later dit jaar bekend.
      </p>

      <div className="mt-8 flex aspect-[16/10] items-center justify-center rounded-[28px] bg-panel">
        <span className="u-narrow text-[14px] font-semibold text-muted">Routekaart volgt</span>
      </div>

      <dl className="mt-8 max-w-sm">
        {LAPS.map(([km, rondes]) => (
          <div key={km} className="flex items-baseline justify-between py-3">
            <dt className="u-narrow text-[17px] font-bold text-ink">{km}</dt>
            <dd className="text-[15px] text-muted">{rondes}</dd>
          </div>
        ))}
      </dl>
    </RouteSectionShell>
  );
}
```

- [ ] **Step 4: Herschrijf `InstagramCTA.jsx`**

```jsx
import RouteSectionShell from './route/RouteSectionShell.jsx';

export default function InstagramCTA() {
  return (
    <RouteSectionShell id="instagram" label="Volgen" side="right">
      <h2 className="u-wide text-[clamp(22px,3vw,32px)] font-extrabold leading-[1] text-ink">
        Updates komen op Instagram
      </h2>
      <p className="mt-4 max-w-prose text-[17px] leading-[1.6]">
        Trainingen, deelnemers en het laatste nieuws over 14 november.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="https://instagram.com/themallrun"
          target="_blank"
          rel="noreferrer"
          className="u-narrow rounded-full bg-brand px-6 py-3 text-[15px] font-bold text-ink hover:bg-brandInk hover:text-paper"
        >
          @themallrun
        </a>
        <a
          href="https://instagram.com/yfcveenendaal"
          target="_blank"
          rel="noreferrer"
          className="u-narrow rounded-full bg-panel px-6 py-3 text-[15px] font-semibold text-ink hover:bg-line"
        >
          @yfcveenendaal
        </a>
      </div>
    </RouteSectionShell>
  );
}
```

- [ ] **Step 5: Verwijder het oude sectie-omhulsel**

```bash
grep -rn "components/Section.jsx" src/ || rm src/components/Section.jsx
```

Verwacht: geen treffers meer, waarna het bestand verdwijnt. Staat er nog een verwijzing, los die dan eerst op.

- [ ] **Step 6: Controleer de build en de tests**

Run: `npx vite build && npm test`
Verwacht: build slaagt, alle tests groen.

- [ ] **Step 7: Commit**

```bash
git add -A src/components
git commit -m "feat: overige secties omgezet naar het route-omhulsel"
```

---

### Task 13: Deelnemers als rijen aan de route

**Files:**
- Modify: `src/components/ParticipantsSection.jsx`
- Modify: `src/components/ParticipantCard.jsx` (wordt een rij)
- Create: `src/components/ParticipantCard.test.jsx`

**Interfaces:**
- Consumes: `RouteSectionShell`.
- Produces: `<ParticipantCard participant={{ id, name, distance, team, quote, raisedAmount, goalAmount }} />`, nu als rij in plaats van kaart.

- [ ] **Step 1: Schrijf de falende test**

Maak `src/components/ParticipantCard.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ParticipantCard from './ParticipantCard.jsx';

function renderRow(participant) {
  return render(
    <MemoryRouter>
      <ParticipantCard participant={participant} />
    </MemoryRouter>
  );
}

describe('ParticipantCard', () => {
  const base = {
    id: 'abc',
    name: 'Sanne',
    distance: '14 km',
    team: 'Team Veenendaal',
    quote: 'Ik loop voor The Mall.',
    raisedAmount: 75,
    goalAmount: 150,
  };

  it('linkt naar de eigen pagina van de deelnemer', () => {
    renderRow(base);
    expect(screen.getByRole('link', { name: /Sanne/ })).toHaveAttribute('href', '/deelnemer/abc');
  });

  it('toont de afstand zonder dubbele eenheid', () => {
    renderRow(base);
    expect(screen.getByText('14')).toBeInTheDocument();
  });

  it('overleeft een deelnemer zonder doelbedrag', () => {
    renderRow({ ...base, goalAmount: 0, raisedAmount: 0 });
    expect(screen.getByRole('link', { name: /Sanne/ })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Draai de test en controleer dat hij faalt**

Run: `npm test -- src/components/ParticipantCard.test.jsx`
Verwacht: FAIL — de huidige kaart toont "14" samen met "km" in hetzelfde element.

- [ ] **Step 3: Herschrijf `ParticipantCard.jsx`**

```jsx
import { Link } from 'react-router-dom';

function euro(n) {
  return '€' + Number(n || 0).toLocaleString('nl-NL');
}

// Geen omkaderde kaart meer: een rij aan de route, met de afstand als aanloop en
// een kort streepje voortgang eronder.
export default function ParticipantCard({ participant }) {
  const pct =
    participant.goalAmount > 0
      ? Math.max(0, Math.min(100, (participant.raisedAmount / participant.goalAmount) * 100))
      : 0;
  const km = String(participant.distance || '').replace(/\s*km\s*/i, '');

  return (
    <Link
      to={`/deelnemer/${participant.id}`}
      className="group block rounded-[24px] px-5 py-6 hover:bg-panel"
    >
      <div className="flex items-baseline gap-4">
        <span className="u-wide text-[34px] font-extrabold leading-none text-brand">{km}</span>
        <span className="u-narrow text-[13px] text-muted">km</span>
        {participant.team && (
          <span className="u-narrow ml-auto text-[13px] text-muted">{participant.team}</span>
        )}
      </div>

      <h3 className="u-narrow mt-3 text-[21px] font-bold leading-tight text-ink">
        {participant.name}
      </h3>
      {participant.quote && (
        <p className="mt-2 max-w-[42ch] text-[16px] leading-[1.6] text-body">{participant.quote}</p>
      )}

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
      </div>
      <p className="u-narrow mt-2 text-[13px] text-muted">
        {euro(participant.raisedAmount)} van {euro(participant.goalAmount)}
      </p>
    </Link>
  );
}
```

- [ ] **Step 4: Herschrijf `ParticipantsSection.jsx`**

```jsx
import RouteSectionShell from './route/RouteSectionShell.jsx';
import { useParticipants } from '../hooks/useParticipants.js';
import ParticipantCard from './ParticipantCard.jsx';

export default function ParticipantsSection() {
  const { participants, loading } = useParticipants();

  return (
    <RouteSectionShell id="deelnemers" label="Deelnemers">
      <h2 className="u-wide text-[clamp(26px,4vw,40px)] font-extrabold leading-[0.95] text-ink">
        Wie er meelopen
      </h2>
      <p className="mt-5 max-w-prose text-[17px] leading-[1.6]">
        Iedereen loopt met een eigen doel. Open een deelnemer om het verhaal en de stand te zien.
      </p>

      {loading && <p className="mt-10 text-[16px] text-muted">Deelnemers worden geladen.</p>}

      {!loading && participants.length === 0 && (
        <p className="mt-10 max-w-prose text-[16px] text-muted">
          Er staat nog niemand aan de start. Deelnemers voeg je toe via het beheerscherm op{' '}
          <code>/admin</code>.
        </p>
      )}

      {participants.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {participants.map((p) => (
            <ParticipantCard key={p.id} participant={p} />
          ))}
        </div>
      )}

      <a
        href="#inschrijven"
        className="u-narrow mt-8 inline-block rounded-full bg-brand px-6 py-3 text-[15px] font-bold text-ink hover:bg-brandInk hover:text-paper"
      >
        Doe ook mee
      </a>
    </RouteSectionShell>
  );
}
```

- [ ] **Step 5: Draai de tests en controleer dat ze slagen**

Run: `npm test -- src/components/ParticipantCard.test.jsx`
Verwacht: PASS, 3 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/ParticipantCard.jsx src/components/ParticipantCard.test.jsx src/components/ParticipantsSection.jsx
git commit -m "feat: deelnemers als rijen aan de route"
```

---

### Task 14: De finish — inschrijfformulier en footer

**Files:**
- Modify: `src/components/RegistrationForm.jsx`
- Modify: `src/components/Footer.jsx`
- Modify: `src/pages/Home.jsx`
- Create: `src/components/RegistrationForm.test.jsx`

**Interfaces:**
- Consumes: `RouteSectionShell` (tone `finish`), `YfcLogo` (variant `full`).
- Produces: niets voor andere taken.

- [ ] **Step 1: Schrijf de falende test**

Maak `src/components/RegistrationForm.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import RegistrationForm from './RegistrationForm.jsx';

vi.mock('../hooks/useRegistrations.js', () => ({
  submitRegistration: vi.fn().mockResolvedValue(undefined),
}));

describe('RegistrationForm', () => {
  it('toont de gekozen afstand als geselecteerd', () => {
    render(<RegistrationForm distance="14 km" onDistanceChange={() => {}} />);
    expect(screen.getByRole('radio', { name: '14 km' })).toBeChecked();
  });

  it('meldt een gewijzigde afstand aan de pagina', async () => {
    const onDistanceChange = vi.fn();
    render(<RegistrationForm distance="7 km" onDistanceChange={onDistanceChange} />);
    await userEvent.click(screen.getByRole('radio', { name: '21,1 km' }));
    expect(onDistanceChange).toHaveBeenCalledWith('21,1 km');
  });
});
```

Installeer de gebruikerssimulatie:

```bash
npm install -D @testing-library/user-event@^14
```

- [ ] **Step 2: Draai de test en controleer dat hij faalt**

Run: `npm test -- src/components/RegistrationForm.test.jsx`
Verwacht: FAIL — de radio's hebben nu geen toegankelijke naam omdat het label geen `aria-label` of gekoppelde tekst heeft.

- [ ] **Step 3: Pas het formulier aan**

In `src/components/RegistrationForm.jsx`:

1. Geef elke radio een toegankelijke naam door `aria-label={d}` op de `<input>` te zetten.
2. Vervang `inputClass` door:

```js
  const inputClass =
    'w-full rounded-2xl border border-white/25 bg-white/5 px-4 py-3.5 text-[16px] text-white placeholder:text-white/35 hover:border-white/50';
```

3. Vervang de klasse van de gekozen-afstandspil door:

```jsx
              <span className="u-narrow inline-flex items-center rounded-full border border-white/25 px-5 py-3 text-[15px] font-semibold text-white/75 peer-checked:border-brand peer-checked:bg-brand peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white">
```

4. Vervang de verzendknop door:

```jsx
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="u-narrow w-full rounded-full bg-brand py-4 text-[16px] font-bold text-ink hover:bg-brandInk hover:text-paper disabled:opacity-60"
      >
        {status === 'submitting' ? 'Bezig met versturen' : 'Schrijf me in'}
      </button>
```

5. Vervang in het "gelukt"-blok `border border-white/40 p-8` door `rounded-[28px] bg-white/10 p-8`.

- [ ] **Step 4: Draai de tests en controleer dat ze slagen**

Run: `npm test -- src/components/RegistrationForm.test.jsx`
Verwacht: PASS, 2 tests.

- [ ] **Step 5: Herschrijf de footer met de volledige lockup**

Vervang de volledige inhoud van `src/components/Footer.jsx`:

```jsx
import YfcLogo from './YfcLogo.jsx';

export default function Footer() {
  const link = 'block text-[15px] text-white/70 hover:text-white';

  return (
    <footer className="bg-ink text-white/70 on-dark">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:px-10">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="u-wide text-[20px] font-extrabold text-white">The Mall Run</p>
            <p className="mt-3 text-[15px] leading-[1.6]">
              14 november 2026, Veenendaal.
            </p>
            <a
              href="https://veenendaal.yfc.nl/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block"
            >
              <YfcLogo variant="full" className="h-20 w-auto" title="Youth for Christ Veenendaal" />
            </a>
          </div>
          <div>
            <h2 className="u-narrow mb-3 text-[14px] font-semibold text-white">Contact</h2>
            <a href="mailto:info@yfcveenendaal.nl" className={link}>info@yfcveenendaal.nl</a>
            <a href="https://yfcveenendaal.nl" className={link}>yfcveenendaal.nl</a>
          </div>
          <div>
            <h2 className="u-narrow mb-3 text-[14px] font-semibold text-white">Instagram</h2>
            <a href="https://instagram.com/themallrun" className={link}>@themallrun</a>
            <a href="https://instagram.com/yfcveenendaal" className={link}>@yfcveenendaal</a>
          </div>
          <div>
            <h2 className="u-narrow mb-3 text-[14px] font-semibold text-white">Meedoen</h2>
            <a href="#inschrijven" className={link}>Inschrijven</a>
            <a href="#deelnemers" className={link}>Deelnemers</a>
          </div>
        </div>

        <p className="mt-12 text-[13px] leading-[1.7] text-white/50">
          The Mall Run wordt georganiseerd door Youth for Christ Veenendaal, een ANBI-erkende
          organisatie. Giften zijn daardoor onder voorwaarden aftrekbaar van de belasting.
        </p>
        <p className="u-narrow mt-4 text-[13px] text-white/50">
          © 2026 The Mall Run, YFC Veenendaal
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Zet de finish-sectie in `Home.jsx`**

Vervang de `<Section id="inschrijven" … tone="dark">` door:

```jsx
      <RouteSectionShell id="inschrijven" label="Inschrijven" tone="finish">
        <h2 className="u-wide text-[clamp(30px,5vw,52px)] font-extrabold leading-[0.92] text-white">
          Kom naar de start op 14 november
        </h2>
        <p className="mt-5 max-w-prose text-[17px] leading-[1.6] text-white/70">
          Vul je gegevens in, dan nemen we contact met je op over de voorbereiding en je eigen
          deelnemerspagina.
        </p>
        <div className="mt-10">
          <RegistrationForm distance={distance} onDistanceChange={setDistance} />
        </div>
      </RouteSectionShell>
```

Vervang ook de `<Section id="voortgang" …>` door:

```jsx
      <RouteSectionShell id="voortgang" label="De stand" side="right">
        <h2 className="u-wide text-[clamp(26px,4vw,40px)] font-extrabold leading-[0.95] text-ink">
          Wat we tot nu toe ophaalden
        </h2>
        <p className="mt-5 max-w-prose text-[17px] leading-[1.6]">
          Alles wat binnenkomt gaat naar het jongerenwerk van The Mall. De teller loopt mee zolang
          de inschrijving open is.
        </p>
        <div className="mt-10">
          <ProgressBar
            raised={settings.raisedAmount}
            goal={settings.goalAmount}
            stretch={settings.stretchGoal}
          />
        </div>
      </RouteSectionShell>
```

Werk de imports bij: `Section` eruit, `RouteSectionShell` erin.

- [ ] **Step 7: Controleer de build en alle tests**

Run: `npx vite build && npm test`
Verwacht: build slaagt, alle tests groen.

- [ ] **Step 8: Commit**

```bash
git add src/components/RegistrationForm.jsx src/components/RegistrationForm.test.jsx src/components/Footer.jsx src/pages/Home.jsx package.json package-lock.json
git commit -m "feat: finish-sectie en footer met ANBI-vermelding"
```

---

### Task 15: Deelnemerspagina en beheerschermen

**Files:**
- Modify: `src/pages/ParticipantPage.jsx`
- Modify: `src/pages/admin/AdminDashboard.jsx`, `src/pages/admin/AdminLogin.jsx`, `src/pages/admin/ParticipantsTab.jsx`

**Interfaces:**
- Consumes: de tokens uit Task 3.
- Produces: niets voor andere taken.

De beheerschermen krijgen geen herontwerp — alleen de nieuwe tokens, zodat er nergens meer naar een niet-bestaande klasse wordt verwezen.

- [ ] **Step 1: Zoek alle verdwenen klassen op**

```bash
grep -rnE "bg-surface|text-deep|bg-deep|border-rule|bg-rule|text-paper|font-display|font-serif|\bwide\b|semiwide|tick-rule" src/pages/
```

- [ ] **Step 2: Vervang ze**

Vertaaltabel: `bg-surface` → `bg-base`; `bg-deep` → `bg-ink`; `text-deep` → `text-ink`; `border-rule` → `border-line`; `bg-rule` → `bg-line`; `text-paper` → `text-paper` (blijft); `font-display`/`font-serif` → weghalen (er is nog maar één familie); `wide` → `u-wide`; `semiwide` → `u-narrow`; `tick-rule`-elementen verwijderen.

Knoppen met `bg-ink … text-paper` worden `rounded-full bg-brand … text-ink hover:bg-brandInk hover:text-paper`. Vierkante kaders worden `rounded-2xl` of vervallen.

- [ ] **Step 3: Controleer dat er niets is blijven staan**

Run: `grep -rnE "bg-surface|text-deep|bg-deep|border-rule|bg-rule|font-display|font-serif|semiwide|tick-rule" src/ || echo "schoon"`
Verwacht: `schoon`

- [ ] **Step 4: Controleer de build**

Run: `npx vite build && npm test`
Verwacht: build slaagt, alle tests groen.

- [ ] **Step 5: Commit**

```bash
git add src/pages
git commit -m "feat: deelnemerspagina en beheerschermen op de nieuwe tokens"
```

---

### Task 16: Eindcontrole

**Files:**
- Geen wijzigingen, tenzij er iets uit de controle komt.

- [ ] **Step 1: Draai alles**

Run: `npm test && npx vite build`
Verwacht: alle tests groen, build slaagt.

- [ ] **Step 2: Maak schermafdrukken van de hele pagina**

```bash
npx vite preview --port 5180 &
sleep 3
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=1440,7200 --virtual-time-budget=9000 --screenshot=/tmp/mallrun-desktop.png "http://localhost:5180/"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=390,3000 --virtual-time-budget=9000 --screenshot=/tmp/mallrun-mobiel.png "http://localhost:5180/"
```

Beoordeel: loopt de lijn overal langs de inhoud en nergens dóór tekst heen? Staan de haltes bij hun sectie? Is er op 390px breed geen horizontale scroll?

- [ ] **Step 3: Controleer reduce motion**

```bash
"$CHROME" --headless=new --disable-gpu --force-prefers-reduced-motion --window-size=1440,1400 --virtual-time-budget=9000 --screenshot=/tmp/mallrun-reduced.png "http://localhost:5180/"
```

Verwacht: de lijn staat meteen volledig getekend, zonder loper-stip.

- [ ] **Step 4: Controleer het contrast in de praktijk**

Open de pagina in Chrome DevTools → Lighthouse → Accessibility.
Verwacht: geen enkele bevinding over contrast. Komt er toch een: los die op met de tokens uit `src/theme/colors.js`, nooit met een losse hexwaarde in een component.

- [ ] **Step 5: Beoordeel Bricolage Grotesque op lopende tekst**

Bekijk in `/tmp/mallrun-desktop.png` de sectie "Waarom": drie alinea's onder
elkaar. Leest dat rustig, of wordt het druk?

Wordt het druk, dan treedt de terugvaloptie uit de spec in werking: body-tekst
naar een neutrale tweede letter (Inter), Bricolage blijft voor koppen en cijfers.
Dat is een wijziging in `index.html` en `tailwind.config.js` (`fontFamily.sans`
en een nieuwe `fontFamily.display`), plus `font-display` op de koppen. Meld het
eerst — het is een afwijking van de goedgekeurde spec.

- [ ] **Step 6: Commit wat er nog openstaat**

```bash
git add -A
git commit -m "chore: eindcontrole herontwerp"
```
