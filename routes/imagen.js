var express = require('express');
var fileUpload = require('express-fileupload');

var app = express();

// Default Options
app.use(fileUpload());

var Imagen = require('../models/imagen');
var Album = require('../models/album');

// ==============================
// Subir Imagen
// ==============================
app.put('/:albumId', (req, res, next) => {
    var albumId = req.params.albumId;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }
    // Obtener el nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];
    // Solo estas extensiones son aceptadas
    var extensionesValidas = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son ' + extensionesValidas.join(', ') }
        });
    }
    // Nombre de archivo personalizado
    var nombreArchivo = `${albumId}-${new Date().getMilliseconds()}.${extensionArchivo}`;
    // Mover el archivo del temporal a un path en espesifico
    var path = `./uploads/albums/${nombreArchivo}`;
    archivo.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
        var imagen = new Imagen({
            nombre: nombreArchivo,
            img: path,
            album: albumId
        });
        imagen.save((err, imagenCreada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al Crear Imagen',
                    errors: err
                });
            }
            return res.status(200).json({
                ok: true,
                mensaje: 'Imagen de actualizada',
                imagen: imagenCreada
            });
        });

    });
});

// ==============================
// Obtener todas las Imagenes
// ==============================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Imagen.find({}).populate('album').skip(desde).limit(5).exec((err, imagenes) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando Imagenes',
                errors: err
            });
        }
        Imagen.count({}, (err, conteo) => {
            res.status(200).json({
                ok: true,
                imagenes: imagenes,
                total: conteo
            });
        });
    });
});

// ==============================
// Crear crear una nueva imagen
// ==============================
// app.post('/img', (req, res) => {
//     var body = req.body;
//     var imagen = new Imagen({
//         nombre: body.nombre,
//         img: body.img,
//         album: body.album,
//         url: body.url
//     });
//     imagen.save((err, imagenGuardada) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'Error al crear imagen',
//                 errors: err
//             });
//         }
//         res.status(201).json({
//             ok: true,
//             imagen: imagenGuardada
//         });
//     });
// });

module.exports = app;