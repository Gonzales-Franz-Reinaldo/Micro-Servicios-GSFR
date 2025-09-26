require('dotenv').config();
require('reflect-metadata');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`El servidor está disponible en http://localhost:${PORT}`);
});