const express = require('express')
const app = express()
const port = 3000

const { engine } = require('express-handlebars');

app.engine('handlebars', engine({ defaultLayout: false }));

app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));

//Configuração Socket IO
const { Server } = require('socket.io');
const { createServer } = require('node:http');
const server = createServer(app);
const io = new Server(server);

app.get('/', (_req, res) => {
  res.render('home');
})

io.on('connection', (socket) => {
  console.log('Novo usuário conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('usuario desconectado:', socket.id);
  });

  socket.on('mensagem', (data) => {
    io.emit('mensagem', data);
  });
});

app.post('/homepage-chat', (req, res) => {
  const { nomeUsuario , idConexao} = req.body;
  const mensagens = [];

  res.render('chat', { nomeUsuario: nomeUsuario, idConexao: idConexao, mensagens: mensagens });
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
