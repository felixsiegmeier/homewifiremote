require("dotenv").config()
const express = require("express")
const ejs = require("ejs")
const mqtt = require('mqtt')
const bodyParser = require("body-parser")
const client  = mqtt.connect({host: '192.168.178.200', port: 1883})

app = express()
app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))

////////////////////////////// MQTT Stuff //////////////////////////////

const bettlicht = {
	staus: "0",
	helligkeit: "42"
}

client.on('connect', function () {
  client.subscribe('bettlicht/helligkeit', () => {console.log("subscribed to bettlicht/helligkeit")})
  client.subscribe('bettlicht/status', () => {console.log("subscribed to bettlicht/status")})
  client.subscribe('bettlicht/switch', () => {console.log("subscribed to bettlicht/switch")})
})

client.publish('bettlicht/get', '1')

client.on('message', function (topic, message) {
  // message is Buffer
  if(topic == "bettlicht/status" || topic == "bettlicht/switch"){
  	console.log("got status "+message.toString())
  	bettlicht.status = message.toString()
  }
  if(topic == "bettlicht/helligkeit"){
  	console.log("got helligkeit "+message.toString())
  	bettlicht.helligkeit = message.toString()
  }
})

////////////////////////////// Routing //////////////////////////////

app.get("/", (req, res) => {
	res.render("index", {bett: bettlicht})
})

app.post("/bettlicht", (req, res)=>{
	res.sendStatus(200)
	key = Object.keys(req.body)[0]
	value = req.body[key]
	client.publish("bettlicht/"+key, value)
})

app.listen(4000, () => {
	console.log("Server up and running")
})