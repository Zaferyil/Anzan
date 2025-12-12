# PWA Icons / App-Symbole

Dieses Verzeichnis enthält die App-Icons für die PWA (Progressive Web App).

## Status

✅ **Platzhalter-Icons erstellt** - Basis-PNGs für alle Größen vorhanden
✅ **SVG-Quelle vorhanden** - `icon.svg` mit Abakus-Design
⚠️ **Aktion erforderlich**: Für Produktion sollten die PNGs aus dem SVG generiert werden

## Icon-Dateien

- `icon.svg` - Quell-Vektor-Icon (Abakus-Design mit Gradient)
- `icon-*.png` - PNG-Icons in verschiedenen Größen (derzeit Platzhalter)

## Benötigte Icon-Größen

Alle erforderlichen Größen für optimale PWA-Unterstützung:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

## Produktions-Icons generieren

### Option 1: Online-Tools (Einfachste Methode)
1. Gehe zu [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Lade `icon.svg` hoch
3. Lade das generierte Paket herunter
4. Ersetze die PNG-Dateien in diesem Verzeichnis

### Option 2: Mit ImageMagick (falls installiert)
```bash
cd icons
for size in 72 96 128 144 152 192 384 512; do
  convert icon.svg -resize ${size}x${size} icon-${size}x${size}.png
done
```

### Option 3: Mit Inkscape (falls installiert)
```bash
cd icons
for size in 72 96 128 144 152 192 384 512; do
  inkscape icon.svg -w $size -h $size -o icon-${size}x${size}.png
done
```

## Hinweis

Die Platzhalter-Icons ermöglichen der PWA zu funktionieren, sollten aber für ein professionelles Erscheinungsbild ersetzt werden.
