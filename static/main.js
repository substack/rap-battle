var $ = require('jquery-browserify');
var dnode = require('dnode');
var EventEmitter = require('events').EventEmitter;

$(window).ready(function () {
    dnode.connect(function (remote) {
        var em = new EventEmitter;
        
        em.on('battle', function (competitors) {
            $('#battle').empty();
            $('#vs').text(competitors.join(' vs '));
            competitors.forEach(function (name) {
                var i = rappers.indexOf(name);
                if (i < 0) rappers.push(name);
            });
        });
        
        var rappers = [];
        
        em.on('join', function (name) {
            rappers.push(name);
            $('#vs').text(rappers.join(' vs '));
        });
        
        em.on('quit', function (name) {
            var i = rappers.indexOf(name);
            if (i >= 0) rappers.splice(i, 1);
            $('#vs').text(rappers.join(' vs '));
        });
        
        em.on('round', function (round) {
            $('<div>').appendTo($('#battle'));
        });
        
        em.on('rap', function (name, msg) {
            var i = rappers.indexOf(name);
            
            var nick = $('<span>').text('<' + name + '> ');
            var body = $('<span>').text(msg);
            
            $('<div>')
                .addClass('line-' + i)
                .append(nick)
                .append(body)
                .appendTo($('#battle'))
            ;
        });
        
        remote.watch(em.emit.bind(em));
    });
});
