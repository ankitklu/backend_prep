const express= require('express')
const app = express()
const proxy = require('express-http-proxy')

app.use('/stress-test', proxy('http://localhost:3002'))

// if this service is run on a different server, we need to do "PORT FORWARDING" by navigating to the Ports option in the 
//navigation bar and then adding the port number of the service we want to forward the request to
//we can also use the ip address of the server to forward the request to

app.use('/index', proxy('http://localhost:3001'))