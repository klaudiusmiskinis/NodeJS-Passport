require('dotenv').config()
const { application } = require('express')
const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
const initializePassport = require('./passport-config')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const app = express()

initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

let users = []

app.set('set engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static('views'));
app.use(flash())
app.use(session({
    secret: process.env.KEY_SESSION,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
    res.render('ejs/index.ejs', {name: req.user.name})
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('ejs/login.ejs')
})

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('ejs/register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        let user = {
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
        user.password = await bcrypt.hash(user.password, 10)
        console.log(user)
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

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

app.listen(3000, () => {
    console.log('Servidor', 'ON')
})