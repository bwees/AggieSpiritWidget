
Array.prototype.forEachAsyncParallel = async function (fn) {
    await Promise.all(this.map(fn));
}

function Time(hour, minute) {
    this.hour = hour
    this.minute = minute
}

String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function decodeConfig(config) {
    var buses = config.split("&")
    var busConfigs = []
    buses.forEach((bus) => {
        var busId = bus.split("|")[0].split(",")[0]
        var switchPos = bus.split("|")[0].split(",")[1] == "R" ? 1 : 0
        var stopIds = bus.split("|")[1].split(",")
        busConfigs.push({busId: busId, stopIds: stopIds, switchPos: switchPos})
    })

    return busConfigs
}

function findNextTime(table) {
    // find 2d index of the first cell that is not "Past"
    for (var i=0; i<table.length; i++) {
        for (var j=0; j<table[i].length; j++) {
            if (table[i][j] != "Past" && (new Date(table[i][j]))) {
                return [i,j]
            }
        }
    }
}

function timeBlock(parent, time, color) {
    let tbMain = parent.addStack()
    tbMain.layoutHorizontally()
    tbMain.centerAlignContent()
    tbMain.setPadding(0, 0, 0, 0)
    tbMain.addSpacer()

    let tb = tbMain.addStack()
    tb.centerAlignContent()
    tb.size = new Size(42, 18)

    tb.backgroundColor = color
    tb.cornerRadius = 5
    
    if (typeof time == "string") {
        var timeText = time
    } else {
        var timeText = ""

        timeText = ""
        timeText += (time.hour > 12 ? time.hour - 12 : time.hour)
        timeText += ":"
        timeText += time.minute.toString().padStart(2, "0")
    }

    var text = tb.addText(timeText)
    text.font = Font.boldSystemFont(11)
    text.centerAlignText()
    text.textColor = Color.black()

    tbMain.addSpacer()
}

async function getBusData() {
    return await new Request("https://gist.githubusercontent.com/bwees/4e75c40adb4806b4db688ddb550a727f/raw/data.json").loadJSON()
}

