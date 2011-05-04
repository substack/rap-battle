var dnode = require('dnode');
var EventEmitter = require('events').EventEmitter;

dnode.connect(8081, function (remote, conn) {
    var em = new EventEmitter;
    
    em.on('rap', function (name, msg) {
        console.log('<' + name + '> ' + msg);
    });
    
    remote.watch(em.emit.bind(em));
});
