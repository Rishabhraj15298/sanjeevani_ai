const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let ioInstance = null;

function initSocket(server) {
  if (ioInstance) return ioInstance;
  const io = new Server(server, {
    cors: { origin: '*' } // tighten in prod
  });

  // middleware for auth on connection
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication error: token missing'));
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = payload; // { id, role }
      return next();
    } catch (err) {
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const { id: userId, role } = socket.user || {};
    console.log(`Socket connected: user=${userId} role=${role} sid=${socket.id}`);
    // rooms
    if (role === 'doctor') socket.join('doctors');
    socket.join(`patient:${userId}`);
    socket.join(`user:${userId}`);

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  ioInstance = io;
  return io;
}

// convenience getter for controllers
function getIO() {
  if (!ioInstance) throw new Error('Socket.io not initialized. Call initSocket(server) first.');
  return ioInstance;
}

module.exports = { initSocket, getIO };
