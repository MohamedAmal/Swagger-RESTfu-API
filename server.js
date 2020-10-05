var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var fs = require("fs");
app.use(express.json())

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json');

var fileName = './users.json';
var file = require(fileName);
file.key = "new value";
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// List Users
app.get('/listUsers', function (req, res) {
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
        console.log(data);
        res.end(data);
    });
})

// Get a user
app.get('/getUser/:id', function (req, res) {
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
        data = JSON.parse(data);
        var id = req.params.id
        var user = data["user" + id]
        res.end(JSON.stringify(user));
    });
})
// Add user
app.post('/addUser', function (req, res) {
    // First read existing users.
    fs.readFile(__dirname + "/" + "users.json", 'utf8', async function (err, data) {
        data = JSON.parse(data);
        var arr = Object.keys(data)
        var count = data[arr[arr.length - 1]]["id"] + 1
        const user = {
            name: req.body.name,
            password: req.body.password,
            profession: req.body.profession,
            id: count
        };
        console.log('this is count' + count)
        data[`user${count}`] = user;
        // data.push(user)
        console.log(data);
        res.end(JSON.stringify(data));
        let dat = await fs.writeFileSync(fileName, JSON.stringify(data));
        console.log(dat)
    });
})

//Update user
app.put('/updateUser/:id', function (req, res) {
    // First read existing users.
    fs.readFile(__dirname + "/" + "users.json", 'utf8', async function (err, data) {
        data = JSON.parse(data);
        var id = req.params.id
        data[`user${id}`]['name'] = req.body.name
        data[`user${id}`]['password'] = req.body.password
        data[`user${id}`]['profession'] = req.body.profession
        data[`user${id}`]['id'] = id

        console.log(data);
        res.end(JSON.stringify(data));
        let dat = await fs.writeFileSync(fileName, JSON.stringify(data));
        console.log(dat)
    });
})

// Delete User
app.delete('/deleteUser/:id', function (req, res) {
    // First read existing users.
    fs.readFile(__dirname + "/" + "users.json", 'utf8', async function (err, data) {
        data = JSON.parse(data);
        var id = req.params.id
        delete data["user" + id]

        console.log(data);
        res.end(JSON.stringify(data));
        let dat = await fs.writeFileSync(fileName, JSON.stringify(data));
        console.log(dat)
    });
})

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// var server = app.listen(8000, function () {
//     var host = 'localhost'
//     var port = server.address().port
//     console.log("Example app listening at http://%s:%s", host, port)
// })

// const PORT = process.env.PORT || 3000 
// app.listen(PORT, () => console.log(`Listening on ${PORT}`))

var server = app.listen(process.env.PORT || 8000, function () {
    var port = server.address().port;
    console.log("http://localhost:", port);
  });

// const PORT = 'http://localhost:8000'