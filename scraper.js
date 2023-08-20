// This script scrapes the bus route data every 6 hours and saves it to a file.
// This will run as a cron job on a Github Actions server.

import EventSource from "eventsource"
import fetch from "node-fetch"
import DomParser from "dom-parser"
import fs from "fs"
import moment from "moment-timezone"

async function getBusses() {
    // extract all option tags from the dropdown with id "routeSelect" and make an array of the value attribute
    // from node js with a fetch
    const response = await fetch('https://transport.tamu.edu/busroutes.web', {
        signal: AbortSignal.timeout( 10000 ),
      })
    const html = await response.text()

    const parser = new DomParser()
    const document = parser.parseFromString(html)

    var busData = {}

    var allBusses = document.getElementById("all")

    var numbers = allBusses.getElementsByClassName("route-number")
    var names = allBusses.getElementsByClassName("route-text")
    var filtered_names = []

    for (var i = 0; i < names.length; i++) {
        if (!names[i].getAttribute("class").includes("route-number")) {
            // convert &amp; to &
            names[i].textContent = names[i].textContent.replace(/&amp;/g, "&")
            
            filtered_names.push(names[i].textContent)
        }
    }

    for (var i = 0; i < numbers.length; i++) {
        busData[numbers[i].textContent] = {
            name: filtered_names[i],
            color: numbers[i].getAttribute("style").split(":")[1].trim()
        }
    }

    
    return busData
}

function allRoutesExist(busses) {
    for (const bus of Object.keys(busses)) {
        if (busses[bus].routes == undefined) return false
    }
    return true
}


async function getBusData(busses) {

    // Negotiate with server
    const response = await fetch(
        'https://transport.tamu.edu/busroutes.web/timeHub/negotiate?negotiateVersion=1', 
        {method: 'POST'}
    )
    const token = (await response.json()).connectionToken

    const hubEndpoint = "https://transport.tamu.edu/busroutes.web/timeHub?id=" + token

    // connect to sse server
    const es = new EventSource(hubEndpoint)


    // listen for messages
    es.addEventListener("message", async (event) => {
        //cut last charachter off of data
        const dataString = event.data.trim().slice(0, -1)
        
        const data = JSON.parse(dataString)
        if (data.type == 3 && data.result) {
            console.log("Received data for bus " + data.invocationId )
            busses[data.invocationId].routes = data.result.jsonTimeTableList
        }
    })

    // wait 500ms
    await new Promise(r => setTimeout(r, 500))

    // send handshake
    const handshake = await fetch(hubEndpoint, {method: 'POST', body: `{"protocol":"json","version":1}`})

    // send heartbeat every 5 seconds
    var hb = setInterval(async () => {
        await fetch(hubEndpoint, {method: 'POST', body: `{"type":6}`})
    }, 5000)


    var date = moment().tz("America/Chicago").format("YYYY-MM-DD")

    // send request for each bus
    for (const bus of Object.keys(busses)) {
        await fetch(hubEndpoint, {method: 'POST', body: `{"arguments":["${bus}", "${date}"],"invocationId":"${bus}","target":"GetTimeTable","type":1}`})
        // delay 100ms
        await new Promise(r => setTimeout(r, 250))
    }
    
    // wait 15 seconds
    var startTime = new Date().getTime()
    var masterTime = new Date().getTime()

    // wait for key for last bus to exits
    while (!allRoutesExist(busses) && new Date().getTime() - masterTime < 15000) {
        await new Promise(r => setTimeout(r, 1000))

        // if it has been 5 seconds, resend requests that have not been answered
        if (new Date().getTime() - startTime > 5000) {
            console.log("Resending requests")
            for (const bus of Object.keys(busses)) {
                if (!busses[bus].routes) {
                    await fetch(hubEndpoint, {method: 'POST', body: `{"arguments":["${bus}", "${date}"],"invocationId":"${bus}","target":"GetTimeTable","type":1}`})
                    // delay 250ms
                    await new Promise(r => setTimeout(r, 250))
                }
            }
            startTime = new Date().getTime()
        }
    }

    // write data to file
    console.log("Writing data to file")
    fs.writeFileSync('data.json', JSON.stringify(busses))


    // send request for data
    es.close()
    clearInterval(hb)

}

getBusses()
    .then((busses) => getBusData(busses))
