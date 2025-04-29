import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';
import { config } from 'dotenv';

// Load environment variables
config();

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Define schemas directly for seeding
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      name: { type: String, required: true },
      surname: { type: String },
      bio: { type: String },
      personality: { type: String },
      role: { type: String, default: 'user' }
    }, { timestamps: true });

    userSchema.pre('save', function(next) {
      if (!this.isModified('password')) {
        return next();
      }
      const salt = bcrypt.genSaltSync(10);
      this.password = bcrypt.hashSync(this.password, salt);
      next();
    });

    const commentSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    });

    const recipeSchema = new mongoose.Schema({
      name: { type: String, required: true },
      ingredients: { type: [String], required: true },
      instructions: { type: String, required: true },
      imageUrl: { type: String },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      isPublic: { type: Boolean, default: false },
      likesCount: { type: Number, default: 0 },
      likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      comments: [commentSchema],
      prepTime: { type: Number, default: 0 },
      cookTime: { type: Number, default: 0 },
      dietaryTags: { type: [String], default: [] },
      difficulty: { type: Number, default: 0 },
      mealType: { type: [String], default: [] },
      cuisine: { type: [String], default: [] }
    }, { timestamps: true });

    // Create models
    const UserModel = mongoose.model('User', userSchema);
    const RecipeModel = mongoose.model('Recipe', recipeSchema);

    // Clear existing data
    await UserModel.deleteMany({});
    await RecipeModel.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = await createUsers(UserModel);
    console.log(`Created ${users.length} users`);

    // Create recipes
    const recipes = await createRecipes(RecipeModel, users);
    console.log(`Created ${recipes.length} recipes`);

    // Add likes and comments
    await addLikesAndComments(RecipeModel, users, recipes);
    console.log('Added likes and comments');

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

async function createUsers(UserModel) {
  const password = 'password123'; // Will be hashed by the pre-save hook

  const userData = [
    {
      email: 'john@example.com',
      password,
      name: 'John',
      surname: 'Doe',
      bio: 'I love cooking Italian food and experimenting with new recipes.',
      personality: 'chef',
    },
    {
      email: 'jane@example.com',
      password,
      name: 'Jane',
      surname: 'Smith',
      bio: 'Professional baker with 10 years of experience.',
      personality: 'baker',
    },
    {
      email: 'mike@example.com',
      password,
      name: 'Mike',
      surname: 'Johnson',
      bio: 'Vegan chef specializing in plant-based alternatives.',
      personality: 'chef',
    },
    {
      email: 'sarah@example.com',
      password,
      name: 'Sarah',
      surname: 'Williams',
      bio: 'Food blogger and home cook enthusiast.',
      personality: 'home-cook',
    },
    {
      email: 'david@example.com',
      password,
      name: 'David',
      surname: 'Brown',
      bio: 'Passionate about Asian cuisine and street food.',
      personality: 'home-cook',
    },
  ];

  // Use create instead of insertMany to ensure hooks run
  const createdUsers = [];
  for (const user of userData) {
    const newUser = new UserModel(user);
    const savedUser = await newUser.save();
    createdUsers.push(savedUser);
  }

  return createdUsers;
}

