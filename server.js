require('dotenv').config();
const express = require('express');
const server = express();
const database = require('./database');
const passport = require('passport');
const methodOverride = require('method-override');

server.use(express.json({ limit: '1mb' }));
server.use(express.urlencoded({ extended: false }));

const flash = require('express-flash');
const session = require('express-session');

const initializePassport = require('./passport-config');
const { transformAuthInfo } = require('passport');
initializePassport(passport);

server.use(express.json());
server.use(express.static('./public/main'));

server.use(flash());
server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
server.use(methodOverride('_method'));

server.use(passport.initialize());
server.use(passport.session());
// Admin routes
server.get('/admin', checkAuthenticatedAdmin);
// Medic Routes
server.get('/medic', checkAuthenticatedMedic);
// Assistant Routes
server.get('/assistant', checkAuthenticatedAssistant);
server.get('/assistant/register', checkAuthenticatedAssistant);
server.get('/assistant/manage', checkAuthenticatedAssistant);
server.get('/login', checkNotAuthenticated);

server
    .get('/user_login/:username/:password', (req, res) => {
        let sql = `SELECT * FROM user_data where binary username='${req.params.username}' and binary password='${req.params.password}'`;
        let query = database.query(sql, (err, result) => {
            if (err) throw err;
            res.end(JSON.stringify(result));
        })
    })
    .post('/login', checkNotAuthenticated, passport.authenticate('local', {
        successRedirect: '/login',
        failureRedirect: '/login',
        failureFlash: true
    }));

server.post('/admin/addnewuser', checkAuthenticatedAdmin, (req, res) => {
    console.log(req.body);
    var sql;
    const newUsr = { id: parseInt(req.body.usr_id), username: req.body.usr_username, password: req.body.usr_password, role: parseInt(req.body.usr_role) };
    const newUsrData = { id: parseInt(req.body.usr_id), name: req.body.usr_name, lname: req.body.usr_lname };
    if (req.body.usr_role == '1') {
        sql = 'INSERT INTO medic_data SET ?';
    }
    if (req.body.usr_role == '2') {
        sql = 'INSERT INTO assistant_data SET ?';
    }
    database.query(sql, newUsrData, (err, result) => {
        if (err) {
            return;
        }
    });
    sql = 'INSERT INTO user_data SET ?';
    database.query(sql, newUsr, (err, result) => {
        if (err) {
            return;
        }
    });
    res.redirect('/admin');
});
server.post('/assistant/register/newcase', checkAuthenticatedAssistant, (req, res) => {
    let sql = 'INSERT INTO cases SET ?';
    let newCase = { name: req.body.name, lname: req.body.lname, idpatient: parseInt(req.body.id), gender: parseInt(req.body.gender), birthdate: req.body.bdate, res_address: req.body.haddress, job_address: req.body.waddress, test_result: parseInt(req.body.tres), test_date: req.body.tdate };
    database.query(sql, newCase, (err, result) => {
        if (err) {
            return;
        }
    });
    res.redirect('/assistant');
});
server.get('/assistant/manage/filter/:id/:name/:cc', checkAuthenticatedAssistant, (req, res) => {
    var options = "";
    plus1 = false;
    if (req.params.id != '0') {
        options = options + ` casecode=${req.params.id}`;
        plus1 = true;
    }
    if (req.params.name != '0') {
        if (plus1) {
            options = options + ` and name='${req.params.name}'`;
        } else {
            options = options + ` name='${req.params.name}'`;
            plus1 = true;
        }
    }
    if (req.params.cc != '0') {
        if (plus1) {
            options = options + ` and idpatient=${req.params.cc}`;
        } else {
            options = options + ` idpatient=${req.params.cc}`;
        }
    }
    let sql = 'select * from cases where' + options;
    database.query(sql, (err, result) => {
        if (err) {
            res.end(JSON.stringify([]));
            return;
        }
        res.end(JSON.stringify(result));
    });
});

server.get('/assistant/manage/states/:id', checkAuthenticatedAssistant, (req, res) => {
    let sql = `Select idcase, state, idstate, state_date From case_state cs, states ss  where cs.idcase=${req.params.id} and cs.idstate=ss.idstates order by state_date`;
    database.query(sql, (err, result) => {
        if (err) {
            res.end(JSON.stringify([]));
            return;
        }
        res.end(JSON.stringify(result));
    });
});
server.get('/assistant/manage/u_states/:id/:state/:date', checkAuthenticatedAssistant, (req, res) => {
    let sql = `INSERT INTO case_state SET ?`;
    let newState = { idcase: parseInt(req.params.id), idstate: parseInt(req.params.state), state_date: req.params.date };
    database.query(sql, newState, (err, result) => {
        if (err) {
            return;
        }
    });
    res.end();
});













// Authentication Functions
function checkAuthenticatedAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.role == 0) {
            server.use("/admin", express.static('./public/admin'));
            return next();
        } else {
            req.logOut();
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
}

function checkAuthenticatedMedic(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.role == 1) {
            server.use("/medic", express.static('./public/medic'));
            return next();
        } else {
            req.logOut();
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
}

function checkAuthenticatedAssistant(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.role == 2) {
            server.use("/assistant", express.static('./public/assistant/main'));
            server.use("/assistant/register", express.static('./public/assistant/register'));
            server.use("/assistant/manage", express.static('./public/assistant/manage'));
            return next();
        } else {
            req.logOut();
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }

}


function checkNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        server.use("/login", express.static('./public/login'));
        return next();
    } else {
        if (req.user.role == 0) {
            res.redirect('/admin');
        }
        if (req.user.role == 1) {
            res.redirect('/medic');
        }
        if (req.user.role == 2) {
            res.redirect('/assistant');
        }
    }

}

// Log Out Method
server.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

server.listen(80);