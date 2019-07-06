var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

var app = express()
var a_port = 9000

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var s_port = 41234

app.use(express.static(__dirname))
app.use(bodyParser.json())

app.listen(a_port, function () {
    console.log("Sample Code for RESTful API run at ", a_port)
})

// ------------------ Schema ------------------

var Schema = mongoose.Schema
mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/WUlighting').then(() => {
    console.log('@@@ Connect Success @@@')
}, () => {
    console.log('!!! Fail to connect !!!')
})

var routingSchema = new Schema({
    rid: { type: String, required: true, unique: true },
    addr: { type: String, required: true },
    port: { type: String, required: true },
    sw: { type: String, required: true },
    ld: { type: String, required: true },
    dt: { type: String, required: true }
})

var nodeSchema = new Schema({
    nid: { type: String, required: true, unique: true },
    rid: { type: String, required: true },
    gid: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    p_name: { type: String },
    dt: { type: String, required: true }
})

var logSchema = new Schema({
    lid: { type: String, required: true, unique: true },
    cmand: { type: String, required: true },
    dt: { type: String, required: true }
})

var groupSchema = new Schema({
    gid: { type: String, required: true, unique: true },
    s_date: { type: String, required: true },
    e_date: { type: String, required: true },
    option: {
        open_day: { type: String, required: true }, //
        s_time: { type: String, required: true },
        e_time: { type: String, required: true }
    },
    dt: { type: String, required: true }
})

var routingDB = mongoose.model('routing', routingSchema)
var nodeDB = mongoose.model('node', nodeSchema)
var logDB = mongoose.model('log', logSchema)
var groupDB = mongoose.model('group', groupSchema)

// ------------------ General ------------------

app.get('/', function (req, res) {
    res.send("Sample Code for RESTful API");
})

// ------------------ Routing ------------------

app.get('/getrouting/:id', function (req, res) {
    if (req.params.id == 'all') {
        routingDB.find({}).then((docs) => {
            res.send(docs)
        }, (err) => {
            res.send(err)
        })
    } else {
        routingDB.find({ rid: req.params.id }).then((docs) => {
            res.send(docs)
        }, (err) => {
            res.send(err)
        })
    }
})

app.post('/postrouting/:id', function (req, res) {
    if (req.params.id == 'add') {
        let buffer = new routingDB({
            rid: req.body.rid,
            addr: req.body.addr,
            port: req.body.port,
            sw: req.body.sw,
            ld: req.body.ld,
            dt: new Date().toLocaleString()
        })
        buffer.save().then((docs) => {
            res.send(docs)
        }, (err) => {
            res.status(400).send(err)
        })
    } else if (req.params.id == 'update') {
        routingDB.update({ rid: req.body.rid }, {
            rid: req.body.rid,
            addr: req.body.addr,
            port: req.body.port,
            sw: req.body.sw,
            ld: req.body.ld,
            dt: new Date().toLocaleString()
        }, (err) => {
            res.send(err)
        })
    }

})

app.get('/delrouting/:id', function (req, res) {
    if (req.params.id == 'all') {
        routingDB.remove({}, () => {
            res.send('Drop complete!')
        })
    } else {
        routingDB.remove({ rid: { $eq: req.params.id } }, () => {
            res.send('Drop complete!')
        })
    }
})

// ------------------ Node ------------------

app.get('/getnode/:id', function (req, res) {
    if (req.params.id == 'all') {
        nodeDB.find({}).then((docs) => {
            res.send(docs)
        }, (err) => {
            res.send(err)
        })
    } else {
        nodeDB.find({ nid: req.params.id }).then((docs) => {
            res.send(docs)
        }, (err) => {
            res.send(err)
        })
    }
})

