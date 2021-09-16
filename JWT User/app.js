let express = require('express');
let session = require('express-session');
let bodyParser = require('body-parser');
let path = require('path');
const { connect } = require('http2');
const { response, json } = require('express');
let app = express()
let data = {}

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use(express.static("login"));

app.get('/', function(req, res) {
    res.setHeader("Content-Type", "text/html");
    res.sendFile(path.join(__dirname + '/login/login.html'))
})

app.post('/auth', (req, res) => {
    let user = req.body.username;
    let pass = req.body.password;
    let confirm = {
        user: 'asd',
        pass: '123'
    }
    if (user && pass) {
        if(user == confirm.user && pass == confirm.pass) {
            req.session.loggedin = true;
            req.session.username = user;
            data = confirm
            res.redirect('/home')
        } else {
            res.send('Datos incorrectos')
        }   
    } else {
        res.send('Introduce un usuario y contraseña')
    }
    res.end()
})

app.get('/data', (req, res) => {
    console.log(data)
    res.json(data)
});

app.get('/home', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname + '/login/user.html'))
    } else {
        res.redirect('/')
    }
})

app.get('/login.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/login/login.js'))
})

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:3000`)
})
  