require('dotenv').config()
const { application } = require('express')
const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
const initializePassport = require('./passport-config')
const initialize = require('./passport-config')
const flash = require('express-flash')
const session = require('express-session')
const app = express()

initializePassport(passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

let users = []

app.use(express.urlencoded({ extended: false}))
app.use(express.static('views'));
app.set('set engine', 'ejs')
app.use(flash())
app.use(session({
    secret: process.env.KEY_SESSION,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
    res.render('ejs/index.ejs', {name: 'Klau'})
})

app.get('/login', (req, res) => {
    res.render('ejs/login.ejs')
})

app.get('/register', (req, res) => {
    res.render('ejs/register.ejs')
})

app.post('/register', async (req, res) => {
    try {
        console.log(req.body)
        let user = {
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
        user.password = await bcrypt.hash(user.password, 10)
        users.push(user)
        res.redirect('/login')
    } catch {
       res.redirect('/register')
    }
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true

}) )


app.listen(3000, () => {
    console.log('Servidor', 'ON')
})