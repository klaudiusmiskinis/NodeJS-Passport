//EXPRESS, PASSPORT (FLASH, SESSION), BCRYPT, METHOD-OVERRIDE, EJS, DOTENV, FORMIDABLE, FS
require('dotenv').config()
const { application } = require('express')
const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
const path = require('path')
const initializePassport = require('./passport-config')
const fileupload = require("express-fileupload");
const bodyParser = require('body-parser')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const fs = require('fs');
const app = express()

initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

let users = []

users.push({ 
    id: Date.now().toString(),
    name: 'Klaudijus Miskinis',
    email: 'asd@asd',
    password: bcrypt.hashSync('asd', 10),
    profileImage: '../assets/avatar.png'
})

app.set('set engine', 'ejs')
app.use(express.static(__dirname + '/views/assets'))
app.use(express.urlencoded({ extended: false }))
app.use(express.static('views'));
app.use(express.json())
app.use(fileupload());
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
    let user = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        profileImage: req.user.profileImage
    }
    res.render('ejs/user.ejs', {user: user})
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
            password: req.body.password,
            profileImage: '../assets/avatar.png'
        }
        user.password = await bcrypt.hash(user.password, 10)
        users.push(user)
        res.redirect('/login')
    } catch {
       res.redirect('/register')
    }
})

app.post('/updateProfile', checkAuthenticated, async (req, res) => {
    user = users.find(user => user.id === req.user.id)
    if(req.body.name) {
        console.log(req.body.name)
        user.name = req.body.name
    }

    if(req.body.email) {
        console.log(req.body.email)
        user.email = req.body.email
    }

    if(req.body.password) {
        console.log(req.body.password)
        user.password = await bcrypt.hash(req.body.password, 10)
    }
    
    users.splice(user)
    req.user = user
    users.push(user)
    res.redirect('/')
})


app.post('/upload', checkAuthenticated, async (req, res) => {
    if (req.files.filetoupload.mimetype.substr(0,6) == 'image/') {
        req.files.filetoupload.tempFilePath = __dirname + '/views/assets/' + req.files.filetoupload.name
        req.user.profileImage = '../assets/'+req.files.filetoupload.name
        try {
            await req.files.filetoupload.mv(__dirname + '/views/assets/' + req.files.filetoupload.name) 
        } catch(e){
            console.log(e)
        }
    }
    res.redirect('/')
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

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