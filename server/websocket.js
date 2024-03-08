import { Server } from 'socket.io';
import User from './models/user_schema';

const websocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected', socket.id);

        socket.on('hostRoom', async (payload) => {
            try {
                const existingUser = await User.findOne({ username: payload.username });
                if (existingUser) {
                    io.to(socket.id).emit('roomAlreadyHosted', { message: 'User already hosted a room' });
                } else {
                    const newUser = new User({
                        username: payload.username,
                        email: payload.email,
                        password: payload.password,
                        profile: payload.profile,
                    });
                    await newUser.save();
                    socket.join(payload.username);
                    console.log(`User joined ${socket.id}`);
                    io.to(socket.id).emit('roomCreated', { message: 'Room successfully created', room: payload.username });
                }
            } catch (error) {
                console.error('Error hosting room:', error);
            }
        });

        socket.on('joinRoom', async (payload) => {
            try {
                const user = await User.findOne({ username: payload.username });

                if (!user || user.password !== payload.password) {
                    io.to(socket.id).emit('invalidRoom', { message: 'Invalid username or password' });
                    console.log("Invalid username or password", user);
                } else {
                    socket.join(payload.username);
                    io.to(socket.id).emit('roomJoined', { message: 'Room successfully joined', room: payload.username });
                    socket.to(payload.username).except(socket.id).emit('joined',`${socket.id} joined the room`);
                    console.log(`Room successfully joined ${socket.id}`);
                }
            } catch (error) {
                console.error('Error joining room:', error);
            }
        });

        socket.on('message', ({ message, roomName }) => {
            console.log(message, roomName);
            io.to(roomName).emit('receive', message);
        });

        socket.on('leave',({roomName})=>{
            socket.leave(roomName);
            socket.to(roomName).except(socket.id).emit('left',`${socket.id} left the room`);
        })
        socket.on('disconnect', () => {
            console.log('User disconnected', socket.id);
        });
    });
};

export default websocket;
