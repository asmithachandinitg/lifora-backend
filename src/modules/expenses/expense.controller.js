const Expense = require('./expense.model');
const Account = require('./account.model');

// ===== EXPENSES =====

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ datetime: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const { type, amount, category, account, note, datetime } = req.body;

    const expense = await Expense.create({
      userId: req.user.id,
      type, amount, category, account, note,
      datetime: datetime || new Date()
    });

    // Update account balance
    if (account) {
      const acc = await Account.findOne({ _id: account, userId: req.user.id });
      if (acc) {
        acc.balance = type === 'expense'
          ? acc.balance - amount
          : acc.balance + amount;
        await acc.save();
      }
    }

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: 'Not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!expense) return res.status(404).json({ message: 'Not found' });

    // Reverse the balance effect on account
    if (expense.account) {
      const acc = await Account.findOne({ _id: expense.account, userId: req.user.id });
      if (acc) {
        acc.balance = expense.type === 'expense'
          ? acc.balance + expense.amount
          : acc.balance - expense.amount;
        await acc.save();
      }
    }

    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== ACCOUNTS =====

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.id }).sort({ createdAt: 1 });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAccount = async (req, res) => {
  try {
    const { name, icon, balance } = req.body;
    const account = await Account.create({ userId: req.user.id, name, icon, balance: balance || 0 });
    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const account = await Account.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!account) return res.status(404).json({ message: 'Not found' });
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const account = await Account.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!account) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== CATEGORIES =====

exports.getCategories = async (req, res) => {
  try {
    const categories = await require('./expenseCategory.model').find({ userId: req.user.id });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, icon, type, budget } = req.body;
    const category = await require('./expenseCategory.model').create({
      userId: req.user.id, name, icon, type, budget: budget || 0
    });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await require('./expenseCategory.model').findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!category) return res.status(404).json({ message: 'Not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await require('./expenseCategory.model').findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== BUDGETS =====
const Budget = require('./budget.model');

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.setBudget = async (req, res) => {
  try {
    const { categoryId, limit } = req.body;
    // upsert: create if not exists, update if exists
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id, categoryId },
      { limit },
      { upsert: true, new: true }
    );
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    await Budget.findOneAndDelete({ userId: req.user.id, categoryId: req.params.categoryId });
    res.json({ message: 'Budget removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
