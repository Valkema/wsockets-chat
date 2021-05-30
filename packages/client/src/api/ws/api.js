import socket from './index.js';
export const emitTest = (data, options) => 
    socket.emit('test', data, options);
/*
export const emitMessage = (data, options) => 
    socket.emit('message', data, options);
export const emitMessage = (room, message) => 
    socket.emit('message', room, message);
    */