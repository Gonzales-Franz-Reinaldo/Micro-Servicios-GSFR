const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/db_agenda", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));