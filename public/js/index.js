var socket = io();

socket.on('connect',function () {
	console.log('connected');
});

socket.on('disconnect',function() {
	console.log('Im out!');
});

socket.on('newMessage',function(message){
	// console.log('New Message',message);	
	var formattedTime=moment(message.createdAt).format('h:mm a');
	// list
	var li = jQuery('<li></li>');
	li.text(`${message.from} [${formattedTime}]: ${message.text}`);

	jQuery('#messages').append(li);
});

socket.on('newLocationMessage',function(message){
	var formattedTime=moment(message.createdAt).format('h:mm a');
	var li = jQuery('<li></li>');
	var a = jQuery('<a target="_blank">My current location</a>');
	li.text(`${message.from} [${formattedTime}]: `);
	a.attr('href', message.url);
	li.append(a);

	jQuery('#messages').append(li);
});

socket.emit('createMessage',{
	from:'rui',
	text:'branco'
},function(data){
	console.log('recebido',data);
});

// creates variable to message text box
var messageTextbox=jQuery('[name=message]');

// Submit message
jQuery('#message-form').on('submit',function (e) {
	e.preventDefault();

	socket.emit('createMessage',{
		from:'User',
		text:messageTextbox.val()
	},function(){
		// clears the message textbox
		messageTextbox.val('');

	});
});

// Send location
var locationButton=jQuery('#send-location');
// jQuery('#send-location').on
locationButton.on('click', function(){
	if (!navigator.geolocation){
		return alert('Geolocation not supported!');
	}

	locationButton.attr('disabled','disabled').text('Sending location!');

	navigator.geolocation.getCurrentPosition(function(position){

		// console.log(position);
		locationButton.removeAttr('disabled').text('Send location');
		socket.emit('createLocationMessage',{
			latitude:position.coords.latitude,
			longitude:position.coords.longitude
		});
	}, function(){
		locationButton.removeAttr('disabled');
		alert('Unable to find you!');
	});
});


// socket.on('newEmail',function(email){
// 	console.log('New Email',email);	
// });

	// socket.emit('createEmail',{
	// 	to:'bino@gmail.com',
	// 	text:'HEY WHATSUP?!'
	// });