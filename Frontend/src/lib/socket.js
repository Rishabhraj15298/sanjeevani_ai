import { io } from 'socket.io-client';

let socket = null;

export function createSocket(token) {
  if (socket) return socket;
  const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  socket = io(API, { auth: { token }, autoConnect: true });
  socket.on('connect', () => console.log('socket connected', socket.id));
  socket.on('connect_error', (err) => console.error('socket connect_error', err.message));
  return socket;
}

export function getSocket() {
  if (!socket) throw new Error('Socket not initialized. Call createSocket(token) first.');
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
