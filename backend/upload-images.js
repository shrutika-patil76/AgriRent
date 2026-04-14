const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const Tool = require('./models/Tool');

// Mapping of tool names to image files
const toolImageMapping = {
  'John Deere 5050D Tractor': ['John_Deere_5050D_Tractor.jpg'],
  'Mahindra 575 DI Tractor': ['Mahindra_575_DI_Tractor.jpg'],
  'Swaraj 855 FE Tractor': ['Swaraj_855_FE_Tractor.webp'],
  'Massey Ferguson 245 DI Tractor': ['Massey_Ferguson_245_DI_Tractor.jpg'],
  'Kubota Combine Harvester': ['Kubota_Combine_Harvester.jpg'],
  'New Holland TC5070 Combine Harvester': ['New_Holland_TC5070_Combine_Harvester.jpg'],
  'Rotavator 7 Feet': ['Rotavator_7_Feet.jpg'],
  'Disc Harrow 20 Blades': ['Disc_Harrow_20_Blades.webp'],
  'Seed Drill Machine': ['Seed_Drill_Machine.jpg'],
  'Potato Planter Machine': ['Potato_Planter_Machine.avif'],
  'Agricultural Sprayer 400L': ['Agricultural_Sprayer_400L.webp'],
  'Boom Sprayer 600L': ['Boom_Sprayer_600L.jpg']
};

async function uploadToolImages() {
  try {
    console.log('📸 Starting tool image upload...\n');

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, 'uploads/tools');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Created uploads directory');
    }

    // Get all tools from database
    const tools = await Tool.find();
    console.log(`Found ${tools.length} tools in database\n`);

    for (const tool of tools) {
      const imageFiles = toolImageMapping[tool.name];
      
      if (!imageFiles || imageFiles.length === 0) {
        console.log(`⚠️  No images mapped for: ${tool.name}`);
        continue;
      }

      const imagePaths = [];

      for (const imageFile of imageFiles) {
        const sourcePath = path.join(__dirname, '../assets', imageFile);
        const destPath = path.join(uploadsDir, imageFile);

        // Check if source file exists
        if (!fs.existsSync(sourcePath)) {
          console.log(`❌ Image not found: ${imageFile}`);
          continue;
        }

        // Copy file to uploads directory
        fs.copyFileSync(sourcePath, destPath);
        imagePaths.push(`/uploads/tools/${imageFile}`);
        console.log(`✅ Copied: ${imageFile}`);
      }

      // Update tool with image paths
      if (imagePaths.length > 0) {
        tool.images = imagePaths;
        await tool.save();
        console.log(`✅ Updated tool: ${tool.name} with ${imagePaths.length} image(s)\n`);
      }
    }

    console.log('\n🎉 All tool images uploaded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

uploadToolImages();
