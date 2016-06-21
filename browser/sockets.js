'use strict';

module.exports = () =>
{
    var query = window.location.search.split('?')[1];

    window.socket = io.connect();

    window.socket.emit('add user', window.user);

    function addParticipantsMessage (data) {
        window.allusers = data;
    }
    var connected = false;

    window.socket.on('login', function (data) {
        connected = true;
        addParticipantsMessage(data);
    });

    window.socket.on('user joined', function(data) {
//   console.log(data, 'user joined');
        window.allusers = data.currentUsers;
    });

    window.socket.on('other user editing', function(data) {
        var user = data.user.name;
        var cell = data.cell.editedCell;
        var cellrow = data.cell;
        var fob = data.fob;
        $('.activeOtherCell').removeClass('activeOtherCell');
        $('').replaceAll('.userspan');
        if (fob == query) {
            $('[data-cell="'+cellrow+'"]').addClass('activeOtherCell').append('<span class="userspan">' + user.split(' ')[0] + ' ' + user.split(' ')[1][0] + '</span>');
        }
    })

}