async function createRecipes(RecipeModel, users) {
  const recipesData = [];

  // John's recipes
  recipesData.push({
    name: 'Classic Spaghetti Carbonara',
    ingredients: ['400g spaghetti', '200g pancetta', '4 large eggs', '100g parmesan cheese', 'Black pepper', 'Salt'],
    instructions: 'Cook pasta. Fry pancetta. Mix eggs and cheese. Combine all ingredients.',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3',
    userId: users[0]._id,
    isPublic: true,
    likesCount: 0,
    likedBy: [],
    comments: [],
    prepTime: 10,
    cookTime: 15,
    dietaryTags: [],
    difficulty: 2,
    mealType: ['dinner', 'lunch'],
    cuisine: ['italian'],
  });

  recipesData.push({
    name: 'Homemade Pizza',
    ingredients: ['500g flour', '7g dried yeast', '2 tbsp olive oil', '300ml water', 'Salt', 'Tomato sauce', 'Mozzarella'],
    instructions: 'Make dough. Let rise. Roll out. Add toppings. Bake at 250°C for 10-12 minutes.',
    imageUrl: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65',
    userId: users[0]._id,
    isPublic: false,
    likesCount: 0,
    likedBy: [],
    comments: [],
    prepTime: 120,
    cookTime: 12,
    dietaryTags: ['vegetarian'],
    difficulty: 3,
    mealType: ['dinner'],
    cuisine: ['italian'],
  });

  // Jane's recipes
  recipesData.push({
    name: 'Chocolate Chip Cookies',
    ingredients: ['250g flour', '150g butter', '100g brown sugar', '100g white sugar', '1 egg', '200g chocolate chips', 'Vanilla extract'],
    instructions: 'Cream butter and sugar. Add egg and vanilla. Mix in dry ingredients. Fold in chocolate chips. Bake at 180°C for 10-12 minutes.',
    imageUrl: 'https://images.unsplash.com/photo-1583743089695-4b816eac249d',
    userId: users[1]._id,
    isPublic: true,
    likesCount: 0,
    likedBy: [],
    comments: [],
    prepTime: 15,
    cookTime: 12,
    dietaryTags: ['vegetarian'],
    difficulty: 1,
    mealType: ['dessert', 'snack'],
    cuisine: ['american'],
  });

  recipesData.push({
    name: 'Sourdough Bread',
    ingredients: ['500g bread flour', '350g water', '100g active sourdough starter', '10g salt'],
    instructions: 'Mix ingredients. Autolyse. Stretch and fold 4 times. Proof overnight. Shape and bake in Dutch oven at 240°C.',
    imageUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df',
    userId: users[1]._id,
    isPublic: true,
    likesCount: 0,
    likedBy: [],
    comments: [],
    prepTime: 30,
    cookTime: 45,
    dietaryTags: ['vegan'],
    difficulty: 4,
    mealType: ['breakfast'],
    cuisine: ['french'],
  });

  // Mike's recipes
  recipesData.push({
    name: 'Vegan Mushroom Risotto',
    ingredients: ['320g arborio rice', '800ml vegetable stock', '2 tbsp olive oil', '1 onion', '300g mushrooms', 'Garlic', 'Nutritional yeast', 'Thyme'],
    instructions: 'Sauté onions. Add mushrooms and garlic. Add rice. Gradually add stock while stirring. Finish with nutritional yeast.',
    imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371',
    userId: users[2]._id,
    isPublic: true,
    likesCount: 0,
    likedBy: [],
    comments: [],
    prepTime: 10,
    cookTime: 35,
    dietaryTags: ['vegan', 'gluten-free'],
    difficulty: 3,
    mealType: ['dinner', 'lunch'],
    cuisine: ['italian'],
  });

  recipesData.push({
    name: 'Vegan Black Bean Burgers',
    ingredients: ['2 cans black beans', '1 red onion', '1 bell pepper', 'Breadcrumbs', 'Flax egg', 'Spices', 'Burger buns', 'Toppings'],
    instructions: 'Mash beans. Mix with chopped vegetables, breadcrumbs, and spices. Form patties. Chill for 30 minutes. Pan fry until crispy.',
    imageUrl: 'https://images.unsplash.com/photo-1546241072-48010ad2862c',
    userId: users[2]._id,
    isPublic: false,
    likesCount: 0,
    likedBy: [],
    comments: [],
    prepTime: 20,
    cookTime: 15,
    dietaryTags: ['vegan'],
    difficulty: 2,
    mealType: ['dinner', 'lunch'],
    cuisine: ['american'],
  });

  // Sarah's recipes
  recipesData.push({
    name: 'Avocado Toast',
    ingredients: ['2 slices sourdough bread', '1 ripe avocado', 'Red pepper flakes', 'Lemon juice', 'Salt', 'Pepper', 'Optional: eggs'],
    instructions: 'Toast bread. Mash avocado with lemon, salt, and pepper. Spread on toast. Top with red pepper flakes and optional poached eggs.',
    imageUrl: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2',
    userId: users[3]._id,
    isPublic: true,
    likesCount: 0,
    likedBy: [],
    comments: [],
    prepTime: 5,
    cookTime: 5,
    dietaryTags: ['vegetarian'],
    difficulty: 1,
    mealType: ['breakfast'],
    cuisine: ['modern'],
  });

  recipesData.push({
    name: 'Rainbow Smoothie Bowl',
    ingredients: ['1 frozen banana', '1 cup frozen berries', 'Spinach', 'Almond milk', 'Toppings: granola, chia seeds, fruit, coconut'],
    instructions: 'Blend banana, berries, spinach and almond milk until smooth. Pour into bowl. Arrange toppings in colorful patterns.',
    imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2',
    userId: users[3]._id,
    isPublic: true,
    likesCount: 0,
    likedBy: [],
    comments: [],
    prepTime: 10,
    cookTime: 0,
    dietaryTags: ['vegan', 'gluten-free'],
    difficulty: 1,
    mealType: ['breakfast'],
    cuisine: ['modern'],
  });

  // David's recipes
  recipesData.push({
    name: 'Thai Green Curry',
    ingredients: ['400ml coconut milk', 'Green curry paste', 'Chicken or tofu', 'Vegetables', 'Fish sauce', 'Sugar', 'Thai basil', 'Rice'],
    instructions: 'Fry curry paste. Add protein. Add coconut milk. Simmer. Add vegetables and seasoning. Serve with rice.',
    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd',
    userId: users[4]._id,
    isPublic: true,
    likesCount: 0,
    likedBy: [],
    comments: [],
    prepTime: 15,
    cookTime: 20,
    dietaryTags: [],
    difficulty: 2,
    mealType: ['dinner'],
    cuisine: ['thai'],
  });

  recipesData.push({
    name: 'Korean Bibimbap',
    ingredients: ['Rice', 'Assorted vegetables', 'Beef or tofu', 'Gochujang', 'Sesame oil', 'Soy sauce', 'Fried egg'],
    instructions: 'Cook rice. Prepare vegetables. Cook meat. Arrange in bowl. Top with egg and sauce. Mix before eating.',
    imageUrl: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7',
    userId: users[4]._id,
    isPublic: false,
    likesCount: 0,
    likedBy: [],
    comments: [],
    prepTime: 30,
    cookTime: 15,
    dietaryTags: [],
    difficulty: 3,
    mealType: ['dinner', 'lunch'],
    cuisine: ['korean'],
  });

  return await RecipeModel.insertMany(recipesData);
}

