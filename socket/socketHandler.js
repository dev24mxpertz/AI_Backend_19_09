// const socketIo = require('socket.io');
// const http = require('http');
// const express = require('express');
// const path = require('path'); // Added path module
// const app = express();

// app.get('/socket.io/socket.io.js', (req, res) => {
//     res.sendFile(path.join(__dirname, '/node_modules/socket.io/client-dist/socket.io.js'));
// });

// function initSocket(server) {
//     const io = socketIo(server, {
//         cors: {
//             origin: "*", 
//             methods: ["GET", "POST"]
//         }
//     });

//     io.on('connection', (socket) => {
//         console.log('A user connected');

//         socket.on('join', (userId) => {
//             console.log(`User ${userId} joined the chat`);
//         });

//         socket.on('sendMessage', ({ senderId, receiverId, message }) => {
//             console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
//             io.emit('receiveMessage', { senderId, message });
//         });

//         socket.on('disconnect', () => {
//             console.log('A user disconnected');
//         });
//     });
// }

// module.exports = { initSocket };


