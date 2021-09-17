const { application } = require('express')
const express = require('express')
const app = express()

app.set('set engine', 'ejs')

app.get('/', (req, res) => {
    res.render('ejs/index.ejs', {name: 'Klau'})
})

app.use(express.static('views'));
app.use(express.static('assets'))

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/home.html')
})



app.listen(3000)