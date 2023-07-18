// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: bus;
// 

Array.prototype.forEachAsyncParallel = async function (fn) {
    await Promise.all(this.map(fn));
}

function Time(hour, minute) {
    this.hour = hour
    this.minute = minute
}

function decodeConfig(config) {
    var buses = config.split("&")
    var busConfigs = []
    buses.forEach((bus) => {
        var busId = bus.split("|")[0]
        var stopIds = bus.split("|")[1].split(",")
        busConfigs.push({busId: busId, stopIds: stopIds})
    })

    return busConfigs
}

function findNextTime(table) {
    // find 2d index of the first cell that is not "Past"
    for (var i=0; i<table.length; i++) {
        for (var j=0; j<table[i].length; j++) {
            if (table[i][j] != "Past") {
                return [i,j]
            }
        }
    }
}

function colorNameToHex(color)
{

    if (color.includes("rgb")) {
        // convert rgb to hex
        var rgb = color.split("(")[1].split(")")[0].split(",")
        var r = parseInt(rgb[0])
        var g = parseInt(rgb[1])
        var b = parseInt(rgb[2])
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)

    }

    var colors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

    return colors[color.toLowerCase()];
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

// GET DATA
// Bus Config Format
// First: 0 padded bus ID Number
// Seperate with | (pipe)
// Second: 0 indexed stop number (ignore the last stop in table)
// Seperate with & (ampersand)
// Repeat for each bus, max 3 for large, 1 for Medium

if (config.runsInApp) var busConfig = "07|1,2,3&47-48|3,2,4&08|0"
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

var routeInfo = await (new Request("https://transport.tamu.edu/BusRoutesFeed/api/Routes")).loadJSON()

await buses.forEachAsyncParallel(async (bus) => {
    // load the URL into a webview
    const rq = new Request('https://transport.tamu.edu/BusRoutes/Routes.aspx?r=' + bus.busId)

    var wv = new WebView()
    wv.loadRequest(rq)
    await wv.waitForLoad()

    let js = `


        const table = document.getElementById("TimeTableGridView")

        var tableArray = Array.from(table.rows).map((row) => Array.from(row.cells).map((cell) => {
            // if the cell is not a past leave time and is not empty
            if (!(cell.firstChild.className && cell.firstChild.className.includes("PastLeaveTime")) && cell.innerText.trim() != "") {
                var t = new Date(cell.firstChild.dateTime)
                return (cell.firstChild.dateTime) ? t : cell.innerText
            } else {
                return "Past"
            }

        }))

        tableArray.shift()
        tableArray
    `

    var tmpTable = await wv.evaluateJavaScript(js)
    wv = undefined

    var routeData

    routeInfo.forEach((route) => {        
        if (route.ShortName == bus.busId) {
            routeData = route
        }
    })

    
    if (tmpTable[0][0] == "No Service Is Scheduled For This Date") {
        timetables[bus.busId] = {next: ["No Service"], name: routeData.Name, color: routeData.Color, following: ["No Service"], stopNames: ["No Service"]}
        return
    }

    var stopNames = tmpTable.shift()
    
    // convert to Time objects, keep 2d array structure
    var table = tmpTable.map((row) => row.map((cell) => {
        if (cell != "Past") {
            var t = new Date(cell)
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
   
    timetables[bus.busId] = {next: next, name: routeData.Name, color: routeData.Color, following: following, stopNames: stopNames}
    
})


// DRAW WIDGET
const widget = new ListWidget()
widget.backgroundColor = new Color("#1c1c1e")
widget.setPadding(16, 16, 16, 16)

console.log(timetables)

buses.forEach((bus, x) => {
    var timetable = timetables[bus.busId]

    
    
    var busStack = widget.addStack()
    busStack.size = new Size(0, 90)
    busStack.layoutVertically()
    
    // TITLE
    var busTitle = busStack.addStack()
    busTitle.layoutHorizontally()
    busTitle.centerAlignContent()
    
    // Colored Square
    var busColor = busTitle.addStack()
    busColor.backgroundColor = new Color(colorNameToHex(timetable.color))
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