-- SCRIPT DE CREACION BD

drop table municipio cascade constraint;
drop table producto cascade constraint;
drop table factura cascade constraint;
drop table compra cascade constraint;
drop table oferta cascade constraint;
drop table usuario cascade constraint;


-- Tabla MUNICIPIO
CREATE TABLE MUNICIPIO (
    munCodigo INT NOT NULL,
    munNombre VARCHAR(50) NOT NULL,
    munTipoClima VARCHAR(50) NOT NULL, 
    CONSTRAINT PK_MUNICIPIO primary key (munCodigo),
    CONSTRAINT CKC_munTipoClima CHECK (munTipoClima IN ('frio', 'templado', 'caliente'))
);

-- Tabla PRODUCTO
CREATE TABLE PRODUCTO (
    proId INT NOT NULL,
    proNombre VARCHAR(100) NOT NULL,
    proTipo VARCHAR(50) NOT NULL ,
    proDescripcion VARCHAR(100) NOT NULL,
    proPrecioUnitario DECIMAL(9,2) NOT NULL,
    proCantidadKg VARCHAR(20) NOT NULL,
    CONSTRAINT PK_PRODUCTO primary key (proId),
    CONSTRAINT CKC_proTipo CHECK (proTipo IN ('insumo', 'animal', 'fruta', 'vegetal'))
);

-- Tabla USUARIO
CREATE TABLE USUARIO (
    usuId INT NOT NULL,
    munCodigo INT NOT NULL,
    usuNombre VARCHAR(50) NOT NULL,
    usuApellido VARCHAR(50) NOT NULL,
    usuDireccion VARCHAR(100) NOT NULL,
    usuContrasenia VARCHAR(20),
    usuTipo VARCHAR(20),
    CONSTRAINT PK_usuId PRIMARY KEY (usuId),
    CONSTRAINT FK_USU_munCodigo FOREIGN KEY (munCodigo) REFERENCES MUNICIPIO(munCodigo),
    CONSTRAINT CKC_usuTipo CHECK (usuTipo IN ('comprador', 'campesino'))
);

-- Tabla OFERTA
CREATE TABLE OFERTA (
    ofeId INT NOT NULL,
    usuId INT NOT NULL,
    proId INT NOT NULL,
    ofeFechaCaducidad DATE NOT NULL,
    ofeCantidad INT NOT NULL,
    CONSTRAINT PK_ofeId PRIMARY KEY (ofeId),
    CONSTRAINT FK_OFER_usuId FOREIGN KEY (usuId) REFERENCES USUARIO(usuId),
    CONSTRAINT FK_OFER_proId FOREIGN KEY (proId) REFERENCES PRODUCTO(proId)
);

-- Tabla FACTURA
CREATE TABLE FACTURA (
    facId INT NOT NULL,
    usuId INT NOT NULL,
    facFecha DATE NOT NULL,
    facSubtotal DECIMAL(9,2) NOT NULL,
    CONSTRAINT PK_facId PRIMARY KEY (facId),
    CONSTRAINT FK_FAC_usuId FOREIGN KEY (usuId) REFERENCES USUARIO(usuId)
);

-- Tabla COMPRA
CREATE TABLE COMPRA (
    comId INT NOT NULL,
    facId INT NOT NULL,
    proId INT NOT NULL,
    comCantidadUnidades INT NOT NULL,
    CONSTRAINT PK_comId PRIMARY KEY (comId),
    CONSTRAINT FK_COMP_facId FOREIGN KEY (facId) REFERENCES FACTURA(facId),
    CONSTRAINT FK_COMP_proId FOREIGN KEY (proId) REFERENCES PRODUCTO(proId)
);

INSERT INTO MUNICIPIO (munCodigo, munNombre, munTipoClima)
VALUES (1, 'Popayán', 'templado');
INSERT INTO MUNICIPIO
VALUES (2, 'Cali', 'caliente');
INSERT INTO MUNICIPIO
VALUES (3, 'Pasto', 'frio');
INSERT INTO MUNICIPIO
VALUES (4, 'Palmira', 'templado');
INSERT INTO MUNICIPIO
VALUES (5, 'Buenaventura', 'caliente');

