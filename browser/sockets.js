'use strict';

module.exports = () =>
    {
        var query = window.location.search.split('?')[1];
        var connected = false;

        window.socket = io.connect();

        window.socket.emit('add user', window.user);

        function addParticipantsMessage (data) {
            window.allusers = data;
        }

        window.socket.on('login', function (data) {
            connected = true;
            addParticipantsMessage(data);
        });

        window.socket.on('user joined', function(data) {
            window.allusers = data.currentUsers;
        });

        window.socket.on('other user editing', function(data) {
            var user = data.user.name;
            var first =  user ? user.split(' ')[0] : '';
            var fob = data.fob;
            var cellId = $(data.cell).data('id');

            $('.activeOtherCell').removeClass('activeOtherCell');
            $('').replaceAll('.userspan');
            $('[data-id="'+cellId+'"]').addClass('activeOtherCell').append('<span class="userspan">'+ first + ' ' +'</span>');
        });

    }
