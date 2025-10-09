import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a simple ICO file with a green circle
// ICO file format for a 32x32 favicon
const createSimpleFavicon = () => {
  // For simplicity, we'll create a very basic BMP-based ICO
  // This is a minimal 16x16 favicon with a green circle
  
  const width = 16;
  const height = 16;
  const bpp = 32; // bits per pixel
  
  // ICO Header (6 bytes)
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0);      // Reserved (must be 0)
  icoHeader.writeUInt16LE(1, 2);      // Type (1 for .ICO)
  icoHeader.writeUInt16LE(1, 4);      // Number of images
  
  // Image Directory Entry (16 bytes)
  const imageDir = Buffer.alloc(16);
  imageDir.writeUInt8(width, 0);       // Width
  imageDir.writeUInt8(height, 1);      // Height
  imageDir.writeUInt8(0, 2);           // Color palette
  imageDir.writeUInt8(0, 3);           // Reserved
  imageDir.writeUInt16LE(1, 4);        // Color planes
  imageDir.writeUInt16LE(bpp, 6);      // Bits per pixel
  
  const imageSize = 40 + (width * height * 4); // DIB header + pixel data
  imageDir.writeUInt32LE(imageSize, 8);        // Size of image data
  imageDir.writeUInt32LE(22, 12);              // Offset to image data
  
  // DIB Header (40 bytes - BITMAPINFOHEADER)
  const dibHeader = Buffer.alloc(40);
  dibHeader.writeUInt32LE(40, 0);              // Size of this header
  dibHeader.writeInt32LE(width, 4);            // Width
  dibHeader.writeInt32LE(height * 2, 8);       // Height (doubled for ICO)
  dibHeader.writeUInt16LE(1, 12);              // Color planes
  dibHeader.writeUInt16LE(bpp, 14);            // Bits per pixel
  dibHeader.writeUInt32LE(0, 16);              // Compression (0 = none)
  dibHeader.writeUInt32LE(width * height * 4, 20); // Image size
  
  // Pixel data (BGRA format, bottom-up)
  const pixelData = Buffer.alloc(width * height * 4);
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 7;
  
  // Kainos green gradient colors (lime-green to deep green)
  const topColor = { b: 0x30, g: 0xd4, r: 0xb8, a: 0xff };    // #b8d430
  const midColor = { b: 0x40, g: 0xb1, r: 0x00, a: 0xff };    // #00b140
  const bottomColor = { b: 0x39, g: 0x96, r: 0x00, a: 0xff }; // #009639
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Bottom-up bitmap
      const offset = ((height - 1 - y) * width + x) * 4;
      
      if (distance <= radius) {
        // Calculate gradient based on distance from center (radial gradient)
        const normalizedDist = distance / radius;
        const gradientPos = Math.pow(normalizedDist, 0.7); // Adjust curve
        
        let color;
        if (gradientPos < 0.5) {
          // Interpolate between top and mid
          const t = gradientPos * 2;
          color = {
            b: Math.round(topColor.b + (midColor.b - topColor.b) * t),
            g: Math.round(topColor.g + (midColor.g - topColor.g) * t),
            r: Math.round(topColor.r + (midColor.r - topColor.r) * t),
            a: 0xff
          };
        } else {
          // Interpolate between mid and bottom
          const t = (gradientPos - 0.5) * 2;
          color = {
            b: Math.round(midColor.b + (bottomColor.b - midColor.b) * t),
            g: Math.round(midColor.g + (bottomColor.g - midColor.g) * t),
            r: Math.round(midColor.r + (bottomColor.r - midColor.r) * t),
            a: 0xff
          };
        }
        
        pixelData.writeUInt8(color.b, offset);     // Blue
        pixelData.writeUInt8(color.g, offset + 1); // Green
        pixelData.writeUInt8(color.r, offset + 2); // Red
        pixelData.writeUInt8(color.a, offset + 3); // Alpha
      } else {
        // Transparent
        pixelData.writeUInt8(0, offset);
        pixelData.writeUInt8(0, offset + 1);
        pixelData.writeUInt8(0, offset + 2);
        pixelData.writeUInt8(0, offset + 3);
      }
    }
  }
  
  // Combine all parts
  return Buffer.concat([icoHeader, imageDir, dibHeader, pixelData]);
};

// Generate and save the favicon
const faviconBuffer = createSimpleFavicon();
const outputPath = path.join(__dirname, '..', 'public', 'favicon.ico');
fs.writeFileSync(outputPath, faviconBuffer);

console.log('✅ Favicon generated successfully at:', outputPath);
