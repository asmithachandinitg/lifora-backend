const Trip = require('./travel.model');

exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createTrip = async (req, res) => {
  try {
    const { name, destination, startDate, endDate, status, budget, expenses, packingList, itinerary, notes, coverColor } = req.body;
    const trip = await Trip.create({
      userId: req.user.id,
      name, destination, startDate,
      endDate: endDate || '',
      status: status || 'planned',
      budget: budget || 0,
      expenses: expenses || [],
      packingList: packingList || [],
      itinerary: itinerary || [],
      notes: notes || '',
      coverColor: coverColor || '#8B5CF6'
    });
    res.status(201).json(trip);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateTrip = async (req, res) => {
  try {
    const { name, destination, startDate, endDate, status, budget, expenses, packingList, itinerary, notes, coverColor } = req.body;
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, destination, startDate, endDate, status, budget, expenses, packingList, itinerary, notes, coverColor },
      { new: true, runValidators: true }
    );
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
