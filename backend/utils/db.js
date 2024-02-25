const { MongoClient, ObjectId } = require('mongodb');

const mongoUri = process.env.MONGODB_URI;

if (!process.env.MONGODB_URI) {
    // throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    process.env.MONGODB_URI = 'mongodb+srv://itfather:PV2f88JtthsgcTNq@cluster0.c6g6yd1.mongodb.net/';
}

// Connect to MongoDB
async function connectToDB() {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('volunteerApp');
    db.client = client;
    return db;
}

async function withDB(req, res, next) {
    try {
      req.db = await connectToDB();
      next();
    } catch (err) {
      res.status(500).json({ message: "Error connecting to database" });
    }
  }

module.exports = { ObjectId, withDB };