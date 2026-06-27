require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");

async function setupDatabase() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not set in backend/.env");
    process.exit(1);
  }

  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log("Connected!");

  const db = mongoose.connection.db;

  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map((c) => c.name);

  const required = ["users", "courses", "lessons", "progresses", "chats"];
  for (const name of required) {
    if (!collectionNames.includes(name)) {
      await db.createCollection(name);
      console.log(`Created collection: ${name}`);
    } else {
      console.log(`Collection exists: ${name}`);
    }
  }

  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("courses").createIndex({ slug: 1 }, { unique: true });
  await db.collection("lessons").createIndex({ course: 1, order: 1 });
  await db.collection("progresses").createIndex({ userId: 1, courseTitle: 1 });
  await db.collection("chats").createIndex({ userId: 1 });

  console.log("Indexes created successfully");
  console.log("Database setup complete!");
  console.log("\nNow run: npm run seed  to populate with demo data");

  await mongoose.disconnect();
}

setupDatabase().catch((err) => {
  console.error("Setup failed:", err.message);
  process.exit(1);
});
