var dnode = require('dnode');
var EventEmitter = require('events').EventEmitter;

var fs = require('fs');
var freestyle = require('freestyle');
var s = fs.createReadStream(process.argv[3]);

freestyle(s, function (r) {
    dnode({ name : process.argv[2] }).connect(8081, session.bind({}, r));
});

function session (r, remote, conn) {
    var em = new EventEmitter;
    
    var lastMsg = null;
    
    em.on('rap', function (name, msg) {
        console.log('<' + name + '> ' + msg);
        lastMsg = msg;
    });
    
    em.on('round', function (name, msg) {
        lastMsg = null;
    });
    
    remote.watch(em.emit.bind(em));
    
    function challenge (cb) {
        cb(r.prose(lastMsg, 10))
    }
    
    remote.rap(challenge, function (err) {
        if (err) {
            console.error(err);
            conn.end();
        }
        else console.log('ready')
    });
}
