const express = require('express')
const { getFreeTime } = require('../controller/calender')
const router  = express.Router()

router.post('/getFreeTime' , getFreeTime );

module.exports = { calendarRoutes: router }; 
