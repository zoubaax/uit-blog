const eventService = require('../services/eventService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getAll = catchAsync(async (req, res) => {
    // Check if user is admin to see hidden events
    const isAdmin = req.user && req.user.role === 'admin';
    const events = await eventService.getAllEvents(isAdmin);
    res.status(200).json({ success: true, count: events.length, data: events });
});

const getOne = catchAsync(async (req, res) => {
    const shouldIncrementView = req.query.skip_view !== 'true';
    const event = await eventService.getEventById(req.params.id, shouldIncrementView);
    res.status(200).json({ success: true, data: event });
});

const create = catchAsync(async (req, res) => {
    const { title, description, date, location } = req.body;

    if (!title || !description || !date || !location) {
        throw new AppError('Title, description, date, and location are required', 400);
    }

    const newEvent = await eventService.createEvent(req.body);
    res.status(201).json({ success: true, data: newEvent });
});

const update = catchAsync(async (req, res) => {
    console.log('--- API UPDATE REQUEST BODY ---');
    console.log(req.body);
    const updatedEvent = await eventService.updateEvent(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedEvent });
});

const remove = catchAsync(async (req, res) => {
    await eventService.deleteEvent(req.params.id);
    res.status(204).json({ success: true, data: null });
});

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove
};
