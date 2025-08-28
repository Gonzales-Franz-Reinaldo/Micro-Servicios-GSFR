let selectedOperation = null;

document.addEventListener('DOMContentLoaded', function() {
    const operacionButtons = document.querySelectorAll('.operation-btn');
    const calculateBtn = document.getElementById('calculateBtn');
    const form = document.getElementById('calculatorForm');
    const resultDiv = document.getElementById('result');

    
    operacionButtons.forEach(button => {
        button.addEventListener('click', function() {
            
            operacionButtons.forEach(btn => btn.classList.remove('active'));
            
            this.classList.add('active');
            
    
            selectedOperation = this.getAttribute('data-operation');
            
            
            calculateBtn.disabled = false;
        });
    });


    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!selectedOperation) {
            mostrarResultado('Por favor selecciona una operación', 'error');
            return;
        }

        const valueA = document.getElementById('valueA').value;
        const valueB = document.getElementById('valueB').value;

        if (!valueA || !valueB) {
            mostrarResultado('Por favor ingresa ambos valores', 'error');
            return;
        }

        mostrarResultado('Calculando...', '');
        calculateBtn.disabled = true;

        // enviamos datos al servidor
        fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                a: valueA,
                b: valueB,
                operation: selectedOperation
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                mostrarResultado(data.error, 'error');
            } else {
                const operationSymbols = {
                    'suma': '+',
                    'resta': '-',
                    'multiplicacion': '×',
                    'division': '÷'
                };
                
                mostrarResultado(
                    `${valueA} ${operationSymbols[selectedOperation]} ${valueB} = <span class="result-number">${data.result}</span>`,
                    'success'
                );
            }
        })
        .catch(error => {
            mostrarResultado('Error al realizar el cálculo', 'error');
            console.error('Error:', error);
        })
        .finally(() => {
            calculateBtn.disabled = false;
        });
    });
});

function mostrarResultado(message, type) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p>${message}</p>`;
    
    // Limpiar clases anteriores
    resultDiv.classList.remove('success', 'error');
    
    // Agregar nueva clase si se especifica
    if (type) {
        resultDiv.classList.add(type);
    }
}