const Event = require("../models/Event");

exports.addEvent = async (req, res) => {
  try {
    const { title, description, date, category, department, location } = req.body;
    const event = await Event.create({ title, description, date, category, department, location });
    res.status(201).json(event);
  } catch (error) {
    console.error("Add Event Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getUpcoming = async (req, res) => {
  try {
    const now = new Date();
    const filter = { date: { $gte: now } };
    if (req.query.category) filter.category = req.query.category;
    const events = await Event.find(filter).sort({ date: 1 }).limit(10);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
