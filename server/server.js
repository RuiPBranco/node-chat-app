// load config
require('./config/config');
// get public path
const path= require('path');
const publicPath=path.join(__dirname, '../public');

const{generateMessage,generateLocationMessage}=require('./utils/message');

// get express
const express = require('express');

const http=require('http');
const socketIO=require('socket.io');
// const bodyParser = require('body-parser');

const port = process.env.PORT;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

// events when client connect
io.on('connection',(socket)=>{
	console.log('new user connect');

	socket.emit('newMessage',generateMessage('Admin','Welcome user!'));

	socket.broadcast.emit('newMessage',generateMessage('Admin','New User logged in!'));

	// socket.emit('newMessage',{
	// 	from:'Admin',
	// 	text:'Welcome User!'
	// 	});
	
	// socket.broadcast.emit('newMessage',{
	// 	from:'Admin',
	// 	text:'New User logged in!',
	// 	createdAt:new Date().getTime()	
	// });

	// socket.emit('newMessage',{
	// 	from: 'rui@gmail.com',
	// 	text:'HEY!',
	// 	createdAt:123123
	// });

	// socket.emit('newEmail',{
	// 	from: 'rui@gmail.com',
	// 	text:'HEY PAL!'
	// });

	socket.on('createMessage',(message,callback)=>{
		console.log('createMessage', message);
		io.emit('newMessage',generateMessage(message.from, message.text));
		callback();
	});

	socket.on('createLocationMessage',(coords)=>{
		io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude, coords.longitude));
	});

		// io.emit('newMessage',{
		// 	from:message.from,
		// 	text:message.text,
		// 	createdAt:new Date().getTime()
		// });
		// socket.broadcast.emit('newMessage',{
		// 	from:message.from,
		// 	text:message.text,
		// 	createdAt:new Date().getTime()
		// });
	


	socket.on('createEmail',(newEmail)=>{
		console.log('createEmail', newEmail);	
	});

	socket.on('disconnect',()=>{
		console.log('He is out!');
	});
});




server.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};