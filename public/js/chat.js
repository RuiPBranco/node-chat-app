var socket = io();

// autocroll chat windows
function scrollToBottom(){
	// selectors
	var messages=jQuery('#messages');
	var newMessage=messages.children('li:last-child');
	// heights
	var clientHeight=messages.prop('clientHeight');
	var scrollTop=messages.prop('scrollTop');
	var scrollHeight=messages.prop('scrollHeight');
	var newMessageHeight=newMessage.innerHeight();
	var lastMessageHeight= newMessage.prev().innerHeight();

	if (clientHeight+scrollTop+newMessageHeight+lastMessageHeight>= scrollHeight){
		messages.scrollTop(scrollHeight);
	}
};

// listener for connect message
socket.on('connect',function () {
	console.log('connected');
	var params=jQuery.deparam(window.location.search);

	socket.emit('join',params,function(e){
		if(e){
			alert(e);
			window.location.href='/';
		}else{
			console.log('No error');
		}
	});
});

// listener for disconnect message
socket.on('disconnect',function() {
	console.log('Im out!');
});

socket.on('updateUserList',function(users){
	console.log('Users list', users);
	var ol=jQuery('<ol></ol>');

	users.forEach(function (user){
		ol.append(jQuery('<li></li>').text(user));
	});
	jQuery('#users').html(ol);
});

// listener for newMessage message
socket.on('newMessage',function(message){
	var formattedTime=moment(message.createdAt).format('h:mm a');
	var template=jQuery('#message-template').html();
	var html= Mustache.render(template,{
		from: message.from,
		text: message.text,
		createdAt: formattedTime
	});
	jQuery('#messages').append(html);
	scrollToBottom();
});

// listener for newLocationMessage message
socket.on('newLocationMessage',function(message){
	var formattedTime=moment(message.createdAt).format('h:mm a');
	var template=jQuery('#message-location-template').html();

	var html= Mustache.render(template,{
		from: message.from,
		url: message.url,
		createdAt: formattedTime
	});
	jQuery('#messages').append(html);
	scrollToBottom();
});

// creates variable to message text box
var messageTextbox=jQuery('[name=message]');

// Submit message
jQuery('#message-form').on('submit',function (e) {
	e.preventDefault();
	socket.emit('createMessage',{
		// from:'User',
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

// console.log('New Message',message);	
// var formattedTime=moment(message.createdAt).format('h:mm a');
// // list
// var li = jQuery('<li></li>');
// li.text(`${message.from} [${formattedTime}]: ${message.text}`);

// jQuery('#messages').append(li);

	// var li = jQuery('<li></li>');
// var a = jQuery('<a target="_blank">My current location</a>');
// li.text(`${message.from} [${formattedTime}]: `);
// a.attr('href', message.url);
// li.append(a);

// jQuery('#messages').append(li);

