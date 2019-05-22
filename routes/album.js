var express = require('express');

var app = express();

var Album = require('../models/album');


// ==============================
// Obtener todas las Imagenes
// ==============================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Album.find({}).skip(desde).limit(5).exec((err, albums) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando albums',
                errors: err
            });
        }
        Album.count({}, (err, conteo) => {
            res.status(200).json({
                ok: true,
                albums: albums,
                total: conteo
            });
        });
    });
});

// ==============================
// Crear crear un nuevo Album
// ==============================
app.post('/', (req, res) => {
    var body = req.body;
    var album = new Album({
        nombre: body.nombre,
        imgs: body.imgs
    });
    album.save((err, albumGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Album',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            album: albumGuardado
        });
    });
});


module.exports = app;