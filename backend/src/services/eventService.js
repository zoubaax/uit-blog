const eventModel = require('../models/eventModel');
const registrationModel = require('../models/registrationModel');
const AppError = require('../utils/appError');

const getAllEvents = async (isAdmin = false) => {
    let events;
    if (isAdmin) {
        events = await eventModel.findAll();
        // For admin, add registration counts to each event
        events = await Promise.all(events.map(async (event) => {
            const count = await registrationModel.countByEvent(event.id);
            return { ...event, current_registrations: count };
        }));
    } else {
        events = await eventModel.findAllVisible();
    }
    return events;
};

const getEventById = async (id, shouldIncrementView = true) => {
    const event = await eventModel.findById(id);
    if (!event) {
        throw new AppError('Event not found', 404);
    }

    if (shouldIncrementView) {
        try {
            await eventModel.incrementViews(event.id);
            event.views = (event.views || 0) + 1;
        } catch (e) {
            // Non-critical, continue
        }
    }

    // Add current registration count
    const count = await registrationModel.countByEvent(id);
    event.current_registrations = count;

    return event;
};

const createEvent = async (data) => {
    const { title, description, date, location, cover_image_url, registration_deadline, max_participants } = data;
    return await eventModel.create(
        title,
        description,
        date,
        location,
        cover_image_url,
        registration_deadline || null,
        max_participants || null
    );
};

const updateEvent = async (id, data) => {
    const existing = await eventModel.findById(id);
    if (!existing) {
        throw new AppError('Event not found', 404);
    }

    // Determine if this is a partial update (like toggle visibility) or full update
    // If 'title' is missing, it's likely a partial update
    const isFullUpdate = data.title !== undefined;

    const title = data.title !== undefined ? data.title : existing.title;
    const description = data.description !== undefined ? data.description : existing.description;
    const date = data.date !== undefined ? data.date : existing.date;
    const location = data.location !== undefined ? data.location : existing.location;
    const cover_image_url = data.cover_image_url !== undefined ? data.cover_image_url : existing.cover_image_url;
    const is_hidden = data.is_hidden !== undefined ? data.is_hidden : existing.is_hidden;

    // For limits, we must be careful: if they are in the request, use them (even if null). 
    // If NOT in the request, keep existing.
    const registration_deadline = data.hasOwnProperty('registration_deadline') ? data.registration_deadline : existing.registration_deadline;
    const max_participants = data.hasOwnProperty('max_participants') ? data.max_participants : existing.max_participants;

    console.log(`[SERVICE] Updating Event ${id}. Max Participants mapped to: ${max_participants}`);

    return await eventModel.update(
        id,
        title,
        description,
        date,
        location,
        cover_image_url,
        is_hidden,
        registration_deadline,
        max_participants
    );
};

const deleteEvent = async (id) => {
    const existing = await eventModel.findById(id);
    if (!existing) {
        throw new AppError('Event not found', 404);
    }
    return await eventModel.remove(id);
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
