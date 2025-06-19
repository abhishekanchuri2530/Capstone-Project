import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/canada-computers';

const categories = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Processors",
    description: "CPUs from leading manufacturers"
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Graphics Cards",
    description: "GPUs for gaming and professional use"
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Motherboards",
    description: "ATX and micro-ATX motherboards"
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Memory",
    description: "RAM modules and memory kits"
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Storage",
    description: "SSDs, HDDs, and NVMe drives"
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Power Supplies",
    description: "PSUs with various wattage ratings"
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Cases",
    description: "Computer cases and chassis"
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Cooling",
    description: "CPU coolers, case fans, and liquid cooling"
  }
];

const products = [
  // Processors
  {
    name: "AMD Ryzen 9 7950X",
    description: "16-core, 32-thread processor with boost up to 5.7GHz",
    price: 699.99,
    category_id: categories[0]._id,
    image_url: "https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-ryzen-9-7900x.jpg",
    stock: 25
  },
  {
    name: "Intel Core i9-13900K",
    description: "24-core (8P+16E) processor with boost up to 5.8GHz",
    price: 589.99,
    category_id: categories[0]._id,
    image_url: "https://m.media-amazon.com/images/I/61m8egNHmEL._AC_SL1500_.jpg",
    stock: 30
  },
  
  // Graphics Cards
  {
    name: "NVIDIA GeForce RTX 4090",
    description: "24GB GDDR6X graphics card for ultimate gaming performance",
    price: 1599.99,
    category_id: categories[1]._id,
    image_url: "https://images-cdn.ubuy.co.in/668611628bad29798236ea0c-nvidia-geforce-rtx-4090-24gb-gddr6x-fe.jpg",
    stock: 10
  },
  {
    name: "AMD Radeon RX 7900 XTX",
    description: "24GB GDDR6 graphics card with RDNA 3 architecture",
    price: 999.99,
    category_id: categories[1]._id,
    image_url: "https://m.media-amazon.com/images/I/81tvHo10s2L._AC_SL1500_.jpg",
    stock: 15
  },

  // Motherboards
  {
    name: "ASUS ROG Maximus Z790 Hero",
    description: "Intel Z790 ATX gaming motherboard with PCIe 5.0",
    price: 629.99,
    category_id: categories[2]._id,
    image_url: "https://m.media-amazon.com/images/I/81CpgF-+P4L._AC_SL1500_.jpg",
    stock: 20
  },
  {
    name: "MSI MPG B650 CARBON WIFI",
    description: "AMD B650 ATX motherboard with WiFi 6E",
    price: 329.99,
    category_id: categories[2]._id,
    image_url: "https://m.media-amazon.com/images/I/71ktIaXBbjL._AC_SL1200_.jpg",
    stock: 25
  },

  // Memory
  {
    name: "G.SKILL Trident Z5 RGB 32GB",
    description: "DDR5-6400 CL32 (2x16GB) RAM kit",
    price: 189.99,
    category_id: categories[3]._id,
    image_url: "https://m.media-amazon.com/images/I/61mydyeMZEL._AC_SL1300_.jpg",
    stock: 40
  },
  {
    name: "Corsair Vengeance RGB 64GB",
    description: "DDR5-5600 CL36 (2x32GB) RAM kit",
    price: 299.99,
    category_id: categories[3]._id,
    image_url: "https://m.media-amazon.com/images/I/91lJnskEV9L._AC_SL1500_.jpg",
    stock: 30
  },

  // Storage
  {
    name: "Samsung 990 PRO 2TB",
    description: "PCIe 4.0 NVMe M.2 SSD with up to 7,450 MB/s",
    price: 179.99,
    category_id: categories[4]._id,
    image_url: "https://m.media-amazon.com/images/I/71OWtcxKgvL._AC_SL1500_.jpg",
    stock: 50
  },
  {
    name: "WD Black SN850X 1TB",
    description: "PCIe 4.0 NVMe M.2 Gaming SSD",
    price: 129.99,
    category_id: categories[4]._id,
    image_url: "https://m.media-amazon.com/images/I/61KeSQhDm4L._AC_SL1500_.jpg",
    stock: 45
  },

  // Power Supplies
  {
    name: "Corsair RM1000x",
    description: "1000W 80+ Gold Fully Modular PSU",
    price: 189.99,
    category_id: categories[5]._id,
    image_url: "https://m.media-amazon.com/images/I/81dwGXVwpgL._AC_SL1500_.jpg",
    stock: 35
  },
  {
    name: "be quiet! Dark Power 13",
    description: "1000W 80+ Titanium Fully Modular PSU",
    price: 299.99,
    category_id: categories[5]._id,
    image_url: "https://m.media-amazon.com/images/I/81HxCfuGyeL._AC_SL1500_.jpg",
    stock: 20
  },

  // Cases
  {
    name: "Lian Li PC-O11 Dynamic EVO",
    description: "Premium Mid-Tower Case with excellent airflow",
    price: 169.99,
    category_id: categories[6]._id,
    image_url: "https://m.media-amazon.com/images/I/71S2+h21TfL._AC_SL1500_.jpg",
    stock: 30
  },
  {
    name: "Fractal Design Torrent",
    description: "High-airflow ATX case with included fans",
    price: 189.99,
    category_id: categories[6]._id,
    image_url: "https://m.media-amazon.com/images/I/71KdiAihDxL._AC_SL1500_.jpg",
    stock: 25
  },

  // Cooling
  {
    name: "NZXT Kraken Z73",
    description: "360mm AIO liquid cooler with LCD display",
    price: 279.99,
    category_id: categories[7]._id,
    image_url: "https://m.media-amazon.com/images/I/41Yat2-orIL._SL1000_.jpg",
    stock: 20
  },
  {
    name: "Noctua NH-D15 chromax.black",
    description: "Dual-tower CPU air cooler",
    price: 109.99,
    category_id: categories[7]._id,
    image_url: "https://m.media-amazon.com/images/I/91lEEKE1Q1L._SL1500_.jpg",
    stock: 40
  }
];

async function importData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await mongoose.connection.dropDatabase();
    console.log('Existing database dropped');

    // Import categories
    await mongoose.connection.collection('categories').insertMany(categories);
    console.log('Categories imported');

    // Import products
    await mongoose.connection.collection('products').insertMany(products);
    console.log('Products imported');

    console.log('Sample data import completed successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await mongoose.disconnect();
  }
}

importData();