INSERT INTO PRODUCTO (proId, proNombre, proTipo, proDescripcion, proPrecioUnitario, proCantidadKg)
VALUES (1, 'Manzana', 'fruta', 'Manzana roja deliciosa', 2.50, '1');
INSERT INTO PRODUCTO
VALUES (2, 'Leche', 'animal', 'Leche de vaca pasteurizada', 3.00, '1');
INSERT INTO PRODUCTO
VALUES (3, 'Arroz', 'insumo', 'Arroz blanco', 1.50, '2');
INSERT INTO PRODUCTO
VALUES (4, 'Tomate', 'vegetal', 'Tomate rojo maduro', 1.00, '1');
INSERT INTO PRODUCTO
VALUES (5, 'Huevo', 'animal', 'Huevo de gallina', 0.50, '12');

INSERT INTO USUARIO (usuId, munCodigo, usuNombre, usuApellido, usuDireccion, usuContrasenia, usuTipo)
VALUES (1, 1, 'Ana', 'López', 'Calle 10 # 10-10', '123456', 'comprador');
INSERT INTO USUARIO 
VALUES (2, 2, 'Juan', 'Pérez', 'Carrera 5 # 5-5', '654321', 'campesino');
INSERT INTO USUARIO 
VALUES (3, 3, 'María', 'Gómez', 'Avenida 20 # 20-20', '789012', 'comprador');
INSERT INTO USUARIO 
VALUES (4, 4, 'Pedro', 'Martínez', 'Calle 30 # 30-30', '321654', 'campesino');
INSERT INTO USUARIO 
VALUES (5, 5, 'Camila', 'Rojas', 'Carrera 40 # 40-40', '987456', 'comprador');


INSERT INTO OFERTA (ofeId, usuId, proId, ofeFechaCaducidad, ofeCantidad)
VALUES (1, 2, 1, TO_DATE('2024-05-01', 'YYYY-MM-DD'), 10);
INSERT INTO OFERTA
VALUES (2, 3, 2, TO_DATE('2024-04-30', 'YYYY-MM-DD'), 5);
INSERT INTO OFERTA
VALUES (3, 4, 3, TO_DATE('2024-05-15', 'YYYY-MM-DD'), 20);
INSERT INTO OFERTA
VALUES (4, 5, 4, TO_DATE('2024-05-05', 'YYYY-MM-DD'), 15);
INSERT INTO OFERTA
VALUES (5, 1, 5, TO_DATE('2024-04-25', 'YYYY-MM-DD'), 30);

INSERT INTO FACTURA (facId, usuId, facFecha, facSubtotal)
VALUES (1, 1, TO_DATE('2024-04-07', 'YYYY-MM-DD'), 10.00);
INSERT INTO FACTURA
VALUES (2, 2, TO_DATE('2024-04-06', 'YYYY-MM-DD'), 15.00);
INSERT INTO FACTURA
VALUES (3, 3, TO_DATE('2024-04-05', 'YYYY-MM-DD'), 20.00);
INSERT INTO FACTURA
VALUES (4, 4, TO_DATE('2024-04-04', 'YYYY-MM-DD'), 25.00);
INSERT INTO FACTURA
VALUES (5, 5, TO_DATE('2024-04-03', 'YYYY-MM-DD'), 30.00);


INSERT INTO COMPRA (comId, facId, proId, comCantidadUnidades)
VALUES (1, 1, 1, 2);
INSERT INTO COMPRA
VALUES (2, 1, 2, 1);
INSERT INTO COMPRA
VALUES (3, 2, 3, 3);
INSERT INTO COMPRA
VALUES (4, 2, 4, 2);
INSERT INTO COMPRA
VALUES (5, 3, 5, 4);
