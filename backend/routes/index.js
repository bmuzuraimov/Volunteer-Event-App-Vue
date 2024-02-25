var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt'); // For hashing passwords
const { withDB, ObjectId } = require('../utils/db');
const { validateEventFields, validateVolunteerFields } = require('../utils/validations');
const { generateToken } = require('../utils/auth');
const { asyncHandler, ValidationError, AuthenticationError, DatabaseError, NotFoundError } = require('../utils/error_handler');
router.use(withDB);

// Login user
router.post('/login', asyncHandler(async function (req, res) {
  const { email, password } = req.body;
  const user = await req.db.collection("users").findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new AuthenticationError('Wrong credentials!');
  }

  delete user.password;
  delete user.ip_address;
  
  const token = generateToken(user);
  res.json({ token });
}));

// Get latest events
router.get('/', asyncHandler(async (req, res) => {
  const events = await req.db.collection("events")
                             .find()
                             .sort({ createdAt: -1 })
                             .limit(3)
                             .toArray();
  res.status(200).json({ events });
}));

// Get events with pagination and search
router.get('/event', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const keyword = req.query.keyword || '';
  const perPage = parseInt(req.query.perPage) || 6;
  const skip = (page - 1) * perPage;

  const query = keyword ? { title: new RegExp(keyword, 'i') } : {};

  const events = await req.db.collection("events")
                             .find(query)
                             .skip(skip)
                             .limit(perPage)
                             .toArray();
  const total = await req.db.collection("events").countDocuments(query);

  res.status(200).json({ events, total, page, perPage });
}));

// Get a specific event by ID
router.get('/event/:id', asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const event = await req.db.collection('events').findOne({ _id: new ObjectId(eventId) });
  if (!event) {
    throw new NotFoundError('Event not found!');
  }
  res.status(200).json({ event });
}));

module.exports = router;