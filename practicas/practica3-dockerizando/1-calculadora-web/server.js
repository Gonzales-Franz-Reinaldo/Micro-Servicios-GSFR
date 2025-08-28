const express = require('express');
const path = require('path')

const app = express();
const PORT = process.env.PORT || 8080;


// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'calculator.html'));
});


app.post('/calculate', (req, res) => {
    const { a, b, operation } = req.body;
    
    if (a === undefined || b === undefined || !operation) {
        return res.status(400).json({ error: 'Faltan parámetros' });
    }
    
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    
    if (isNaN(numA) || isNaN(numB)) {
        return res.status(400).json({ error: 'Los valores deben ser números válidos' });
    }
    
    let result;
    
    switch (operation) {
        case 'suma':
            result = numA + numB;
            break;
        case 'resta':
            result = numA - numB;
            break;
        case 'multiplicacion':
            result = numA * numB;
            break;
        case 'division':
            if (numB === 0) 
                return res.status(400).json({ error: 'No se puede dividir por cero' });

            result = numA / numB;
            break;
        default:
            return res.status(400).json({ error: 'Operación no válida' });
    }
    
    res.json({ result: result });
});


app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    console.log(`Accede a la aplicación en: http://localhost:${PORT}`);
});