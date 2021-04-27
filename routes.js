const express = require('express'),
router = express.Router();

var itemCtrl = require('./item-controller');
userCtrl = require('./user-controller');

router.get('/hi', itemCtrl.getWorld);
router.get('/hi/:foo/:bar', itemCtrl.getWorldParams);
router.post('/hi', itemCtrl.postWorld);

router.post('/users', userCtrl.createUser);
router.get('/users', userCtrl.getUsers);

module.exports = router;