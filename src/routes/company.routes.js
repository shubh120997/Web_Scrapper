const router = require("express").Router();
const { CompanyModel } = require('../model');

router.post('/url', (req, res) => {
  const user = new CompanyModel({ name: 'John Doe' });
  user.save()
  .then(() => console.log('User saved to MongoDB'))
  .catch(err => console.error('Failed to save user:', err));
});

module.exports = router;