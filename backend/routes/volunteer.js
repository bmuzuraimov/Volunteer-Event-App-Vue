var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt'); // For hashing passwords
const { withDB, ObjectId } = require('../utils/db');
const isValidObjectId = require('../utils/validateObjectId');
const { validateVolunteerFields } = require('../utils/validations');
const { isVolunteer } = require('../utils/auth');
const { asyncHandler, ValidationError, DatabaseError, NotFoundError } = require('../utils/error_handler');

router.use(withDB);

// Used in MyEventsView.vue
router.get('/profile/:userid', isVolunteer, asyncHandler(async (req, res, next) => {
  const userId = req.params.userid;
  if (!isValidObjectId(userId)) {
    throw new ValidationError('Invalid user ID!');
  }
  const profile = await req.db.collection("users").findOne({ _id: new ObjectId(userId) });
  if (profile) {
    res.status(200).json(profile);
  } else {
    throw new NotFoundError('Profile not found!');
  }
}));

// Used in MyEventsView.vue
router.put('/profile', isVolunteer, asyncHandler(async (req, res) => {
  const userId = req.body._id;
  delete req.body._id;
  const validation = validateVolunteerFields(req.body);
  if (!validation.isValid) {
    throw new ValidationError(validation.errors);
  }
  req.body.password = bcrypt.hashSync(req.body.password, 12);
  req.body.modifiedAt = new Date();
  const result = await req.db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: req.body });
  if (result.modifiedCount > 0) {
    res.status(200).json({ message: "Volunteer updated successfully!" });
  } else {
    throw new NotFoundError('Volunteer not found or no changes made.');
  }
}));

// Used in MyEventsView.vue
router.get('/organizers', isVolunteer, asyncHandler(async (req, res, next) => {
  const organizers = await req.db.collection("events").aggregate([
    {
        $group: {
            _id: "$organizer", // Group by organizer
            count: { $sum: 1 } // Count the number of events per organizer
        }
    },
    {
        $group: {
            _id: null, // Group all documents together
            total: { $sum: "$count" }, // Calculate the total number of events
            organizers: { $push: { organizer: "$_id", count: "$count" } } // Push each organizer and their count into an array
        }
    },
    {
        $unwind: "$organizers" // Deconstruct the organizers array
    },
    {
        $project: {
            _id: "$organizers.organizer",
            percentage: {
                $multiply: [
                    { $divide: ["$organizers.count", "$total"] }, // Calculate the percentage
                    100
                ]
            }
        }
    }
]).toArray();
  res.status(200).json({ organizers });
}));

// Used in components/Events.vue
router.post('/event/join', isVolunteer, asyncHandler(async (req, res, next) => {
  const is_exist = await req.db.collection("enrolled").findOne({ user: req.body.user, event: req.body.event });
  if (is_exist) {
    throw new DatabaseError('Already joined!');
  } else {
    req.body.createdAt = new Date();
    req.body.modifiedAt = new Date();
    var insert_status = await req.db.collection("enrolled").insertOne(req.body);
    var update_status = await req.db.collection('events').updateOne({ _id: new ObjectId(req.body.event) }, { $inc: { quota: -1 } });
    if (insert_status.insertedId) {
      res.status(200).json({ message: "Event joined successfully!" });
    } else {
      throw new DatabaseError('Event not joined!');
    }
  }
}));

// Used in HomeView.vue
router.get('/recent_events/:userid', isVolunteer, asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  if (!isValidObjectId(userId)) {
    throw new ValidationError('Invalid user ID!');
  }
  const events = await req.db.collection("events").aggregate([
    {
      $sort: { createdAt: -1 }
    },
    {
      $limit: 3
    },
    {
      $lookup: {
        from: "enrolled",
        let: { eventId: { $toString: "$_id" } }, // Convert ObjectId to string
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$event", "$$eventId"] // Use the converted string for comparison
              }
            }
          }
        ],
        as: "enrollments"
      }
    },
    {
      $addFields: {
        joined: {
          $anyElementTrue: {
            $map: {
              input: "$enrollments",
              as: "enrollment",
              in: { $eq: ["$$enrollment.user", userId] }
            }
          }
        }
      }
    },
    {
      $project: {
        enrollments: 0,
        // Include other fields you want to retain
      }
    }
  ]).toArray();
  res.status(200).json({ events: events });
}));

// Used in components/Events.vue
router.get('/event/:userid', asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  if (!isValidObjectId(userId)) {
    throw new ValidationError('Invalid user ID!');
  }

  const page = parseInt(req.query.page) || 1;
  const keyword = req.query.keyword || '';
  const perPage = parseInt(req.query.perPage) || 6;
  const skip = (page - 1) * perPage;

  let matchStage = {};
  if (keyword) {
    matchStage = { title: new RegExp(keyword, 'i') };
  }

  const pipeline = [
    { $match: matchStage }, // Conditionally apply search filter
    {
      $lookup: {
        from: "enrolled",
        let: { eventId: { $toString: "$_id" } },
        pipeline: [{ $match: { $expr: { $eq: ["$event", "$$eventId"] } } }],
        as: "enrollments"
      }
    },
    {
      $addFields: {
        joined: { $anyElementTrue: { $map: { input: "$enrollments", as: "enrollment", in: { $eq: ["$$enrollment.user", userId] } } } }
      }
    },
    { $project: { enrollments: 0 } }
  ];

  const total = await req.db.collection("events").aggregate([...pipeline, { $count: "totalCount" }]).toArray();
  const events = await req.db.collection("events").aggregate(pipeline).skip(skip).limit(perPage).toArray();

  const totalCount = total.length > 0 ? total[0].totalCount : 0;
  res.status(200).json({ events: events, total: totalCount, page: page, perPage: perPage });
}));

// Used in components/Events.vue
router.get('/myevent/:userid', asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  if (!isValidObjectId(userId)) {
    throw new ValidationError('Invalid user ID!');
  }
  let events = [];
  let total = [];
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 3;
  const skip = (page - 1) * perPage;
  const pipeline = [
    {
      $lookup: {
        from: "enrolled",
        let: { eventId: { $toString: "$_id" } },
        pipeline: [{ $match: { $expr: { $eq: ["$event", "$$eventId"] } } }],
        as: "enrollments"
      }
    },
    {
      $addFields: {
        joined: { $anyElementTrue: { $map: { input: "$enrollments", as: "enrollment", in: { $eq: ["$$enrollment.user", userId] } } } }
      }
    },
    {
      $match: {
        joined: true
      }
    },
    { $project: { enrollments: 0 } }
  ];

  total = await req.db.collection("events").aggregate([...pipeline, { $count: "totalCount" }]).toArray();
  events = await req.db.collection("events").aggregate(pipeline).skip(skip).limit(perPage).toArray();

  const totalCount = total.length > 0 ? total[0].totalCount : 0;
  res.status(200).json({ events: events, total: totalCount, page: page, perPage: perPage });
}));

module.exports = router;
