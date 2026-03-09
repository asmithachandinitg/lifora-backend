// Add these two lines to your existing users.routes.js
// (alongside your existing profile/password routes)

const { exportData, deleteAccount } = require('./settings.controller');
// or if you merge into users.controller.js:
// const { exportData, deleteAccount } = require('./users.controller');

router.get('/export',         protect, exportData);
router.post('/delete-account', protect, deleteAccount);
