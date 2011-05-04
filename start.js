var dnode = require('dnode');
var EventEmitter = require('events').EventEmitter;

dnode.connect(8081, function (remote, conn) {
    remote.battle('secretsauce', function (err) {
        if (err) console.error(err)
        else console.log('ok')
        
        conn.end();
    });
});
