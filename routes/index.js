var express = require('express');
var router = express.Router();
// sinh viên bổ sung đường kết nối tới mongoDB của mình vào dòng 4
var dbConnect = '';
// getting-started.js
const mongoose = require('mongoose');
mongoose.connect(dbConnect, {useNewUrlParser: true, useUnifiedTopology: true});

var multer = require('multer');
var upload = multer({
    dest: 'uploads/'
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('connected')
});

var user = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    address: String,
    number_phone: String
})
/* GET home page. */
router.get('/', upload.single('avatar'), function (req, res, next) {
    var userConnect = db.model('users', user);

    userConnect.find({}, function (error, users) {
        var type = 'home';
        try {
            type = req.query.type;
        } catch (e) {
        }
        if (error) {
            res.render('index', {title: 'Express : ' + error});
            return
        }
        if (type == 'json') {
            res.send(users)
        } else {
            res.render('index', {title: 'Express', users: users});
        }

    })
});

router.post('/insertUser', upload.single('avatar'), function (req, res) {
    var userConnect = db.model('users', user);
    userConnect({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        address: req.body.address,
        number_phone: req.body.number_phone,
        avatar: req.file.filename
    }).save(function (error) {
        if (error) {
            res.render('index', {title: 'Express : Error!!!!'});
        } else {
            res.render('index', {title: 'Express : Success!!!!'});
        }
    })
})

module.exports = router;
