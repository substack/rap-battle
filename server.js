var express = require('express');
var app = express.createServer();
app.use(express.static(__dirname + '/static'));
app.listen(8080);

var browserify = require('browserify');
app.use(browserify({
    require : [ 'dnode' ]
}));

var EventEmitter = require('events').EventEmitter;
var Hash = require('hashish');
var Seq = require('seq');
var dnode = require('dnode');

var watchers = {};
var competitors = {};

var contest = {
    emit : function () {
        var args = arguments;
        Hash(watchers).forEach(function (w) {
            w.apply(null, args);
        });
    },
    round : function (round, cb) {
        contest.emit('round', round);
        
        var names = Object.keys(competitors);
        
        Seq.ap(names)
            .seqEach_(function (next, name) {
                competitors[name].challenge(function (msg) {
                    contest.emit('rap', name, msg);
                    next();
                });
            })
            .seq(cb)
        ;
    },
};

dnode(function (client, conn) {
    this.watch = function (emit) {
        watchers[conn.id] = emit;
        
        conn.on('end', function () {
            delete watchers[conn.id];
        });
    };
    
    this.rap = function (challenge, cb) {
        if (battling) {
            cb('A battle is already in progress');
        }
        else if (competitors[client.name]) {
            cb('A client by that name is already competing');
        }
        else if (!client.name) {
            cb('Specify a client.name');
        }
        else {
            competitors[client.name] = {
                challenge : challenge,
                name : client.name,
            };
            
            conn.on('end', function () {
                contest.emit('quit', client.name);
                delete competitors[client.name];
            });
            
            cb(null);
        }
    };
    
    var battling = false;
    
    this.battle = function (secret, cb) {
        if (secret !== 'secretsauce') {
            cb('ACCESS DENIED');
        }
        else if (Hash(competitors).length < 2) {
            cb('Not enough competitors');
        }
        else {
            contest.emit('begin', Object.keys(competitors));
            battling = true;
            
            Seq(0,1,2,3,4)
                .seqEach(function (round) {
                    contest.round(round, this.ok);
                })
                .seq(function () {
                    battling = false;
                    contest.emit('end');
                })
            ;
            cb(null);
        }
    };
}).listen(8081).listen(app);
