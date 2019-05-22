// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar Variables
var app = express();

// CORS
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT');
    next();
});

// Body Parser
// parse aplication/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb', extended: true }));

// Importar Rutas
var appRoutes = require('./routes/app');
var imagenesRoutes = require('./routes/imagen');
var albumsRoutes = require('./routes/album');

// Conexion a la Base De Datos
mongoose.connection.openUri('mongodb://localhost:27017/sunsetDB', { useNewUrlParser: true }, (err, resp) => {
    if (err) throw err;
    console.log('Base De Datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.use('/imagen', imagenesRoutes);
app.use('/album', albumsRoutes);

app.use('/', appRoutes);
// Escuchar Peticiones
app.listen(3000, () => {
    console.log('Express server en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});