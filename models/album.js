var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var albumSchema = new Schema({
    nombre: { type: String, required: false },
    imgs: { type: String, required: false }
}, { collection: 'albums' });

module.exports = mongoose.model('Album', albumSchema);