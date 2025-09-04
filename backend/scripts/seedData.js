import mongoose from 'mongoose';
import Property from '../models/Property.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/propertyhub');
    console.log('📊 MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample property data with realistic details and stock images
const sampleProperties = [
  {
    title: "Modern Downtown Apartment",
    description: "Stunning modern apartment in the heart of downtown with city views, hardwood floors, and high-end finishes. Walking distance to restaurants, shopping, and public transportation. Features an open floor plan with large windows and contemporary design throughout.",
    price: 450000,
    type: "apartment",
    status: "available",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    address: "123 Main Street, Downtown, NY 10001",
    coordinates: {
      latitude: 40.7589,
      longitude: -73.9851
    },
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop"
    ],
    features: ["Hardwood Floors", "City Views", "High Ceilings", "Modern Kitchen", "In-unit Laundry", "Balcony"],
    yearBuilt: 2020,
    parkingSpaces: 1,
    petFriendly: true,
    furnished: false,
    utilities: {
      heating: true,
      cooling: true,
      electricity: true,
      water: true,
      internet: true
    },
    contactInfo: {
      agentName: "Sarah Johnson",
      agentPhone: "(555) 123-4567",
      agentEmail: "sarah.johnson@propertyhub.com"
    }
  },
  {
    title: "Luxury Suburban Villa",
    description: "Magnificent 4-bedroom villa in prestigious neighborhood. Features include gourmet kitchen with granite countertops, master suite with walk-in closet, private pool, and beautifully landscaped gardens. Perfect for families seeking luxury and comfort.",
    price: 1250000,
    type: "villa",
    status: "available",
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    address: "456 Oak Avenue, Westfield, NJ 07090",
    coordinates: {
      latitude: 40.6590,
      longitude: -74.3490
    },
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop"
    ],
    features: ["Private Pool", "Gourmet Kitchen", "Master Suite", "3-Car Garage", "Landscaped Garden", "Home Office"],
    yearBuilt: 2018,
    parkingSpaces: 3,
    petFriendly: true,
    furnished: false,
    utilities: {
      heating: true,
      cooling: true,
      electricity: true,
      water: true,
      internet: true
    },
    contactInfo: {
      agentName: "Michael Brown",
      agentPhone: "(555) 987-6543",
      agentEmail: "michael.brown@propertyhub.com"
    }
  },
  {
    title: "Cozy Studio in Arts District",
    description: "Charming studio apartment in the vibrant Arts District. Recently renovated with exposed brick walls, large windows, and modern amenities. Perfect for young professionals or artists. Close to galleries, cafes, and nightlife.",
    price: 275000,
    type: "studio",
    status: "available",
    bedrooms: 0,
    bathrooms: 1,
    area: 650,
    address: "789 Creative Way, Arts District, CA 90013",
    coordinates: {
      latitude: 34.0430,
      longitude: -118.2415
    },
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop"
    ],
    features: ["Exposed Brick", "High Ceilings", "Large Windows", "Modern Kitchen", "Hardwood Floors"],
    yearBuilt: 1925,
    parkingSpaces: 0,
    petFriendly: false,
    furnished: true,
    utilities: {
      heating: true,
      cooling: true,
      electricity: true,
      water: true,
      internet: true
    },
    contactInfo: {
      agentName: "Emma Davis",
      agentPhone: "(555) 456-7890",
      agentEmail: "emma.davis@propertyhub.com"
    }
  },
  {
    title: "Spacious Family Townhouse",
    description: "Beautiful 3-bedroom townhouse with attached garage and private patio. Features include updated kitchen, hardwood floors throughout, and finished basement. Located in family-friendly neighborhood with excellent schools nearby.",
    price: 680000,
    type: "townhouse",
    status: "available",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    address: "321 Maple Street, Brookfield, CT 06804",
    coordinates: {
      latitude: 41.4651,
      longitude: -73.3940
    },
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&h=600&fit=crop"
    ],
    features: ["Attached Garage", "Private Patio", "Finished Basement", "Updated Kitchen", "Near Schools"],
    yearBuilt: 2010,
    parkingSpaces: 2,
    petFriendly: true,
    furnished: false,
    utilities: {
      heating: true,
      cooling: true,
      electricity: true,
      water: true,
      internet: false
    },
    contactInfo: {
      agentName: "David Wilson",
      agentPhone: "(555) 234-5678",
      agentEmail: "david.wilson@propertyhub.com"
    }
  },
  {
    title: "Luxury Waterfront Condo",
    description: "Stunning waterfront condominium with panoramic ocean views. Floor-to-ceiling windows, marble countertops, and premium appliances. Building amenities include pool, gym, and 24-hour concierge service.",
    price: 850000,
    type: "condo",
    status: "available",
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    address: "555 Ocean Drive, Miami Beach, FL 33139",
    coordinates: {
      latitude: 25.7907,
      longitude: -80.1300
    },
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop"
    ],
    features: ["Ocean Views", "Floor-to-ceiling Windows", "Marble Countertops", "Pool", "Gym", "Concierge"],
    yearBuilt: 2019,
    parkingSpaces: 1,
    petFriendly: false,
    furnished: true,
    utilities: {
      heating: true,
      cooling: true,
      electricity: true,
      water: true,
      internet: true
    },
    contactInfo: {
      agentName: "Isabella Rodriguez",
      agentPhone: "(555) 345-6789",
      agentEmail: "isabella.rodriguez@propertyhub.com"
    }
  },
  {
    title: "Charming Victorian House",
    description: "Historic Victorian home with original character and modern updates. Features include ornate moldings, stained glass windows, updated electrical and plumbing, and beautiful gardens. A true gem for those who appreciate classic architecture.",
    price: 725000,
    type: "house",
    status: "available",
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    address: "888 Heritage Lane, San Francisco, CA 94117",
    coordinates: {
      latitude: 37.7699,
      longitude: -122.4505
    },
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ],
    features: ["Historic Character", "Stained Glass", "Original Moldings", "Updated Systems", "Garden"],
    yearBuilt: 1895,
    parkingSpaces: 1,
    petFriendly: true,
    furnished: false,
    utilities: {
      heating: true,
      cooling: false,
      electricity: true,
      water: true,
      internet: true
    },
    contactInfo: {
      agentName: "James Thompson",
      agentPhone: "(555) 567-8901",
      agentEmail: "james.thompson@propertyhub.com"
    }
  },
  {
    title: "Modern Minimalist Apartment",
    description: "Sleek and modern apartment with minimalist design. Features include polished concrete floors, floor-to-ceiling windows, and high-end appliances. Located in trendy neighborhood with easy access to public transportation.",
    price: 520000,
    type: "apartment",
    status: "pending",
    bedrooms: 1,
    bathrooms: 1,
    area: 900,
    address: "444 Industrial Blvd, Seattle, WA 98101",
    coordinates: {
      latitude: 47.6038,
      longitude: -122.3300
    },
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop"
    ],
    features: ["Minimalist Design", "Concrete Floors", "Floor-to-ceiling Windows", "High-end Appliances"],
    yearBuilt: 2021,
    parkingSpaces: 1,
    petFriendly: false,
    furnished: false,
    utilities: {
      heating: true,
      cooling: true,
      electricity: true,
      water: true,
      internet: true
    },
    contactInfo: {
      agentName: "Lisa Chen",
      agentPhone: "(555) 678-9012",
      agentEmail: "lisa.chen@propertyhub.com"
    }
  },
  {
    title: "Rustic Mountain Cabin",
    description: "Cozy mountain cabin perfect for weekend getaways or year-round living. Features include stone fireplace, vaulted ceilings, and wraparound deck with mountain views. Located on 2 acres of private land.",
    price: 395000,
    type: "house",
    status: "available",
    bedrooms: 2,
    bathrooms: 1,
    area: 1100,
    address: "123 Mountain View Road, Aspen, CO 81611",
    coordinates: {
      latitude: 39.1911,
      longitude: -106.8175
    },
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop"
    ],
    features: ["Stone Fireplace", "Vaulted Ceilings", "Mountain Views", "2 Acres", "Wraparound Deck"],
    yearBuilt: 1998,
    parkingSpaces: 2,
    petFriendly: true,
    furnished: true,
    utilities: {
      heating: true,
      cooling: false,
      electricity: true,
      water: true,
      internet: false
    },
    contactInfo: {
      agentName: "Robert Johnson",
      agentPhone: "(555) 789-0123",
      agentEmail: "robert.johnson@propertyhub.com"
    }
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing properties
    await Property.deleteMany({});
    console.log('🗑️  Cleared existing properties');

    // Insert sample properties
    const properties = await Property.insertMany(sampleProperties);
    console.log(`✅ Successfully added ${properties.length} properties to the database`);

    // Log summary
    console.log('\n📊 Property Summary:');
    const summary = await Property.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    summary.forEach(item => {
      console.log(`   ${item._id}: ${item.count} properties (avg: $${Math.round(item.avgPrice).toLocaleString()})`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// Run the seeding process
const runSeed = async () => {
  await connectDB();
  await seedDatabase();
  await mongoose.connection.close();
  console.log('📊 Database connection closed');
  process.exit(0);
};

// Check if this file is being run directly
if (process.argv[1].includes('seedData.js')) {
  runSeed();
}

export { seedDatabase, sampleProperties };