app.post('/postnode/:id', function (req, res) {
    if (req.params.id == 'add') {
        let buffer = new nodeDB({
            nid: req.body.nid,
            rid: req.body.rid,
            lat: req.body.lat,
            lng: req.body.lng,
            p_name: req.body.p_name,
            dt: new Date().toLocaleString()
        })
        buffer.save().then((docs) => {
            res.send(docs)
        }, (err) => {
            res.status(400).send(err)
        })
    } else if (req.params.id == 'update') {
        nodeDB.update({ nid: req.body.nid }, {
            nid: req.body.nid,
            rid: req.body.rid,
            lat: req.body.lat,
            lng: req.body.lng,
            p_name: req.body.p_name,
            dt: new Date().toLocaleString()
        }, (err) => {
            res.send(err)
        })
    }

})

app.get('/delnode/:id', function (req, res) {
    if (req.params.id == 'all') {
        nodeDB.remove({}, () => {
            res.send('Drop complete!')
        })
    } else {
        nodeDB.remove({ nid: { $eq: req.params.id } }, () => {
            res.send('Drop complete!')
        })
    }
})

// ------------------ Log ------------------

app.get('/getlog/:id', function (req, res) {
    if (req.params.id == 'all') {
        logDB.find({}).then((docs) => {
            res.send(docs)
        }, (err) => {
            res.send(err)
        })
    } else {
        logDB.find({ lid: req.params.id }).then((docs) => {
            res.send(docs)
        }, (err) => {
            res.send(err)
        })
    }
})

app.post('/postlog/:id', function (req, res) {
    if (req.params.id == 'add') {
        let buffer = new logDB({
            lid: req.body.lid,
            cmand: req.body.cmand,
            dt: new Date().toLocaleString()
        })
        buffer.save().then((docs) => {
            res.send(docs)
        }, (err) => {
            res.status(400).send(err)
        })
    } else if (req.params.id == 'update') {
        logDB.update({ lid: req.body.id }, {
            lid: req.body.lid,
            cmand: req.body.cmand,
            dt: new Date().toLocaleString()
        }, (err) => {
            res.send(err)
        })
    }

})

app.get('/dellog/:id', function (req, res) {
    if (req.params.id == 'all') {
        logDB.remove({}, () => {
            res.send('Drop complete!')
        })
    } else {
        logDB.remove({ lid: { $eq: req.params.id } }, () => {
            res.send('Drop complete!')
        })
    }
})

// ------------------ Command ------------------

app.get('/cmand/:node/:com', function (req, res) {
    nodeDB.find({ nid: req.params.node }).then(function (d1) {
        if (Object.keys(d1).length != 0) {
            routingDB.find({ rid: d1[0].rid }).then(function (d2) {
                if (Object.keys(d2).length != 0) {
                    console.log(d2[0].addr + " | " + d2[0].port + " | " + req.params.com)
                    UDPsend(d2[0].addr, d2[0].port, req.params.com)
                }
            })
        } else {
            console.log("Command error!")
        }
    })

})

// ------------------ UDP ------------------

server.on('message', (msg, rinfo) => {
    console.log('server got a message from ' + rinfo.address + ':' + rinfo.port);
    console.log('ASCII: ' + msg);
    if ((msg.slice(4) == "TT") || (msg.slice(4) == "FT") || (msg.slice(4) == "TF") || (msg.slice(4) == "FF")) {
        routingDB.update({ rid: msg.slice(0, 4) }, {
            rid: msg.slice(0, 4),
            addr: rinfo.address,
            port: rinfo.port,
            sw: msg.slice(4, 5),
            ld: msg.slice(5),
            dt: new Date().toLocaleString()
        }, (err) => {
            console.log(err)
        })
    } else if (msg.slice(4) == "AC") {
        console.log(msg.slice(4) + ": ACK")
    }
})

server.on('error', (err) => {
    console.log('server error: \n' + err.stack)
    server.close()
})

server.on('close', () => {
    console.log('Closed.')
})

server.bind(s_port)

function UDPsend(addr, port, msg) {
    var ack = new Buffer(msg)
    server.send(ack, 0, ack.length, port, addr, (err, bytes) => {
        console.log(bytes)
    })
}