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
    round : function (cb) {
        Seq.ap(competitors)
            .seqEach_(function (next, competitor) {
                competitor.challenge(function (msg) {
                    context.emit('rap', competitor.name, msg);
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
        if (competitors[client.name]) {
            cb('A client by that name is already competing');
        }
        else {
            competitors[client.name] = {
                challenge : challenge,
                name : client.name,
            };
            
            conn.on('end', function () {
                contest.emit('quit', client.name);
            });
        }
    };
    
    this.battle = function (secret, cb) {
        if (secret !== 'secretsauce') {
            cb('ACCESS DENIED');
        }
        else if (Hash(competitors).length < 2) {
            cb('Not enough competitors');
        }
        else {
            contest.emit('begin');
            Seq.ap(Array(5))
                .seqEach(function () {
                    contest.round(this.ok);
                })
                .seq(function () {
                    contest.emit('end');
                })
            ;
            cb(null);
        }
    };
}).listen(8081).listen(app);
