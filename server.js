const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

let port = 3000;

io.on("connect", (socket) => {
  socket.broadcast.emit('a user connected');
});

app.use((req, res, next) => {
  if (process.env.NODE_ENV == 'production') {
      if (req.headers['x-forwarded-proto'] !== 'https')
          // the statement for performing our redirection
          return res.redirect('https://' + req.headers.host + req.url);
      else
          return next();
  } else
      return next();
});

nextApp.prepare().then(() => {

  app.all("*", (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log("> Ready on port: " + port);
  });
});