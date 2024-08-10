const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const screenSchema = new Schema({
    name: { type: String, required: true },
    screenshot: { type: Buffer, required: true }
}, { timestamps: true });

const Screenshot = mongoose.model('Screenshot', screenSchema);

module.exports = Screenshot;
