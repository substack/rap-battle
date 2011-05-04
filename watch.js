var dnode = require('dnode');
var EventEmitter = require('events').EventEmitter;

dnode.connect(8081, function (remote, conn) {
    var em = new EventEmitter;
    
    em.on('battle', function (competitors) {
        console.log('Rap battle started');
        console.log('Competitors: ' + competitors.join(', '));
        console.log('----');
    });
    
    em.on('round', function (round) {
        console.log('---');
    });
    
    em.on('end', function () {
        console.log('---\nBattle finished.');
    });
    
    em.on('rap', function (name, msg) {
        console.log('<' + name + '> ' + msg);
    });
    
    remote.watch(em.emit.bind(em));
});