async function addLikesAndComments(RecipeModel, users, recipes) {
  // John likes and comments
  await RecipeModel.findByIdAndUpdate(recipes[2]._id, {
    $push: { likedBy: users[0]._id },
    $inc: { likesCount: 1 },
  });
  
  await RecipeModel.findByIdAndUpdate(recipes[3]._id, {
    $push: { 
      likedBy: users[0]._id,
      comments: {
        userId: users[0]._id,
        text: 'This sourdough recipe is amazing! I made it last weekend and it turned out perfect.',
        createdAt: new Date()
      }
    },
    $inc: { likesCount: 1 },
  });

  await RecipeModel.findByIdAndUpdate(recipes[6]._id, {
    $push: { likedBy: users[0]._id },
    $inc: { likesCount: 1 },
  });

  // Jane likes and comments
  await RecipeModel.findByIdAndUpdate(recipes[0]._id, {
    $push: { 
      likedBy: users[1]._id,
      comments: {
        userId: users[1]._id,
        text: 'Perfect carbonara recipe! I added a bit more pepper for extra flavor.',
        createdAt: new Date()
      }
    },
    $inc: { likesCount: 1 },
  });

  await RecipeModel.findByIdAndUpdate(recipes[4]._id, {
    $push: { likedBy: users[1]._id },
    $inc: { likesCount: 1 },
  });

  // Mike likes and comments
  await RecipeModel.findByIdAndUpdate(recipes[2]._id, {
    $push: { 
      likedBy: users[2]._id,
      comments: {
        userId: users[2]._id,
        text: 'I made these cookies with vegan butter and they came out great!',
        createdAt: new Date()
      }
    },
    $inc: { likesCount: 1 },
  });

  await RecipeModel.findByIdAndUpdate(recipes[8]._id, {
    $push: { likedBy: users[2]._id },
    $inc: { likesCount: 1 },
  });

  // Sarah likes and comments
  await RecipeModel.findByIdAndUpdate(recipes[3]._id, {
    $push: { likedBy: users[3]._id },
    $inc: { likesCount: 1 },
  });

  await RecipeModel.findByIdAndUpdate(recipes[4]._id, {
    $push: { 
      comments: {
        userId: users[3]._id,
        text: 'This risotto is now a weekly staple in our house. So creamy and flavorful!',
        createdAt: new Date()
      }
    }
  });

  await RecipeModel.findByIdAndUpdate(recipes[8]._id, {
    $push: { 
      likedBy: users[3]._id,
      comments: {
        userId: users[3]._id,
        text: 'The perfect amount of spice in this curry. I added some extra vegetables too.',
        createdAt: new Date()
      }
    },
    $inc: { likesCount: 1 },
  });

  // David likes and comments
  await RecipeModel.findByIdAndUpdate(recipes[0]._id, {
    $push: { likedBy: users[4]._id },
    $inc: { likesCount: 1 },
  });

  await RecipeModel.findByIdAndUpdate(recipes[6]._id, {
    $push: { 
      likedBy: users[4]._id,
      comments: {
        userId: users[4]._id,
        text: 'Such a quick and healthy breakfast option. I added some hot sauce for a kick!',
        createdAt: new Date()
      }
    },
    $inc: { likesCount: 1 },
  });
}

// Run the seed function
seed().catch(console.error);