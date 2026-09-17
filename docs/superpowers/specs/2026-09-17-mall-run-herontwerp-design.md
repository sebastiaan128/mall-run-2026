# The Mall Run 2026 — herontwerp

**Datum:** 17 september 2026
**Status:** ter review
**Scope:** volledige visuele herziening van de publieke site. Het sponsorplatform
(Mollie/iDEAL) valt hier expliciet buiten en krijgt een eigen spec.

## Aanleiding

De huidige site is een strak zwart-wit redactioneel ontwerp: rechte hoeken, zwarte
vlakken, alles op één raster. Dat leest als "blokkerig". Gevraagd is een moderner
ontwerp met een andere layout, een nieuwe identiteit, en zichtbare betrokkenheid
van de organisator (Youth for Christ Veenendaal).

Het herontwerp gaat vooraf aan het sponsorplatform: het sponsorformulier, de
sponsorlijst en de teller zijn de zwaarste schermen daarvan en worden niet twee
keer vormgegeven.

## Concept

**De route is de drager.** Eén doorlopende gebogen lijn loopt van de kop tot aan
het inschrijfformulier. Secties haken er om en om aan vast. De lijn tekent zich
mee tijdens het scrollen, met een loper-stip die per sectie "aankomt". Het
inschrijfformulier is de finish.

Alles wat de pagina blokkerig maakte verdwijnt: geen omkaderde kaarten, geen
zwarte vlakken, geen randen als scheiding. Wat rond wordt is alleen wat beweegt
of loopt — de lijn, de knoppen, de tellercapsule. Zo betekent "rond" iets.

## Visueel systeem

### Letter

Bricolage Grotesque als enige familie, variabel over de breedte-as (`wdth`) en de
optische as (`opsz`). Koppen breed en zwaar, lopende tekst normaal, labels smal.
Archivo en Source Serif 4 verdwijnen.

Eén variabele familie in plaats van twee: minder laadtijd, en de breedte-as wordt
het instrument voor hiërarchie in plaats van kaders.

### Kleur

Het oranje is dat van Youth for Christ: `#E85812`. De basis is beton- en
asfaltgrijs — de kleuren van de route zelf. Nadrukkelijk geen crème.

| Token | Waarde | Rol |
|---|---|---|
| `paper` | `#FFFFFF` | het enige echt witte vlak |
| `base` | `#FAFAF9` | paginaachtergrond |
| `panel` | `#EDEDEA` | rustige vlakken, zonder rand |
| `line` | `#D6D5D1` | de weinige scheidingen die overblijven |
| `ink` | `#17181A` | koppen en tekst (asfalt) |
| `body` | `#3A3937` | lopende tekst |
| `muted` | `#6E6B66` | labels en bijschriften |
| `brand` | `#E85812` | de routelijn, vlakken, grote cijfers, knopvulling |
| `brandInk` | `#C2420E` | kleine oranje tekst, links, hover |

**Contrastregels** (WCAG AA, gemeten):

- `ink` op `brand` = 4,95:1 → knoppen krijgen asfaltzwarte tekst op oranje, niet wit.
  Wit op `#E85812` haalt maar 3,6:1 en is dus niet toegestaan voor knoptekst.
- `brand` als tekst op `base` = 3,5:1 → alleen voor tekst ≥ 24px bold en voor
  grafische elementen (lijn, balk), nooit voor lopende tekst.
- `brandInk` op `base` = 5,0:1 en wit op `brandInk` = 5,2:1 → dit is de variant
  voor kleine oranje tekst en voor de zeldzame wit-op-oranje knop.

### Vorm en beweging

- Scheidingen ontstaan door witruimte en door de routelijn, niet door randen.
- Afgeronde vormen alleen voor wat beweegt: de lijn (ronde uiteinden), knoppen
  (pill), de tellercapsule.
- Eén bewegingsregel: **alleen de route beweegt**. Secties schuiven niet in,
  tekst fade't niet, niets zweeft.

## Paginaopbouw

De lijn slingert tussen ongeveer een kwart en driekwart van de paginabreedte.
Op mobiel schuift hij naar de linkermarge met een veel kleinere uitslag; de
inhoud staat dan in één kolom rechts ervan.

