require('dotenv').config()

const express = require('express')
const cors = require('cors');

const { calendarRoutes } = require( './routes/calendarRoutes')

const app = express()

app.use(express.json())

app.use(cors());

app.use('/', calendarRoutes)

app.listen(4000, () => {
    console.log('Server is listening')
})


