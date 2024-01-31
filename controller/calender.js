const express = require('express')
const { authorize } = require('../utils/utils')
const { google } = require('googleapis');

const getFreeTime = (req, res ) => 
{
    async function getFreeBusyTime(auth) 
    {
        try {
            const calendar = google.calendar({ version: 'v3', auth });

            const response = await calendar.freebusy.query(
                {
                key: process.env.API_KEY,
                requestBody: {
                    timeMin: req.body.timeMin,
                    timeMax: req.body.timeMax,
                    items: [
                        {
                            "id": req.body.id
                        }
                    ]

                },
            });

            const calendarId = req.body.id;
            const busyTime = response.data.calendars[calendarId].busy;

            if (!busyTime || busyTime.length === 0) 
            {
                console.log('No busy time found.');
                return res.status(200).json('No Busy Time Found');
            }

            busyTime.sort((a, b) => new Date(a.start) - new Date(b.start));

            let freeTime = [{
                start: req.body.timeMin,
                end: req.body.timeMax
            }];

            busyTime.forEach(busyPeriod => 
                {
                const busyStart = new Date(busyPeriod.start).toISOString();
                const busyEnd = new Date(busyPeriod.end).toISOString();

                freeTime = freeTime.reduce((result, freePeriod) => 
                {
                    const freeStart = new Date(freePeriod.start).toISOString();
                    const freeEnd = new Date(freePeriod.end).toISOString();

                    if (busyStart >= freeEnd || busyEnd <= freeStart) 
                    {
                        result.push(freePeriod);
                    } 
                    else 
                    {
                        if (busyStart > freeStart) {
                            result.push({
                                start: freeStart,
                                end: busyStart
                            });
                        }
                        if (busyEnd < freeEnd) {
                            result.push({
                                start: busyEnd,
                                end: freeEnd
                            });
                        }
                    }

                    return res.status(200).json(result);
                }, []);
            });

            return freeTime;
        } catch (error) 
        {
            console.error('Error in getFreeBusyTime:', error.message);
            throw error;
        }
    }

    authorize().then(getFreeBusyTime).catch(console.error);
}

module.exports = { getFreeTime } 