| # | Sectie | Aan de lijn |
|---|---|---|
| 1 | Kop | Naam groot, datum, plaats, twee knoppen. De lijn begint onder de titel |
| 2 | De stand | Teller als capsule óp de lijn, met een eigen oranje balk |
| 3 | Afstanden | Drie haltes: 7, 14, 21,1 — elk met een knop die de inschrijving voorinvult |
| 4 | Waarom | Het verhaal van The Mall; hier staat de organisator voluit |
| 5 | In beeld | Video (volgt later) |
| 6 | Deelnemers | Geen kaarten maar rijen aan de lijn, elk met een kort eigen voortgangsstreepje |
| 7 | Route | De kaart, met dezelfde lijn als motief |
| 8 | Instagram | Klein, één regel |
| 9 | Inschrijven | Finish: het enige gevulde vlak van de pagina |
| 10 | Footer | Volledige YFC-lockup en de ANBI-vermelding |

## Youth for Christ in beeld

Het officiële logo is een SVG: een oranje vierkant met "YOUTH FOR CHRIST" in wit,
met daaronder een oranje balk met "Veenendaal". De versie heet `-DIAP` (bedoeld
voor donkere achtergronden) maar is getest op zowel licht als donker en werkt in
beide gevallen ongewijzigd — er is geen recolour nodig.

Bron: `https://veenendaal.yfc.nl/wp-content/uploads/sites/9/2020/01/YouthForChrist_Veenendaal-Logo-Oranje-DIAP.svg`
Het bestand komt in `src/assets/yfc-logo.svg`.

Drie plekken, oplopend in gewicht:

1. **Navbar** — links "The Mall Run", daarnaast een dun streepje, het YFC-vierkant
   (~28px) en in kleine letters *een initiatief van*. Het geheel linkt naar
   veenendaal.yfc.nl. Alleen het vierkant, omdat "Veenendaal" in de balk bij
   navbarhoogte onleesbaar klein wordt.
2. **Sectie "Waarom"** — voluit in de tekst: *The Mall Run wordt georganiseerd door
   Youth for Christ Veenendaal*, met de naam als link.
3. **Footer** — de volledige lockup inclusief de Veenendaal-balk, plus de
   ANBI-status. Dat laatste is ook praktisch: sponsors willen weten dat hun gift
   aftrekbaar is.

Component `YfcLogo` zet de SVG inline (geen extra netwerkverzoek, scherp op elk
formaat) met een `variant`-prop: `mark` (alleen het vierkant) of `full` (de
volledige lockup).

## Techniek

### Het pad

Het pad wordt niet met de hand getekend — de pagina wordt langer of korter
naarmate er deelnemers bijkomen. In plaats daarvan meldt elke sectie via een ref
zijn verticale positie en zijn kant (links/rechts), en een pure functie
`buildRoutePath(stops, size)` bouwt daar een vloeiend pad doorheen
(Catmull-Rom-punten omgezet naar cubische beziers).

De SVG staat achter de inhoud (`pointer-events: none`, `aria-hidden`), over de
volle paginahoogte, met een `viewBox` in relatieve eenheden en
`vector-effect="non-scaling-stroke"` zodat de lijndikte overal gelijk blijft bij
niet-proportioneel schalen.

### Tekenen op scroll

`stroke-dasharray` op de totale padlengte (`path.getTotalLength()`), en
`stroke-dashoffset` die met de scrollpositie naar nul loopt. De loper-stip volgt
`path.getPointAtLength(lengte × voortgang)`.

Bewust géén CSS `animation-timeline: scroll()`: de browserondersteuning is nog
ongelijk en dat zou twee codepaden kosten. Eén JS-lus doet hetzelfde en werkt
overal.

### Prestaties

- Scroll-listener is `passive` en zet alleen een dirty-vlag.
- Een `requestAnimationFrame`-lus doet het werk, en meet daarin *niets*: alleen
  schrijven — één `strokeDashoffset`, één `transform`, en een klasse per halte.
