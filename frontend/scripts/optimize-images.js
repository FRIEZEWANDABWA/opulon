const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, '../public/images');
const extensions = ['.png', '.jpg', '.jpeg'];

async function optimizeImages() {
  try {
    const files = fs.readdirSync(imagesDir);
    
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      
      if (extensions.includes(ext)) {
        const inputPath = path.join(imagesDir, file);
        const outputPath = path.join(imagesDir, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
        
        // Skip if webp already exists
        if (fs.existsSync(outputPath)) {
          console.log(`✓ Skipped ${file} (WebP already exists)`);
          continue;
        }
        
        try {
          await sharp(inputPath)
            .webp({ quality: 85 })
            .toFile(outputPath);
          
          const originalSize = fs.statSync(inputPath).size;
          const newSize = fs.statSync(outputPath).size;
          const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
          
          console.log(`✓ Converted ${file} → ${path.basename(outputPath)} (${savings}% smaller)`);
        } catch (err) {
          console.error(`✗ Failed to convert ${file}:`, err.message);
        }
      }
    }
    
    console.log('\n✅ Image optimization complete!');
  } catch (err) {
    console.error('Error reading images directory:', err);
    process.exit(1);
  }
}

optimizeImages();
