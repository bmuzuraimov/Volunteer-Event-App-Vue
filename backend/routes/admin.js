var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb'); // Assuming MongoDB is being used
const { withDB } = require('../utils/db');
const isValidObjectId = require('../utils/validateObjectId');
const { validateEventFields } = require('../utils/validations');
const { asyncHandler, DatabaseError, ValidationError } = require('../utils/error_handler');
const { isAdmin } = require('../utils/auth');

router.use(withDB);

/**
 * Get all volunteers
 */
router.get('/volunteer', isAdmin, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 6;
  const skip = (page - 1) * perPage;

  const query = { isAdmin: false };
  const projection = { password: 0 };
  const volunteers = await req.db.collection("users").find(query).project(projection).skip(skip).limit(perPage).toArray();
  const total = await req.db.collection("users").countDocuments(query);

  res.status(200).json({ volunteers, total, page, perPage });
}));

/**
 * Get a specific volunteer by ID
 */
router.get('/volunteer/:id', isAdmin, asyncHandler(async (req, res) => {
  const volunteerId = req.params.id;
  if (!isValidObjectId(volunteerId)) {
    throw new ValidationError('Invalid user ID!');
  }
  const volunteer = await req.db.collection('users').findOne({ _id: new ObjectId(volunteerId) });
  if (volunteer) {
    res.status(200).json({ volunteer });
  } else {
    throw new DatabaseError('Volunteer not found!');
  }
}));

/**
 * Get all volunteers by event ID
 */
router.get('/evolunteers/:event_id', isAdmin, asyncHandler(async (req, res) => {
  
  const event_id = req.params.event_id;
  // if (!isValidObjectId(eventId)) {
  //   throw new ValidationError('Invalid user ID!');
  // }
  const volunteers = await req.db.collection('enrolled').aggregate([
    {
      $match: {
        event: event_id // Assuming 'event' is the right field and event_id is in the correct format
      }
    },
    {
      $lookup: {
        from: "users",
        let: { userId: "$user" }, // Define a variable 'userId' for use in the pipeline
        pipeline: [
          {
            $addFields: {
              convertedId: { $toString: "$_id" } // Convert '_id' from ObjectId to string
            }
          },
          {
            $match: {
              $expr: { $eq: ["$convertedId", "$$userId"] } // Match the converted '_id' with 'user'
            }
          }
        ],
        as: "volunteers"
      }
    },
    {
      $unwind: "$volunteers"
    },
    {
      $replaceRoot: { newRoot: "$volunteers" }
    }
  ]).toArray();

  res.status(200).json({ volunteers });
}));

/**
 * Create a new volunteer
 */
router.post('/volunteer', isAdmin, asyncHandler(async (req, res) => {
  const newVolunteer = {
    ...req.body,
    createdAt: new Date(),
    modifiedAt: new Date()
  };

  const status = await req.db.collection("users").insertOne(newVolunteer);
  if (status.insertedId) {
    res.status(201).json({ message: "Volunteer added successfully!" });
  } else {
    throw new DatabaseError('Volunteer not added!');
  }
}));

/**
 * Update volunteer
 */
router.put('/volunteer', isAdmin, asyncHandler(async (req, res) => {
  const volunteerId = req.body._id;
  delete req.body._id;

  const updateData = {
    ...req.body,
    modifiedAt: new Date()
  };

  const result = await req.db.collection("users").updateOne({ _id: new ObjectId(volunteerId) }, { $set: updateData });
  if (result.modifiedCount > 0) {
    res.status(200).json({ message: "Volunteer updated successfully!" });
  } else {
    throw new DatabaseError('Volunteer not found or no changes made.');
  }
}));

/**
 * Delete volunteer
 */
router.delete('/volunteer/:id', isAdmin, asyncHandler(async (req, res) => {
    const volunteerId = req.params.id;
    if (!isValidObjectId(volunteerId)) {
      throw new ValidationError('Invalid user ID!');
    }
    const delete_volunteer = await req.db.collection("users").deleteOne({ _id: new ObjectId(volunteerId) });
    const enrolled = await req.db.collection("enrolled").find({ user: volunteerId }).toArray();
    enrolled.forEach(item => {
      req.db.collection("events").updateOne({ _id: new ObjectId(item.event) }, { $inc: { quota: 1 } });
      req.db.collection("enrolled").deleteOne({ _id: new ObjectId(item._id) });
    });
    if (delete_volunteer.deletedCount > 0) {
      res.status(200).json({ message: "Volunteer deleted successfully!" });
    } else {
      throw new DatabaseError('Volunteer not found!');
    }
}));

/**
 * Update event
 */
router.put('/event', isAdmin, asyncHandler(async (req, res) => {
    const eventId = req.body._id;
    delete req.body._id;
    const updateData = {
      ...req.body,
      modifiedAt: new Date()
    };
    const result = await req.db.collection("events").updateOne(
      { _id: new ObjectId(eventId) },
      { $set: updateData }
    );
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Event updated successfully!" });
    } else {
      throw new DatabaseError('Event not found or no changes made.');
    }
}));

/**
 * Create event
 */
router.post('/event', isAdmin, asyncHandler(async (req, res) => {
    const isValid = validateEventFields(req.body);
    const newEvent = {
      ...req.body,
      createdAt: new Date(),
      modifiedAt: new Date()
    };
    const status = await req.db.collection("events").insertOne(newEvent);
    if (status.insertedId) {
      res.status(200).json({ message: "Event added successfully!" });
    } else {
      throw new DatabaseError('Event not added!');
    }
}));

/**
 * Delete event
 */
router.delete('/event/:id', isAdmin, asyncHandler(async (req, res) => {
    const eventId = req.params.id;
    if (!isValidObjectId(eventId)) {
      throw new ValidationError('Invalid user ID!');
    }
    const delete_event = await req.db.collection("events").deleteOne({ _id: new ObjectId(eventId) });
    const delete_enrolled = await req.db.collection("enrolled").deleteMany({ event: eventId });
    if (delete_event.deletedCount > 0) {
      res.status(200).json({ message: "Event deleted successfully!" });
    } else {
      throw new DatabaseError('Event not found!');
    }
}));

/**
 * Delete enrollment
 */
router.delete('/enrollment/:volunteer_id/:event_id', isAdmin, asyncHandler(async (req, res) => {
  const volunteerId = req.params.volunteer_id;
  const eventId = req.params.event_id;
  if (!isValidObjectId(eventId) && !isValidObjectId(volunteerId)) {
    throw new ValidationError('Invalid user ID!');
  }
  const update_status = await req.db.collection('events').updateOne({ _id: new ObjectId(eventId) }, { $inc: { quota: -1 } });
  const delete_enrolled = await req.db.collection("enrolled").deleteOne({ user: volunteerId, event: eventId });
  if (delete_enrolled.deletedCount > 0) {
    res.status(200).json({ message: "Enrollment deleted successfully!" });
  } else {
    throw new DatabaseError('Enrollment not found!');
  }
}));

module.exports = router;
