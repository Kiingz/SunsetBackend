var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imagenSchema = new Schema({
    nombre: { type: String, required: false },
    img: { type: String, required: false },
    album: { type: Schema.Types.ObjectId, ref: 'Album', required: false }
}, { collection: 'imagenes' });

module.exports = mongoose.model('Imagen', imagenSchema);