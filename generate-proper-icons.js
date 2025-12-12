// Generate proper PNG icons from SVG using Sharp
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Paths
const svgPath = path.join(__dirname, 'icons', 'icon.svg');
const iconsDir = path.join(__dirname, 'icons');

// Read SVG file
const svgBuffer = fs.readFileSync(svgPath);

console.log('🎨 Generiere PNG-Icons aus SVG...\n');

// Generate each size
async function generateIcons() {
    for (const size of sizes) {
        const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);

        try {
            await sharp(svgBuffer)
                .resize(size, size, {
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .png()
                .toFile(outputPath);

            console.log(`✅ Erstellt: icon-${size}x${size}.png`);
        } catch (error) {
            console.error(`❌ Fehler bei ${size}x${size}:`, error.message);
        }
    }

    console.log('\n🎉 Alle Icons erfolgreich erstellt!');
}

generateIcons().catch(console.error);
