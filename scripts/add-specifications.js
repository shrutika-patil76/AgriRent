const mongoose = require('../backend/node_modules/mongoose');
require('../backend/node_modules/dotenv').config({ path: '../backend/.env' });

// Define Tool schema inline
const toolSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  pricePerDay: Number,
  deposit: Number,
  images: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: String,
  available: Boolean,
  rating: Number,
  reviewCount: Number,
  specifications: {
    brand: String,
    model: String,
    year: Number,
    condition: String
  }
});

const Tool = mongoose.model('Tool', toolSchema);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agri_rental')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const addSpecifications = async () => {
  try {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔧 ADDING SPECIFICATIONS TO TOOLS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Find all tools without specifications
    const tools = await Tool.find();
    
    console.log(`Found ${tools.length} tools\n`);

    for (const tool of tools) {
      // Check if specifications are missing or empty
      if (!tool.specifications || !tool.specifications.brand) {
        console.log(`Updating: ${tool.name}`);
        
        // Add default specifications based on category
        let specs = {
          brand: 'Generic',
          model: 'Standard',
          year: 2023,
          condition: 'Good'
        };

        // Customize based on tool name
        if (tool.name.includes('John Deere')) {
          specs.brand = 'John Deere';
          specs.model = tool.name.split(' ')[2] || 'Standard';
        } else if (tool.name.includes('Mahindra')) {
          specs.brand = 'Mahindra';
          specs.model = tool.name.split(' ')[1] || 'Standard';
        } else if (tool.name.includes('Swaraj')) {
          specs.brand = 'Swaraj';
          specs.model = tool.name.split(' ')[1] || 'Standard';
        } else if (tool.name.includes('Kubota')) {
          specs.brand = 'Kubota';
          specs.model = 'Combine';
        } else if (tool.name.includes('Massey')) {
          specs.brand = 'Massey Ferguson';
          specs.model = tool.name.split(' ')[2] || 'Standard';
        } else if (tool.name.includes('Seeder')) {
          specs.brand = 'AgriTech';
          specs.model = 'Seed Drill';
        } else if (tool.name.includes('Sprayer')) {
          specs.brand = 'Neptune';
          specs.model = 'Agricultural Sprayer';
        } else if (tool.name.includes('Rotavator')) {
          specs.brand = 'Fieldking';
          specs.model = '7 Feet';
        } else if (tool.name.includes('Harrow')) {
          specs.brand = 'Lemken';
          specs.model = 'Disc Harrow';
        } else if (tool.name.includes('Planter')) {
          specs.brand = 'Grimme';
          specs.model = 'Potato Planter';
        }

        tool.specifications = specs;
        await tool.save();
        
        console.log(`  ✅ Brand: ${specs.brand}, Model: ${specs.model}, Year: ${specs.year}, Condition: ${specs.condition}`);
      } else {
        console.log(`✓ ${tool.name} - Already has specifications`);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ALL TOOLS UPDATED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

addSpecifications();
