// load config
require('./config/config');
// get public path
const path= require('path');
const http=require('http');
const socketIO=require('socket.io');
// get express
const express = require('express');

const publicPath=path.join(__dirname, '../public');

const{generateMessage,generateLocationMessage}=require('./utils/message');

const{isRealString}= require('./utils/validation');
const{Users}= require('./utils/users');

// const bodyParser = require('body-parser');

const port = process.env.PORT;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users=new Users();

app.use(express.static(publicPath));

// events when client connect
io.on('connection',(socket)=>{
	// console.log('new user connect');
	socket.on('join',(params,callback)=>{
		if (!isRealString(params.name) || !isRealString(params.room)){
			return callback('Name and room are required!');
		}
		socket.join(params.room);
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name,params.room);

		io.to(params.room).emit('updateUserList',users.getUserList(params.room));

		socket.emit('newMessage',generateMessage('Admin','Welcome user!'));
		socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined the room.`));
	});

	socket.on('createMessage',(message,callback)=>{
		// console.log('createMessage', message);
		var user=users.getUser(socket.id);
		if (user && isRealString(message.text)){
			io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));
			// io.emit('newMessage',generateMessage(message.from, message.text));
		}
		callback();
	});

	socket.on('createLocationMessage',(coords)=>{
		var user=users.getUser(socket.id);
		if (user){
			io.to(user.room).emit('newLocationMessage',generateMessage(user.name,coords.latitude, coords.longitude));
			// io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude, coords.longitude));
		}
	});

	socket.on('createEmail',(newEmail)=>{
		console.log('createEmail', newEmail);	
	});

	socket.on('disconnect',()=>{
		var user=users.removeUser(socket.id);
		
		if(user){
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room}`));
		}

		users.removeUser(socket.id);
		console.log('He is out!');
	});
});

server.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};

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
	