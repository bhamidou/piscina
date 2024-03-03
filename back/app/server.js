const express = require("express");
const cors = require("cors");
require('dotenv').config()
const mongoose = require("mongoose");
const { socketController } = require("../controllers/socketController");
const { createNew } = require("../controllers/newsController");
mongoose.set("strictQuery", false);
const fileUpload = require('express-fileupload');


class Server {
  constructor() {
    this.app = express();
    this.middlewares();

    this.userRoutePath = "/api";
    this.userRouteClasesPath = "/api";
    this.eventosRoutePath = "/api/eventos";
    this.categoriasRoutePath = "/api/categorias";
    this.noSociosRoutePath = "/api/noSocios";
    this.eventoUsuariosRoutePath = "/api/eventoUsuarios";
    this.apiFiles = "/api/file";
    this.entrenamientoPath = "/api/entrenamiento"
    this.ejerEntreRoutePath = "/api/ejercicioEntrenamiento";
    this.puntuacionRoutePath = "/api/puntuaciones";
    this.ejercicioRoutePath = "/api/ejercicios";
    this.tiposRoutePath = "/api/tiposEjercicios";

    
    this.serverExpress = require('http').createServer(this.app);
    this.serverWebSocket = require('http').createServer(this.app);
    this.io = require("socket.io")(this.serverWebSocket, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.conectarMongoose();
    this.routes();
    this.sockets()
  }

  conectarMongoose() {
    mongoose.connect(
      "mongodb://" +
        process.env.DB_MONGO_URL +
        ":" +
        process.env.DB_MONGO_PORT +
        "/" +
        process.env.DB_MONGO_DATABASE,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    this.db = mongoose.connection;
    this.db.on(
      "error",
      console.error.bind(console, "Error de conexión a MongoDB:")
    );
    this.db.once("open", () => {
      console.log("Conexión exitosa a MongoDB");
    });
  }

  middlewares() {
    this.app.use(cors({
      origin: process.env.FRONT_URL,
      credentials: true,
    }));
    this.app.use(express.json());

    this.app.use( fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true
  }));
  }

  routes() {
    this.app.use(this.userRouteClasesPath, require("../routes/claseRoutes"));
    this.app.use(this.userRouteClasesPath, require("../routes/faltasRoutes"));
    this.app.use(this.userRouteClasesPath, require("../routes/claseHasUsuarioRoutes"));
    this.app.use(this.userRouteClasesPath, require("../routes/categoriaClaseRoutes"));

    this.app.use(this.apiFiles, require("../routes/uploadsRoutes"));
    this.app.use(this.userRoutePath, require("../routes/userRoutes"));
    this.app.use(this.userRoutePath, require("../routes/newsRoutes"));
    this.app.use(this.userRoutePath, require("../routes/clubRoutes"));
    this.app.use(this.userRoutePath, require("../routes/assetsRoutes"));

    this.app.use(this.entrenamientoPath, require('../routes/entrenamientosRoutes'))
    this.app.use(this.ejerEntreRoutePath, require("../routes/ejercicioEntrenamientosRoutes"));
    this.app.use(this.puntuacionRoutePath, require("../routes/puntuacionRoutes"));
    this.app.use(this.ejercicioRoutePath, require('../routes/ejerciciosRoutes'));
    this.app.use(this.tiposRoutePath, require("../routes/tiposRoutes"));

    this.app.use(this.eventosRoutePath, require("../routes/eventoRoutes"));
    this.app.use(this.categoriasRoutePath,require("../routes/categoriaRoutes"));
    this.app.use(this.noSociosRoutePath, require("../routes/noSocioRoutes"));
    this.app.use(this.eventoUsuariosRoutePath,require("../routes/eventoUsuarioRoutes")); 
  }

  sockets() {
    this.io.on("connection", socketController);
  }

  listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`Servidor escuchando en: ${process.env.PORT}`);
    });

    this.serverWebSocket.listen(process.env.WEBSOCKETPORT, () => {
      console.log(
        `Servidor de WebSockets escuchando en: ${process.env.WEBSOCKETPORT}`
      );
    });
  }
}

module.exports = Server;
