import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define schemas and models
const cakeCategorySchema = new mongoose.Schema({
  name: String,
  description: String,
  additionalPrice: Number,
  image: String
});

const addonSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String
});

const citySchema = new mongoose.Schema({
  name: String,
  district: String,
  deliveryFee: Number
});

const CakeCategory = mongoose.model('CakeCategory', cakeCategorySchema);
const Addon = mongoose.model('Addon', addonSchema);
const City = mongoose.model('City', citySchema);

// Data to insert
const cakeCategories = [
    {
      "name": "Chocolate",
      "description": "Rich and decadent chocolate cakes made with premium cocoa",
      "additionalPrice": 200,
      "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1089&q=80"
    },
    {
      "name": "Vanilla",
      "description": "Classic vanilla cakes with a light and fluffy texture",
      "additionalPrice": 150,
      "image": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=936&q=80"
    },
    {
      "name": "Red Velvet",
      "description": "Distinctive red-colored cake with a subtle chocolate flavor and cream cheese frosting",
      "additionalPrice": 250,
      "image": "https://images.unsplash.com/photo-1586788224331-947f68671cf1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
    },
    {
      "name": "Strawberry",
      "description": "Fresh strawberry-infused cakes with real fruit pieces",
      "additionalPrice": 200,
      "image": "https://images.unsplash.com/photo-1611293388250-580b08c4a145?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
    },
    {
      "name": "Butterscotch",
      "description": "Sweet and buttery cakes with caramelized sugar notes",
      "additionalPrice": 180,
      "image": "https://images.unsplash.com/photo-1542826438-bd32f43d626f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1292&q=80"
    },
    {
      "name": "Black Forest",
      "description": "Traditional German cake with layers of chocolate, cherries, and whipped cream",
      "additionalPrice": 300,
      "image": "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1003&q=80"
    },
    {
      "name": "Fruit Cake",
      "description": "Moist cake filled with assorted fruits and nuts",
      "additionalPrice": 250,
      "image": "https://images.unsplash.com/photo-1562440499-64c9a111f713?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
    },
    {
      "name": "Coffee",
      "description": "Coffee-infused cakes with a rich aroma and flavor",
      "additionalPrice": 220,
      "image": "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    }
  ]
  

const addons = [
    {
      "name": "Chocolate Ganache",
      "description": "Rich and glossy chocolate topping made with cream",
      "price": 150,
      "image": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
    },
    {
      "name": "Fresh Fruit Topping",
      "description": "Assorted seasonal fresh fruits arranged on top",
      "price": 200,
      "image": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80"
    },
    {
      "name": "Fondant Decoration",
      "description": "Smooth sugar paste covering for a polished finish",
      "price": 300,
      "image": "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
    },
    {
      "name": "Edible Flowers",
      "description": "Beautiful edible flowers for an elegant touch",
      "price": 180,
      "image": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
      "name": "Sprinkles",
      "description": "Colorful sugar sprinkles for a fun decoration",
      "price": 100,
      "image": "https://images.unsplash.com/photo-1583495838029-01dae469f5d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
      "name": "Whipped Cream",
      "description": "Light and fluffy whipped cream topping",
      "price": 120,
      "image": "https://images.unsplash.com/photo-1541599188900-88dc52cdb835?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
    },
    {
      "name": "Caramel Drizzle",
      "description": "Sweet caramel sauce drizzled on top",
      "price": 130,
      "image": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80"
    },
    {
      "name": "Nuts Topping",
      "description": "Assorted chopped nuts for added crunch",
      "price": 150,
      "image": "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
      "name": "Custom Message",
      "description": "Personalized message written in icing",
      "price": 100,
      "image": "https://images.unsplash.com/photo-1557979619-445218f326b9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    }
  ]
  

const cities = [
    {
      "name": "Colombo",
      "district": "Colombo",
      "deliveryFee": 100
    },
    {
      "name": "Dehiwala-Mount Lavinia",
      "district": "Colombo",
      "deliveryFee": 150
    },
    {
      "name": "Moratuwa",
      "district": "Colombo",
      "deliveryFee": 200
    },
    {
      "name": "Sri Jayawardenepura Kotte",
      "district": "Colombo",
      "deliveryFee": 150
    },
    {
      "name": "Negombo",
      "district": "Gampaha",
      "deliveryFee": 250
    },
    {
      "name": "Kandy",
      "district": "Kandy",
      "deliveryFee": 350
    },
    {
      "name": "Galle",
      "district": "Galle",
      "deliveryFee": 400
    },
    {
      "name": "Jaffna",
      "district": "Jaffna",
      "deliveryFee": 500
    },
    {
      "name": "Batticaloa",
      "district": "Batticaloa",
      "deliveryFee": 450
    },
    {
      "name": "Trincomalee",
      "district": "Trincomalee",
      "deliveryFee": 450
    },
    {
      "name": "Anuradhapura",
      "district": "Anuradhapura",
      "deliveryFee": 400
    },
    {
      "name": "Ratnapura",
      "district": "Ratnapura",
      "deliveryFee": 350
    },
    {
      "name": "Badulla",
      "district": "Badulla",
      "deliveryFee": 400
    },
    {
      "name": "Matara",
      "district": "Matara",
      "deliveryFee": 400
    },
    {
      "name": "Kurunegala",
      "district": "Kurunegala",
      "deliveryFee": 300
    },
    {
      "name": "Gampaha",
      "district": "Gampaha",
      "deliveryFee": 200
    },
    {
      "name": "Kalutara",
      "district": "Kalutara",
      "deliveryFee": 250
    },
    {
      "name": "Matale",
      "district": "Matale",
      "deliveryFee": 350
    },
    {
      "name": "Nuwara Eliya",
      "district": "Nuwara Eliya",
      "deliveryFee": 400
    },
    {
      "name": "Polonnaruwa",
      "district": "Polonnaruwa",
      "deliveryFee": 400
    }
  ]
  


// Insert data
const seedDatabase = async () => {
  try {
    // Clear existing data
    await CakeCategory.deleteMany({});
    await Addon.deleteMany({});
    await City.deleteMany({});
    
    // Insert new data
    await CakeCategory.insertMany(cakeCategories);
    await Addon.insertMany(addons);
    await City.insertMany(cities);
    
    console.log('Data successfully inserted');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
