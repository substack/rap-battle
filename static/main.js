var $ = require('jquery-browserify');
var dnode = require('dnode');
var EventEmitter = require('events').EventEmitter;

$(window).ready(function () {
    var password = null;
    
    $('#clear').click(function () {
        $('#battle').empty();
    });
    
    dnode.connect(function (remote) {
        var em = new EventEmitter;
        
        $('#fight').click(function () {
            if (!password) {
                password = prompt('password'); // evil client-side blocking
            }
            
            remote.battle(password, function (err) {
                if (err === 'ACCESS DENIED') password = null;
                if (err) alert(err);
            });
        });
        
        em.on('battle', function (competitors) {
            $('#battle').empty();
            $('#vs').text(competitors.join(' vs '));
            competitors.forEach(function (name) {
                var i = rappers.indexOf(name);
                if (i < 0) rappers.push(name);
            });
        });
        
        var rappers = [];
        
        em.on('begin', function (names) {
            rappers = names;
            $('#vs').text(rappers.join(' vs '));
            $('#fight').attr('disabled', true);
        });
        
        em.on('end', function () {
            $('#fight').attr('disabled', false);
            var elem = $('<hr>').appendTo($('#battle'));
            
            $('#battle').animate({
                scrollTop : 10000000
            }, 400);
        });
        
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
            
            var elem = $('<div>')
                .addClass('line-' + i)
                .append(nick)
                .append(body)
                .appendTo($('#battle'))
            ;
            $('#battle').animate({
                scrollTop : 10000000
            }, 400);
        });
        
        remote.watch(em.emit.bind(em));
    });
});
