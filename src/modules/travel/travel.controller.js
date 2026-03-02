const Trip            = require('./travel.model');
const Expense         = require('../expenses/expense.model');
const ExpenseCategory = require('../expenses/expenseCategory.model');
const Account         = require('../expenses/account.model');

// ── helper: find or create a trip's expense category ──────────
async function getTripCategory(userId, tripId, tripName) {
  let cat = await ExpenseCategory.findOne({ userId, tripRef: tripId });
  if (!cat) {
    cat = await ExpenseCategory.create({
      userId,
      name:    `✈ ${tripName}`,
      icon:    '✈',
      type:    'expense',
      tripRef: tripId          // so we can find it later if trip is renamed
    });
  }
  return cat;
}

// ── TRIPS ──────────────────────────────────────────────────────

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
    const {
      name, destination, startDate, endDate,
      status, budget, expenses, packingList, itinerary, notes, coverColor
    } = req.body;

    const trip = await Trip.create({
      userId: req.user.id,
      name, destination, startDate,
      endDate:     endDate     || '',
      status:      status      || 'planned',
      budget:      budget      || 0,
      expenses:    expenses    || [],
      packingList: packingList || [],
      itinerary:   itinerary   || [],
      notes:       notes       || '',
      coverColor:  coverColor  || '#8B5CF6'
    });

    // Auto-create a matching ExpenseCategory for this trip
    await getTripCategory(req.user.id, trip._id, name);

    res.status(201).json(trip);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateTrip = async (req, res) => {
  try {
    const {
      name, destination, startDate, endDate,
      status, budget, expenses, packingList, itinerary, notes, coverColor
    } = req.body;

    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, destination, startDate, endDate, status, budget, expenses, packingList, itinerary, notes, coverColor },
      { new: true, runValidators: true }
    );

    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    // Keep category name in sync if trip was renamed
    if (name) {
      await ExpenseCategory.findOneAndUpdate(
        { userId: req.user.id, tripRef: trip._id },
        { name: `✈ ${name}` }
      );
    }

    res.json(trip);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    // Clean up: delete the trip's expense category + all linked expenses
    const cat = await ExpenseCategory.findOneAndDelete({ userId: req.user.id, tripRef: trip._id });
    if (cat) {
      await Expense.deleteMany({ userId: req.user.id, category: cat._id.toString() });
    }

    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── TRIP EXPENSES (dedicated endpoints — also sync to Expense module) ──

exports.addTripExpense = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const { title, amount, category, date } = req.body;

    // Build the embedded expense entry
    const expenseEntry = {
      _id:      Date.now().toString(),
      title,
      amount:   Number(amount),
      category: category || 'other',
      date:     date || new Date().toISOString().split('T')[0]
    };

    trip.expenses.push(expenseEntry);
    await trip.save();

    // Find (or create) the trip's ExpenseCategory
    const tripCat = await getTripCategory(req.user.id, trip._id, trip.name);

    // Create a matching Expense record in the Finance module
    const linkedExpense = await Expense.create({
      userId:      req.user.id,
      type:        'expense',
      amount:      expenseEntry.amount,
      category:    tripCat._id.toString(),
      note:        `[${trip.name}] ${title}`,
      datetime:    new Date(date || Date.now()),
      tripExpRef:  expenseEntry._id    // reference back to the travel expense
    });

    // Return the updated trip + the created expense id for reference
    res.status(201).json({
      trip,
      linkedExpenseId: linkedExpense._id
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteTripExpense = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const { expId } = req.params;

    // Remove from trip
    trip.expenses = trip.expenses.filter(e => e._id !== expId);
    await trip.save();

    // Delete the linked Expense record
    await Expense.findOneAndDelete({ userId: req.user.id, tripExpRef: expId });

    res.json({ trip });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
