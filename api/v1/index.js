var express = require('express');
var jwtAuthentication = require('./policies/jwtAuthentication');

var userController = require('./controllers/user');
var groupController = require('./controllers/usergroup');
var entityController = require('./controllers/entity');
var clientController = require('./controllers/client');
var eventController = require('./controllers/event');
var subController = require('./controllers/subscription');
// var signalController = require('./controllers/signal');
// var signalLogController = require('./controllers/signallog');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// declare routes before login
router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.get('/verify', userController.verifyEmail);
router.post('/forgot-password', userController.forgotPassword);

// middleware
router.all('*', jwtAuthentication);

// declare routes after login
router.get('/test', userController.testCtrl);

router.get('/listUser/:username', userController.listUser);
router.get('/listAllUsers', userController.listAllUsers);
router.delete('/deleteUserByID/:username', userController.deleteUserByID);
router.put('/updateUserByID/:username', userController.updateUserByID);
router.post('/userprofile/create', userController.createProfile);
router.post('/userprofile/upload/:username', userController.uploadImage);
router.post('/users/setuserrole', userController.setUserRole);

router.get('/usergroup/:id', groupController.getById);
router.get('/listAllGroups', groupController.listAllGroups);
router.delete('/usergroup/delete/:id', groupController.deleteUserGroupById);
router.put('/usergroup/update/:id', groupController.updateById);
router.post('/usergroup/create', groupController.create);

router.post('/ourclient/create', clientController.create);
router.get('/listAllClients', clientController.listAllClients);
router.post('/entity/create', entityController.create);
router.get('/listAllEntities', entityController.listAllEntities);

router.get('/events', eventController.listAllEvents);
router.get('/events/:id', eventController.getById);
router.post('/events', eventController.create);
router.put('/events/:id', eventController.updateById);
router.delete('/events/:id', eventController.deleteById);

router.get('/subscriptions', subController.listAllSubscriptions);
router.get('/subscriptions/:id', subController.getById);
router.post('/subscriptions', subController.create);
router.put('/subscriptions/:id', subController.updateById);
router.delete('/subscriptions/:id', subController.deleteById);

// router.post('/signals', signalController.processSignal);

// router.get('/signallog', signalLogController.findRecent);

module.exports = router;
