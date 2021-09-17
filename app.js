const { application } = require('express')
const express = require('express')
const app = express()
app.get('/', (req, res) => {
    res.render('ejs/index.ejs', {name: 'Klau'})
})

app.use(express.urlencoded({ extended: false}))
app.use(express.static('views'));
app.use(express.static('assets'))
app.set('set engine', 'ejs')

app.get('/login', (req, res) => {
    res.render('ejs/login.ejs')
})

app.post('/register', (req, res) => {
    req.body.name
})

app.get('/register', (req, res) => {
    res.render('ejs/register.ejs')
})

app.listen(3000)