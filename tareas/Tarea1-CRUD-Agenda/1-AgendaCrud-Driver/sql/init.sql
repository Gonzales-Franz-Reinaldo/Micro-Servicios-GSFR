-- Usar la base de datos
USE agenda_db;

-- Crear tabla agenda
CREATE TABLE agenda (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    direccion TEXT,
    celular VARCHAR(20),
    correo VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices para mejor rendimiento
CREATE INDEX idx_nombres ON agenda(nombres);
CREATE INDEX idx_apellidos ON agenda(apellidos);
CREATE INDEX idx_correo ON agenda(correo);


-- Insertar datos de ejemplo
INSERT INTO agenda (nombres, apellidos, fecha_nacimiento, direccion, celular, correo) VALUES
('Juan Carlos', 'Pérez García', '1990-05-15', 'Av. Principal 123, La Paz', '70123456', 'juan.perez@email.com'),
('María Elena', 'López Mendoza', '1985-08-22', 'Calle Comercio 456, Cochabamba', '71234567', 'maria.lopez@email.com'),
('Carlos Alberto', 'Rodríguez Silva', '1992-03-10', 'Zona Central 789, Santa Cruz', '72345678', 'carlos.rodriguez@email.com'),
('Ana Sofía', 'Martínez Torres', '1988-11-07', 'Barrio Norte 321, Sucre', '73456789', 'ana.martinez@email.com'),
('Luis Fernando', 'González Vargas', '1995-12-30', 'Villa Sur 654, Oruro', '74567890', 'luis.gonzalez@email.com'),
('Carmen Rosa', 'Herrera Choque', '1987-06-18', 'Zona Este 987, Tarija', '75678901', 'carmen.herrera@email.com'),
('Roberto José', 'Morales Quispe', '1991-09-25', 'Barrio Obrero 147, Potosí', '76789012', 'roberto.morales@email.com'),
('Patricia Isabel', 'Vega Mamani', '1993-04-12', 'Villa Nueva 258, Beni', '77890123', 'patricia.vega@email.com'),
('Miguel Ángel', 'Castillo Apaza', '1989-01-03', 'Centro Histórico 369, Pando', '78901234', 'miguel.castillo@email.com'),
('Sandra Liliana', 'Flores Condori', '1994-07-28', 'Zona Residencial 741, La Paz', '79012345', 'sandra.flores@email.com');

-- Insertar más datos variados
INSERT INTO agenda (nombres, apellidos, fecha_nacimiento, direccion, celular, correo) VALUES
('Diego Armando', 'Sánchez Cruz', '1986-02-14', 'Av. 6 de Agosto 852, La Paz', '60123789', 'diego.sanchez@email.com'),
('Gabriela Esther', 'Ramírez Huanca', '1991-10-09', 'Calle Bolívar 963, Cochabamba', '61234890', 'gabriela.ramirez@email.com'),
('Fernando Javier', 'Torres Inca', '1990-12-05', 'Barrio Central 159, Santa Cruz', '62345901', 'fernando.torres@email.com'),
('Verónica Andrea', 'Mendoza Paco', '1987-03-21', 'Villa Harmony 753, Sucre', '63456012', 'veronica.mendoza@email.com'),
('Andrés Mauricio', 'Gutiérrez Nina', '1992-08-16', 'Zona Industrial 486, Oruro', '64567123', 'andres.gutierrez@email.com');