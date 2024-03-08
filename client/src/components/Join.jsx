import React, { useState, useEffect } from 'react';
import { Grid, Button, TextField, Box, Typography, Container, Stack } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import io from 'socket.io-client';

const defaultTheme = createTheme();
const socket = io('http://localhost:3000');

const Join = () => {
  const [host, setHost] = useState(true);
  const [hostInfo, setHostInfo] = useState({ creatingRoom: '', password: '' });
  const [clientInfo, setClientInfo] = useState({ joiningRoom: '', username: '', password: '' }); // Add username field
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]); // Store joined clients
  const [roomName, setRoomName] = useState('');
  const [display, setDisplay] = useState(false);
  const [messageTime, setMessageTime] = useState('');

  const handleChange = (e) => {
    if (host) {
      setHostInfo({ ...hostInfo, [e.target.name]: e.target.value });
    } else {
      setClientInfo({ ...clientInfo, [e.target.name]: e.target.value });
    }
  };

  const handleRoomAction = (e) => {
    e.preventDefault();
    if (host) {
      socket.emit('hostRoom', {
        hosting_room_name: hostInfo.creatingRoom,
        hosting_password: hostInfo.password
      });
      setRoomName(hostInfo.creatingRoom);
    } else {
      socket.emit('joinRoom', {
        hosted_room_name: clientInfo.joiningRoom,
        username: clientInfo.username, // Pass username to server
        hosted_password: clientInfo.password
      });
      setRoomName(clientInfo.joiningRoom);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    const currentTime = new Date().toLocaleTimeString();
    setMessageTime(currentTime);
    socket.emit('message', { message, roomName });
    setMessage('');
  };

  const onLeave = () => {
    alert('You are terminating');
    socket.emit('leave', { roomName });
    setDisplay(false);
  }

  useEffect(() => {
    socket.on('receive', (data) => {
      setMessages(prevMessages => [...prevMessages, data]);
    });

    socket.on('roomAlreadyHosted', (data) => {
      alert(data.message);
    });

    socket.on('roomCreated', (data) => {
      alert(data.message);
      setDisplay(true);
    });

    socket.on('invalidRoom', (data) => {
      alert(data.message);
    });

    socket.on('roomJoined', (data) => {
      alert(data.message);
      setDisplay(true);
    });

    socket.on('left', (data) => {
      alert(data);
    });

    socket.on('joined', (data) => {
      setClients(data.clients); // Update clients array when a new client joins
    });

    return () => {
      socket.off('receive');
      socket.off('roomAlreadyHosted');
      socket.off('roomCreated');
      socket.off('invalidRoom');
      socket.off('roomJoined');
      socket.off('left');
      socket.off('joined');
    };
  }, []);

  return (
    <div style={{backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      {display ?
        <Box component="form" onSubmit={handleSend} sx={{ borderRadius: 8, p: 4, backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <TextField
              label="Message"
              variant="outlined"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary">
              Send
            </Button>
            <Button variant="contained" color="warning" onClick={onLeave}>
              Leave
            </Button>
          </Stack>
          <Stack spacing={2}>
            {messages.map((m, i) => (
              <Box key={i} sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Typography variant="body2" sx={{mr: 1}}>
                  {messageTime}:
                </Typography>
                <Typography variant="body1" sx={{backgroundColor: '#e0e0e0', borderRadius: '10px', p: 1}}>
                  {m.message}
                </Typography>
              </Box>
            ))}
          </Stack>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Room: {roomName}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Joined Clients:
            {clients.map((client, index) => (
              <Typography key={index} variant="body2">{client.username}</Typography>
            ))}
          </Typography>
        </Box>
        :
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <Box sx={{ borderRadius: 8, p: 4, backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: 2 }}>
              <Typography component="h1" variant="h5">
                {host ? 'Host' : 'Join'}
              </Typography>
              <Box component="form" onSubmit={handleRoomAction} noValidate sx={{ mt: 3 }} >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name={host ? 'creatingRoom' : 'joiningRoom'}
                      value={host ? hostInfo.creatingRoom : clientInfo.joiningRoom}
                      required
                      fullWidth
                      label={host ? 'Hosting Room Name' : 'Joining Room Name'}
                      autoFocus
                      onChange={handleChange}
                    />
                  </Grid>
                  {!host && (
                    <Grid item xs={12}>
                      <TextField
                        name="username"
                        value={clientInfo.username}
                        required
                        fullWidth
                        label="Username"
                        onChange={handleChange}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <TextField
                      type="password"
                      name="password"
                      value={host ? hostInfo.password : clientInfo.password}
                      required
                      fullWidth
                      label="Password"
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  type='submit'
                >
                  {host ? 'Host Room' : 'Join Room'}
                </Button>
                <Grid container justifyContent="center">
                  <Typography
                    sx={{ cursor: 'pointer', color: 'blue', ':hover': { color: 'blueviolet' } }}
                    onClick={() => setHost(prev => !prev)}
                  >
                    {host ? 'Join an existing room' : 'Create a new room'}
                  </Typography>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      }
    </div>
  );
};

export default Join;
