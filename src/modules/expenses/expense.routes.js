const express = require('express');
const router = express.Router();
const ctrl = require('./expense.controller');
const auth = require('../../middleware/auth.middleware');

// ⚠️ Specific routes MUST come before /:id routes

// Accounts
router.get('/accounts', auth, ctrl.getAccounts);
router.post('/accounts', auth, ctrl.createAccount);
router.put('/accounts/:id', auth, ctrl.updateAccount);
router.delete('/accounts/:id', auth, ctrl.deleteAccount);

// Categories
router.get('/categories', auth, ctrl.getCategories);
router.post('/categories', auth, ctrl.createCategory);
router.put('/categories/:id', auth, ctrl.updateCategory);
router.delete('/categories/:id', auth, ctrl.deleteCategory);

// Expenses (/:id must be last)
router.get('/', auth, ctrl.getExpenses);
router.post('/', auth, ctrl.createExpense);
router.put('/:id', auth, ctrl.updateExpense);
router.delete('/:id', auth, ctrl.deleteExpense);

// Budgets
router.get('/budgets', auth, ctrl.getBudgets);
router.post('/budgets', auth, ctrl.setBudget);
router.delete('/budgets/:categoryId', auth, ctrl.deleteBudget);

module.exports = router;