- Alle metingen (padlengte, sectieposities, paginahoogte) staan in een cache die
  alleen bij resize opnieuw wordt gevuld, via een `ResizeObserver` op de body —
  zodat het ook klopt als beeld of deelnemers later inladen.

### prefers-reduced-motion

Bij `reduce`: de lijn staat meteen volledig, de stip verdwijnt, alle haltes zijn
actief, en de rAF-lus start niet. De `change`-event van de media query wordt
gevolgd zodat het klopt als iemand de instelling live omzet.

### Toegankelijkheid

De SVG is volledig `aria-hidden` — het is decoratie; de betekenis zit in de
tekstvolgorde. De teller behoudt zijn `role="img"` met uitgeschreven label
(bedrag, doel, percentage). Focusstijlen blijven een zichtbare outline: asfaltzwart op
lichte en oranje vlakken, wit op donkere.

De gevulde lijn toont de scrollpositie, niet het opgehaalde bedrag. Die twee
mogen niet op elkaar lijken: de teller heeft daarom een eigen, duidelijk
begrensde balk in de capsule, en de lijn blijft een dunne stroke.

## Bestanden

| | |
|---|---|
| Nieuw | `src/components/route/RouteLine.jsx`, `src/components/route/RouteSectionShell.jsx`, `src/hooks/useRouteLine.js`, `src/lib/buildRoutePath.js`, `src/lib/routeProgress.js`, `src/lib/contrast.js`, `src/theme/colors.js`, `src/components/YfcLogo.jsx`, `src/assets/yfc-logo.svg` |
| Herschreven | `Header`, `Hero`, `Section`, `Distances`, `Mission`, `VideoSection`, `ParticipantsSection`, `ParticipantCard`, `RouteSection`, `InstagramCTA`, `RegistrationForm`, `Footer`, `ProgressBar`, `src/index.css`, `tailwind.config.js`, `index.html` |
| Alleen nieuwe kleuren | `src/pages/admin/*` |
| Ongemoeid | `src/firebase.js`, alle hooks m.u.v. de nieuwe, `firestore.rules` |

De klassen `.tick-rule`, `.tick-rule-light`, `.wide` en `.semiwide` vervallen; de
breedte-as wordt via Tailwind-utilities op Bricolage gezet.

## Testen

Het project heeft nog geen testrunner. Vitest wordt toegevoegd, want de padbouwer
en de voortgangsberekening zijn pure functies waar tests echt iets waard zijn:

- `buildRoutePath`: geen haltes, één halte, twee haltes, afwisselende kanten,
  een pagina korter dan het scherm.
- Voortgangsberekening: 0%, 100%, negatieve scrollpositie (rubber-band op iOS),
  een documenthoogte gelijk aan de viewport (deling door nul).
- Halte-activatie: precies op de grens.

De vormgeving wordt gecontroleerd met screenshots via headless Chrome (de
browserextensie is in deze omgeving niet verbonden).

## Risico's

**De lijn is het concept.** Hapert hij op een trage telefoon, dan valt het
ontwerp om. Daarom wordt hij als eerste gebouwd en gemeten op een throttled
CPU-profiel voordat de rest volgt. Terugvaloptie: de statische lijn met haltes —
hetzelfde beeld, zonder scrollkoppeling.

**Bricolage Grotesque op lange alinea's.** Een expressieve letter kan in lopende
tekst druk worden. Wordt bij de eerste opbouw beoordeeld op een scherm vol tekst;
blijkt het te onrustig, dan gaat de body-tekst naar een neutrale tweede letter en
blijft Bricolage voor koppen en cijfers.

## Buiten scope

Het sponsorplatform: Mollie/iDEAL, Cloud Functions voor het aanmaken van
betalingen en de webhook, sponsorlijst per deelnemer, automatisch bijwerken van
de teller. YFC heeft een ANBI-status, wat de aanmelding bij Mollie en de
aftrekbaarheid voor donateurs vereenvoudigt, maar niet de server-side eis
wegneemt: zonder webhookbevestiging kan iedere bezoeker de teller vervalsen.
Eigen ontwerpronde, eigen spec.