async function main() {

    var bussesData = await getBusData()

    // GET DATA
    // Bus Config Format
    // First: 0 padded bus ID Number
    // Seperate with , (comma)
    // Second: L or R for switch position
    // Seperate with | (pipe)
    // Comma Seperated: 0 indexed stop number (ignore the last stop in table)
    // Seperate with & (ampersand)
    // Repeat for each bus, max 3 for large, 1 for Medium

    if (config.runsInApp) var busConfig = "07,L|0,1"//&12,R|0,1,2&08,R|0,1"
    if (config.runsInWidget) var busConfig = args.widgetParameter


    var buses = decodeConfig(busConfig)

    if (config.widgetFamily == "large" || config.runsInApp) {
        // truncate to first 3 buses
        buses = buses.slice(0, 3)
    } else {
        // truncate to first bus
        buses = buses.slice(0, 1)
    }


    var timetables = {}

    await buses.forEachAsyncParallel(async (bus) => {
        // // load the URL into a webview
        // const rq = new Request('https://tsapp.transport.tamu.edu/busroutes.api/api/route/' + bus.busId + '/TimeTable/' + getTodayString())
        // rq.headers = {"Authorization": apiKey}

        // var tableData = (await rq.loadJSON()).jsonTimeTableList
        var busData = bussesData[bus.busId]
        
        if (busData.routes.length == 1) bus.switchPos = 0
        var busTable = busData.routes[bus.switchPos].html

        // If the time table is empty
        if (busTable.includes("No Service Is Scheduled For This Date")) {
            timetables[bus.busId] = {next: ["No Service"], name: busData.name, color: busData.color, following: ["No Service"], stopNames: ["No Service"]}
            return
        }
        
        
        var timetable = "<table>" + busTable + "</table>"


        var wv = new WebView()
        wv.loadHTML(timetable)
        await wv.waitForLoad()

        let js = `
            const table = document.getElementsByTagName("table")[0]
            var now = new Date()

            var tableArray = Array.from(table.rows).map((row) => Array.from(row.cells).map((cell) => {
                if (cell.firstChild) {
                    var leaveTime = new Date(cell.firstChild.dateTime);
                    if (leaveTime < now) {
                        return "Past"
                    }
                }
                return (cell.firstChild) ? leaveTime : cell.innerText
            }))
            tableArray.shift()

            // get stop names from tHead
            var stopNames = Array.from(table.tHead.rows[0].cells).map((cell) => cell.innerText)

            // append stop names to beginning of table
            tableArray.unshift(stopNames)


            tableArray
        `

        var tmpTable = await wv.evaluateJavaScript(js)        
        var stopNames = tmpTable.shift()
        
        // convert to Time objects, keep 2d array structure
        var table = tmpTable.map((row) => row.map((cell) => {
            if (cell != "Past") {
                var t = new Date(cell)

                if (t.toString() == "Invalid Date") {
                    return "Past"
                }
                
                return new Time(t.getHours(), t.getMinutes())
            } else {
                return "Past"
            }
        }))


        var nextTime = findNextTime(table)
        var next = []
        var following = []

        bus.stopIds.forEach((stopId) => {
            // if table is empty
            if (!nextTime) {
                next.push("N/A")
                following.push("N/A")
                return
            }

            var offset = 0
            while (typeof(table[nextTime[0]+offset][stopId]) == 'string' && offset < 5) {
                offset++
                if (!(table[nextTime[0]+offset])) {
                    next.push("N/A")
                    following.push("N/A")
                    return
                }
            }
            
            if (offset == 5) {
                next.push("N/A")
                following.push("N/A")
                return
            }
            
            if (table[nextTime[0]+offset] && !(typeof(table[nextTime[0]+offset][stopId]) == 'string')) {
                next.push(table[nextTime[0]+offset][stopId])
                // verify there is a row after the nextTime[0]+1
                if (table[nextTime[0]+offset+1]) {
                    following.push(table[nextTime[0]+offset+1][stopId])
                }
            }
        })

        // if all times are "N/A" then the bus is not running
        if (next.every((time) => time == "N/A")) {
            next = ["No Service"]
            following = ["No Service"]
        }
    
        timetables[bus.busId] = {next: next, name: busData.name, color: busData.color, following: following, stopNames: stopNames}
        
    })

    // DRAW WIDGET
    const widget = new ListWidget()
    widget.backgroundColor = new Color("#1c1c1e")
    widget.setPadding(16, 16, 16, 16)


    buses.forEach((bus, x) => {
        var timetable = timetables[bus.busId]

        var busStack = widget.addStack()
        busStack.size = new Size(0, 90)
        busStack.layoutVertically()
        busStack.url = "https://transport.tamu.edu/busroutes.web/Routes?r=" + bus.busId
        
        // TITLE
        var busTitle = busStack.addStack()
        busTitle.layoutHorizontally()
        busTitle.centerAlignContent()
        
        // Colored Square
        var busColor = busTitle.addStack()
        busColor.backgroundColor = new Color(timetable.color)
        busColor.cornerRadius = 4
        busColor.setPadding(0, 0, 0, 0)
        busColor.size = new Size(28, 28)
        busColor.centerAlignContent()
        
        var busNumber = busColor.addText(bus.busId)
        busNumber.font = Font.boldSystemFont(14)
        busNumber.minimumScaleFactor = 0.5
        
        busTitle.addSpacer(8)
        
        // Title
        var busName = busTitle.addText(timetable.name)
        busName.font = Font.boldSystemFont(16)
        busTitle.addSpacer()
        
        
        
        // TABLE
        var table = busStack.addStack()
        table.layoutHorizontally()
        table.setPadding(0, 28, 0, 0)
        table.centerAlignContent()

        if (timetable.next[0] == "No Service") {
            table.addSpacer()
            var noService = table.addText("No Service Scheduled for Today")
            noService.font = Font.systemFont(14)
            noService.textColor = Color.gray()
            table.addSpacer()
            busStack.addSpacer()
            return
        }

        bus.stopIds.forEach((stopId, i) => {
            var next = timetable.next[i]
            var following = timetable.following[i]

            var stopStack = table.addStack()
            stopStack.layoutVertically()
            // stopStack.size = new Size(90, 0)
            stopStack.centerAlignContent()
            stopStack.spacing = 0

            var stopNameStack = stopStack.addStack()
            stopNameStack.layoutHorizontally()
            stopNameStack.centerAlignContent()

            stopNameStack.addSpacer()
            var stopName = stopNameStack.addText(timetable.stopNames[stopId])
            stopName.centerAlignText()
            stopName.font = Font.systemFont(12)
            stopName.textColor = new Color("#BCBCC2")
            // stopName.size = new Size(90, 0)
            stopName.lineLimit = 1
            stopNameStack.addSpacer()
            
            stopStack.addSpacer(4)
            
            timeBlock(stopStack, next, new Color("#63D876"))
            stopStack.addSpacer(4)


            if (following)  {
                timeBlock(stopStack, following, Color.gray())

            } else {
                timeBlock(stopStack, "N/A", Color.gray())
            }
        })

        if (x != buses.length-1) {
            widget.addSpacer(8)
        }
    })

    widget.addSpacer(10)
    var stack = widget.addStack()
    stack.addSpacer()
    let df = new DateFormatter()
    df.useNoDateStyle()
    df.useShortTimeStyle()

    var locT = stack.addText("Last Updated: " + df.string(new Date()))
    locT.font = Font.systemFont(12)
    locT.textColor = Color.gray()

    stack.addSpacer()

    if (config.runsInApp) widget.presentLarge()
    else if (config.runsInWidget) Script.setWidget(widget)
}

module.exports = {
    main
};