var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('../server/db');
var User = mongoose.model('User');
var Cell = mongoose.model('Cell');
var Row = mongoose.model('Row');
var ColumnIndex = mongoose.model('ColumnIndex');

var wipeCollections = function () {
    var removeUsers = User.remove({});
    return Promise.all([
        removeUsers
    ]);
};


var seedUsers = function () {

    var users = [
        {
            "name": "testing",
            "username": 'testing',
            "password": 'test',
            "collections": ["women","for_the_home"],
            "locked": false,
            "lead": true
        },
        {
            "name": "mallory_admin",
            "username": 'admin',
            "password": 'test',
            "locked": false,
            "lead": true,
            "type": "admin"
        },
        {
            "name": "developer_admin",
            "username": 'admin',
            "password": 'test',
            "locked": false,
            "lead": true,
            "type": "admin"
        },
        {
            "name":"Alexa Amato",
            "password": 'alexa23',
            "username":"alexaa",
            "type":"buying",
            "collections": ["shoes"],
            "locked":false,
            "lead": true
        },
        {
            "name":"shoebuying",
            "password": 'shoeb77',
            "username":"shoebuying",
            "type":"buying",
            "collections":["shoes"],
            "locked":false,
            "lead": true
        },
        {
            "name":"Kelsey Monahan",
            "password": 'kelseym31',
            "username":"kelseym",
            "type":"buying",
            "collections":["beauty"],
            "locked":false,
            "lead": true
        },
        {
            "name":"Carole Dempsey ",
            "password": 'caroled54',
            "username":"caroled",
            "type":"buying",
            "collections":["jewlery&watches"],
            "locked":false,
            "lead": true
        },
        {
            "name":"jewelrywatchbuying",
            "password": 'jwb97',
            "username":"jewelrywatchbuying",
            "type":"buying",
            "collections":["jewlery&watches"],
            "locked":false,
            "lead": true
        },
        {
            "name":"Tammy Blum",
            "password": 'tammyb74',
            "username":"tammyb",
            "type":"buying",
            "collections":["handbags&accessories"],
            "locked":false,
            "lead": true
        },
        {
            "name":"Allyson Luray ",
            "password": 'allysonl68',
            "username":"allysonl",
            "type":"buying",
            "collections":["handbags&accessories"],
            "locked":false,
            "lead": true
        },
        {
            "name":"handbagiabuying",
            "username":"handbagiabuying",
            "password": 'hiab27',
            "type":"buying",
            "collections":["shoes"],
            "locked":false,
            "lead": true
        },
        {
            "name":"Rachel Caplan",
            "username":"rachelc",
            "password": 'rachelc44',
            "type":"buying",
            "collections":[""],
            "locked":false,
            "lead": true
        },
        {
            "name":"rtwbuying",
            "username":"rtwbuying",
            "password": 'rtwbuying67',
            "type":"buying",
            "collections":[""],
            "locked":false,
            "lead": true
        },
        {
            "name":"Cheryl Ferrara",
            "username":"cherylf",
            "password": 'cherylf53',
            "type":"buying",
            "collections":[""],
            "locked":false,
            "lead": true
        },
        {
            "name":"Victoria Martin",
            "username":"victoriam",
            "password": 'victoriam81',
            "type":"buying",
            "collections":[""],
            "locked":false,
            "lead": true
        },
        {
            "name":"Thao Uong",
            "username":"thaou",
            "password": 'thaou27',
            "type":"buying",
            "collections":["juniors"],
            "locked":false,
            "lead": true
        },
        {
            "name":"specialsizebuying",
            "username":"specialsizebuying",
            "password": 'specialsizeb31',
            "type":"buying",
            "collections":["juniors"],
            "locked":false,
            "lead": true
        },
        {
            "name":" Colleen Mcnally",
            "username":"colleenm",
            "password": 'colleenm28',
            "type":"buying",
            "collections":["men"],
            "locked":false,
            "lead": true
        },
        {
            "name":"Kelli Kinkella",
            "username":"kellik",
            "password": 'kellik47',
            "type":"buying",
            "collections":["men"],
            "locked":false,
            "lead": true
        },
        {
            "name":"Jaclyn Butler",
            "username":"jaclynb",
            "password": 'jaclynb36',
            "type":"buying",
            "collections":["men"],
            "locked":false,
            "lead": true
        },
        {
            "name":"Samantha Battline",
            "username":"samanthab",
            "password": 'samanthab61',
            "type":"buying",
            "collections":["men"],
            "locked":false,
            "lead": true
        },
        {
            "name":"mensbuying",
            "username":"mensbuying",
            "password": 'mensb52',
            "type":"buying",
            "collections":["men"],
            "locked":false,
            "lead": true
        },
        {
            "name":"Kathryn Maroon",
            "username":"kathrynm",
            "password": 'kathrynm65',
            "type":"buying",
            "collections":["kids"],
            "locked":false,
            "lead": true
        },
        {
            "name":"kidsbuying",
            "username":"kidsbuying",
            "password": 'kidsb88',
            "type":"buying",
            "collections":["kids"],
            "locked":false,
            "lead": true
        },
        {
            "name":"Kate Hlavacek",
            "username":"kateh",
            "password": 'kateh19',
            "type":"buying",
            "collections":["luggage&accessories"],
            "locked":false,
            "lead": true
        },
        {
            "name":"furnitureluggagebuying",
            "username":"furnitureluggagebuying",
            "password": 'flb37',
            "type":"buying",
            "collections":["luggage&accessories"],
            "locked":false,
            "lead": true
        },
        {
            "name":"Meghan Willis",
            "username":"meghanw",
            "password": 'meghanw23',
            "type":"buying",
            "collections":["for_the_home"],
            "locked":false,
            "lead": true
        },
        {
            "name":"Joy Hua",
            "username":"joyh",
            "password": 'joyh43',
            "type":"buying",
            "collections":["for_the_home"],
            "locked":false,
            "lead": true
        },
        {
            "name":"textilecandytrimbuying",
            "username":"textilecandytrimbuying",
            "password": 'tctb56',
            "type":"buying",
            "collections":["for_the_home"],
            "locked":false,
            "lead": true
        },
        {
            "name":"Jessica Leahy",
            "username":"jessical",
            "password": 'jessical64',
            "type":"buying",
            "collections":["for_the_home"],
            "locked":false,
            "lead": true
        },
        {
            "name":"Amanda Howald",
            "username":"amandah",
            "password": 'amandah98',
            "type":"buying",
            "collections":["for_the_home"],
            "locked":false,
            "lead": true
        },
        {
            "name":"housewaretabletopbuying",
            "username":"housewaretabletopbuying",
            "password": 'htb28',
            "type":"buying",
            "collections":["for_the_home"],
            "locked":false,
            "lead": true
        }
    ];

    return User.create(users);

};

function seedAdmin() {
    var admins = [{
        "name": "mallory_admin",
        "username": 'mallory_admin',
        "password": 'mallory123',
        "locked": false,
        "lead": true,
        "type": "admin"
    },
    {
        "name": "developer_admin",
        "username": 'developer_admin',
        "password": 'test123',
        "locked": false,
        "lead": true,
        "type": "admin"
    }];
    return User.create(admins);
}
connectToDb
    // .then(function () {
    //     // return wipeCollections();
    // })
    .then(function () {
        return Promise.all([seedAdmin()]);
    })
    .then(function (data) {
        console.log(chalk.green('Seed successful!', data.length));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
