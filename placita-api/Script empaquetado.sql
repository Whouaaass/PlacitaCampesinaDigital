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
    CONSTRAINT pk_municipio primary key (munCodigo),
    CONSTRAINT ckc_munTipoClima CHECK (munTipoClima IN ('Frio', 'Templado', 'Caliente'))
);

-- Tabla PRODUCTO
CREATE TABLE PRODUCTO (
    proId INT NOT NULL,
    proNombre VARCHAR(100) NOT NULL,
    proTipo VARCHAR(50) NOT NULL ,
    CONSTRAINT pk_producto primary key (proId),
    CONSTRAINT ckc_prodTipo CHECK (proTipo IN ('Insumo', 'Animal', 'Fruta', 'Vegetal'))
);

-- Tabla USUARIO
CREATE TABLE USUARIO (
    usuId NUMBER(10,0) NOT NULL,
    munCodigo INT NOT NULL,
    usuNombre VARCHAR(50) NOT NULL,
    usuApellido VARCHAR(50) NOT NULL,
    usuDireccion VARCHAR(100) NOT NULL,
    usuContrasenia VARCHAR(20) NOT NULL,
    usuTelefono int NOT NULL,
    usuTipo VARCHAR(20),
    CONSTRAINT pk_usuId PRIMARY KEY (usuId),
    CONSTRAINT fk_usu_munCodigo FOREIGN KEY (munCodigo) REFERENCES MUNICIPIO(munCodigo),
    CONSTRAINT ckc_usuTipo CHECK (usuTipo IN ('Comprador', 'Campesino'))
);

-- Tabla OFERTA
CREATE TABLE OFERTA (
    ofeId INT NOT NULL,
    usuId NUMBER(10,0) NOT NULL,
    proId INT NOT NULL,
    ofeFechaCaducidad DATE NOT NULL,
    ofeCantidad INT NOT NULL,
    ofeDescripcion VARCHAR(100) NOT NULL,
    ofePrecio NUMBER(9,2) NOT NULL,
    ofeActivo CHAR(1) NOT NULL,
    CONSTRAINT pk_ofeId PRIMARY KEY (ofeId),
    CONSTRAINT fk_ofer_usuId FOREIGN KEY (usuId) REFERENCES USUARIO(usuId),
    CONSTRAINT fk_ofer_proId FOREIGN KEY (proId) REFERENCES PRODUCTO(proId),
    CONSTRAINT chk_ofer_estado CHECK (ofeActivo IN('Y','N'))
);

-- Tabla FACTURA
CREATE TABLE FACTURA (
    facId INT NOT NULL,
    usuId NUMBER NOT NULL,
    facFecha DATE NOT NULL,
    facTotal DECIMAL(9,2) NOT NULL,
    CONSTRAINT PK_facId PRIMARY KEY (facId),
    CONSTRAINT FK_FAC_usuId FOREIGN KEY (usuId) REFERENCES USUARIO(usuId)
);

-- Tabla COMPRA
CREATE TABLE COMPRA (
    comId INT NOT NULL,
    facId INT NOT NULL,
    ofeId INT NOT NULL,
    comCantidadUnidades INT NOT NULL,
    comSubtotal NUMBER(9,2) NOT NULL,
    CONSTRAINT PK_comId PRIMARY KEY (comId),
    CONSTRAINT FK_COMP_facId FOREIGN KEY (facId) REFERENCES FACTURA(facId),
    CONSTRAINT FK_COMP_ofeId FOREIGN KEY (ofeId) REFERENCES OFERTA(ofeId)
);

--PROCEDIMIENTOS FUNCIONES 
--CRUD Municipio
--Insertar Municipio
CREATE OR REPLACE PROCEDURE insertar_municipio (
    p_munCodigo IN INT,
    p_munNombre IN VARCHAR2,
    p_munTipoClima IN VARCHAR2
)
IS
BEGIN
    INSERT INTO MUNICIPIO (munCodigo, munNombre, munTipoClima)
    VALUES (p_munCodigo, p_munNombre, p_munTipoClima);
    COMMIT;
END insertar_municipio;

--CRUD Producto
--Insertar Producto
CREATE OR REPLACE PROCEDURE insertar_producto (
    p_proId IN INT,
    p_proNombre IN VARCHAR2,
    p_proTipo IN VARCHAR2
)
IS
BEGIN
    INSERT INTO PRODUCTO (proId, proNombre, proTipo)
    VALUES (p_proId, p_proNombre, p_proTipo);
    COMMIT;
END insertar_producto;

--CRUD Usuario
--Insertar Usuario
CREATE OR REPLACE PROCEDURE insertar_usuario (
    p_usuId IN NUMBER,
    p_munCodigo IN INT,
    p_usuNombre IN VARCHAR2,
    p_usuApellido IN VARCHAR2,
    p_usuDireccion IN VARCHAR2,
    p_usuTelefono IN INT,
    p_usuContrasenia IN VARCHAR2,
    p_usuTipo IN VARCHAR2
)
IS
BEGIN
    INSERT INTO USUARIO (usuId, munCodigo, usuNombre, usuApellido, usuDireccion, usuTelefono, usuContrasenia, usuTipo)
    VALUES (p_usuId, p_munCodigo, p_usuNombre, p_usuApellido, p_usuDireccion, p_usuTelefono,  p_usuContrasenia, p_usuTipo);
    COMMIT;
END insertar_usuario;

--CRUD Oferta
--Insertar Oferta
CREATE OR REPLACE PROCEDURE insertar_oferta (
    p_ofeId IN INT,
    p_usuId IN NUMBER,
    p_proId IN INT,
    p_ofeFechaCaducidad IN DATE,
    p_ofeDescripcion IN VARCHAR2,
    p_ofeCantidad IN INT,
    p_ofePrecio NUMBER,
    p_ofeActivo CHAR
)
IS
BEGIN
    INSERT INTO OFERTA (ofeId, usuId, proId, ofeFechaCaducidad,ofeDescripcion,ofeCantidad,ofePrecio,ofeActivo)
    VALUES (p_ofeId, p_usuId, p_proId, p_ofeFechaCaducidad, p_ofeDescripcion,p_ofeCantidad, p_ofePrecio,p_ofeActivo);
    COMMIT;
END insertar_oferta;

--CRUD FACTURA
--Insertar FACTURA
CREATE OR REPLACE PROCEDURE insertar_factura (
    p_facId IN INT,
    p_usuId IN NUMBER,
    p_facFecha IN DATE,
    p_facTotal IN DECIMAL
)
IS
BEGIN
    INSERT INTO FACTURA (facId, usuId, facFecha, facTotal)
    VALUES (p_facId, p_usuId, p_facFecha, p_facTotal);
    COMMIT;
END insertar_factura;

--CRUD Compra
--Insertar compra
CREATE OR REPLACE PROCEDURE insertar_compra (
    p_comId IN INT,
    p_facId IN INT,
    p_ofeId IN INT,
    p_comCantidadUnidades IN INT,
    p_comSubtotal NUMBER
)
IS
BEGIN
    INSERT INTO COMPRA (comId, facId, ofeId, comCantidadUnidades,comSubtotal)
    VALUES (p_comId, p_facId, p_ofeId, p_comCantidadUnidades,p_comSubtotal);
    COMMIT;
END insertar_compra;

--PROCEDIMIENTOS FUNCIONES(UPDATE)
--PROCEDMIENTO PARA MUNICIPIO
CREATE OR REPLACE PROCEDURE actualizar_clima_municipio (
    p_munCodigo IN INT,
    p_munTipoClima IN VARCHAR2
)
IS
BEGIN
    UPDATE MUNICIPIO
    SET munTipoClima = p_munTipoClima
    WHERE munCodigo = p_munCodigo;
    COMMIT;
END actualizar_clima_municipio;

--PROCEDIMIENTO PARA PRODUCTO
CREATE OR REPLACE PROCEDURE actualizar_producto (
    p_proId IN INT,
    p_proNombre IN VARCHAR2,
    p_proTipo IN VARCHAR2
)
IS
BEGIN
    UPDATE PRODUCTO
    SET proNombre = p_proNombre,
        proTipo = p_proTipo
    WHERE proId = p_proId;
    COMMIT;
END actualizar_producto;

--PROCEDIMIENTO PARA USUARIO
CREATE OR REPLACE PROCEDURE actualizar_usuario (
    p_usuId IN NUMBER,
    p_munCodigo IN INT,
    p_usuNombre IN VARCHAR2,
    p_usuApellido IN VARCHAR2,
    p_usuDireccion IN VARCHAR2,
    p_usuTelefono IN INT, 
    p_usuContrasenia IN VARCHAR2,
    p_usuTipo IN VARCHAR2
)
IS
BEGIN
    UPDATE USUARIO
    SET usuNombre = p_usuNombre,
        usuApellido = p_usuApellido,
        usuDireccion = p_usuDireccion,
        usuTelefono = p_usuTelefono,
        usuContrasenia = p_usuContrasenia,
        usuTipo = p_usuTipo
    WHERE usuId = p_usuId AND munCodigo = p_munCodigo;
    COMMIT;
END actualizar_usuario;

--PROCEDIMIENTO PARA OFERTA
CREATE OR REPLACE PROCEDURE actualizar_oferta (
    p_ofeId IN INT,
    p_usuId IN NUMBER,
    p_proId IN INT,
    p_ofeFechaCaducidad IN DATE,
    p_ofeDescripcion IN VARCHAR2,
    p_ofeCantidad IN INT,
    p_ofePrecio NUMBER,
    p_ofeActivo CHAR
)
IS
BEGIN
    UPDATE OFERTA
    SET ofeFechaCaducidad = p_ofeFechaCaducidad,
        ofeCantidad = p_ofeCantidad,
        ofePrecio = p_ofePrecio,
        ofeDescripcion = p_ofeDescripcion, 
        ofeActivo = p_ofeActivo
    WHERE ofeId = p_ofeId AND usuId = p_usuId AND proId = p_proId;
    COMMIT;
END actualizar_oferta;

--PROCEDIMIENTO PARA FACTURA
CREATE OR REPLACE PROCEDURE actualizar_fecha_factura (
    p_facId IN INT,
    p_usuId IN NUMBER,
    p_facFecha IN DATE
)
IS
BEGIN
    UPDATE FACTURA
    SET facFecha = p_facFecha
    WHERE facId = p_facId AND usuId = p_usuId;
    COMMIT;
END actualizar_fecha_factura;

--PROCEDMIENTO PARA COMPRA
CREATE OR REPLACE PROCEDURE actualizar_compra (
    p_comId IN INT,
    p_facId IN INT,
    p_ofeId IN INT,
    p_comCantidadUnidades IN INT,
    p_comSubtotal NUMBER
)
IS
BEGIN
    UPDATE COMPRA
    SET comCantidadUnidades = p_comCantidadUnidades,
        comSubtotal = p_comSubtotal
    WHERE comId = p_comId AND facId = p_facId AND ofeId = p_ofeId;
    COMMIT;
END actualizar_compra;

--PROCEDIMIENTOS FUNCIONES(DELETE)
--PROCEDIMIENTO PARA MUNICIPIO 
CREATE OR REPLACE PROCEDURE eliminar_municipio (
    p_munId IN MUNICIPIO.munCodigo%type
)
IS
BEGIN
    DELETE FROM MUNICIPIO WHERE munCodigo = p_munId;
END eliminar_municipio;

--PROCEDIMIENTO PARA PRODUCTO 
CREATE OR REPLACE PROCEDURE eliminar_producto (
    p_proId IN producto.proId%type
)
IS
BEGIN
    DELETE FROM PRODUCTO WHERE proId = p_proId;
END eliminar_producto;

--PROCEDIMIENTO PARA USUARIO 
CREATE OR REPLACE PROCEDURE eliminar_usuario (
    p_usuId IN usuario.usuId%type
)
IS
BEGIN
    DELETE FROM USUARIO WHERE usuId = p_usuId;
END eliminar_usuario;

--PROCEDIMIENTO PARA FACTURA 
CREATE OR REPLACE PROCEDURE eliminar_factura (
    p_facId IN factura.facId%type
)
IS
BEGIN
    DELETE FROM FACTURA WHERE facId = p_facId;
END eliminar_factura;

--PROCEDIMIENTO PARA COMPRA 
CREATE OR REPLACE PROCEDURE eliminar_compra (
    p_comId IN compra.comId%type
)
IS
BEGIN
    DELETE FROM COMPRA WHERE comId = p_comId;
END eliminar_compra;

--Desactivar una oferta
CREATE OR REPLACE PROCEDURE desactivar_oferta (
    p_ofeId IN oferta.ofeId%type
)
IS
BEGIN
    UPDATE OFERTA
    SET ofeActivo = 'N'
    WHERE ofeId = p_ofeId;
    COMMIT;
END desactivar_oferta;


--BLOQUE ANONIMO PARA INSERCIONES
BEGIN
    -- Inserciones en la tabla MUNICIPIO
    insertar_municipio(1, 'Timbio', 'Templado');
    insertar_municipio(2, 'Buenos Aires', 'Frio');
    insertar_municipio(3, 'Caloto', 'Templado');
    insertar_municipio(4, 'Corinto', 'Frio');
    insertar_municipio(5, 'Guachene', 'Caliente');
    insertar_municipio(6, 'Miranda', 'Templado');
    insertar_municipio(7, 'Piendamo', 'Frio');
    insertar_municipio(8, 'Rosas', 'Frio');    

    -- Inserciones en la tabla PRODUCTO
    insertar_producto(1, 'Semillas de Maíz', 'Insumo');
    insertar_producto(2, 'Gallina', 'Animal');
    insertar_producto(3, 'Manzanas', 'Fruta');
    insertar_producto(4, 'Tomates', 'Vegetal');
    insertar_producto(5, 'Fertilizante Orgánico', 'Insumo');

    -- Inserciones en la tabla USUARIO
    insertar_usuario(1, 1, 'Freddy', 'Anaya', 'Calle 15 #7-33',1223, 'papitas20', 'Campesino');
    insertar_usuario(2, 4, 'Jhoan', 'Chacon', 'Calle 19 #3-16',3232, 'arroz20', 'Comprador');
    insertar_usuario(3, 2, 'Jonathan', 'Guejia', 'Carrera 2 #1-32',2323, 'ola123', 'Campesino');
    insertar_usuario(4, 1, 'Julian', 'Alvarez', 'Transversal 5 #1-32',5445, 'contra123', 'Comprador');
    insertar_usuario(5, 5, 'Jorge', 'Vilota', 'Calle 11 #2-63',1233, 'campo20', 'Comprador');
    insertar_usuario(6, 3, 'Juan', 'Hernandez', 'Calle 15 #1-3',2322, 'azucar220', 'Comprador');

    -- Inserciones en la tabla OFERTA
    insertar_oferta(1, 1, 1, SYSDATE + 10,'Semillas secas' ,20,1000,'Y');
    insertar_oferta(2, 3, 2, SYSDATE + 5,'Gallina rabona' ,15,7000,'Y');
    insertar_oferta(3, 1, 3, SYSDATE + 8, 'Manzanas verdes muy verdes' ,10,3000,'Y');
    insertar_oferta(4, 1, 4, SYSDATE + 12, 'Tomates muy rojos' ,5,2500,'Y');
    insertar_oferta(5, 3, 5, SYSDATE + 7,'Fertilizante de marca DiomedesOrg' ,25,20000,'Y');

    -- Inserciones en la tabla FACTURA
    insertar_factura(1, 1, SYSDATE, 20000.50);
    insertar_factura(2, 2, SYSDATE - 1, 11500.25);
    insertar_factura(3, 3, SYSDATE - 2, 12000.75);
    insertar_factura(4, 4, SYSDATE - 3, 59800.00);
    insertar_factura(5, 5, SYSDATE - 4, 21500.75);

    -- Inserciones en la tabla COMPRA
    insertar_compra(1, 1, 1, 2,1000);
    insertar_compra(2, 2, 2, 1,2300);
    insertar_compra(3, 3, 3, 3,2150);
    insertar_compra(4, 4, 4, 1,4500);
    insertar_compra(5, 5, 5, 5,5000);

    COMMIT;
END;

--BLOQUE ANONIMO PARA LAS ACTUALIZACIONES(3 UPDATE POR CADA TABLA)
BEGIN
    --UPDATE PARA MUNICIPIO
    actualizar_clima_municipio(3, 'Caliente');
    actualizar_clima_municipio(7, 'Templado');
    actualizar_clima_municipio(6, 'Caliente');

    --UPDATE PARA PRODUCTO
    actualizar_producto(3, 'Peras', 'Fruta');
    actualizar_producto(2, 'Vaca', 'Animal');
    actualizar_producto(1, 'Abono', 'Insumo');

    --UPDATE PARA USUARIO
    actualizar_usuario(4, 1, 'Jude', 'Bellingham', 'Carrera 3 #7-14','1234', 'rg4l', 'Campesino');
    actualizar_usuario(5, 5, 'Ferland', 'Mendy', 'Carrera 8 #2-15','6532', 'fumarola33', 'Campesino');
    actualizar_usuario(6, 3, 'Rodrygo', 'Goes', 'Calle 12 #7-14','2323', 'papas01', 'Comprador');
  
    --UPDATE PARA OFERTA
    actualizar_oferta(1, 1, 1, '27/05/24','Semillas mojadas' ,28, 1500, 'Y');
    actualizar_oferta(3, 1, 3, '20/04/24','Manzana menos manzanosa' ,15, 4000, 'Y');
    actualizar_oferta(5, 3, 5, '01/04/24', ':(',30, 22000, 'Y');

    --UPDATE PARA FACTURA
    actualizar_fecha_factura(1, 1, SYSDATE - 5);
    actualizar_fecha_factura(3, 3, SYSDATE - 4);
    actualizar_fecha_factura(5, 5, SYSDATE + 7);

    --UPDATE COMPRA
    actualizar_compra(1, 1, 1, 5, 10000);
    actualizar_compra(3, 3, 3, 4, 4500);
    actualizar_compra(5, 5, 5, 10, 5400);
    
    COMMIT;
END;

--BLOQUE ANONIMO PARA LA DESACTIVACION DE OFERTAS (3)
BEGIN
    --DESACTIVAR OFERTA
    desactivar_oferta(1);
    desactivar_oferta(2);
    desactivar_oferta(3);
    COMMIT;
END;


--Paquete declaracion
CREATE OR REPLACE PACKAGE paquete_compras IS
    -- Funciones
    FUNCTION cantidad_disponible(p_ofeId IN Oferta.ofeId%TYPE) RETURN Oferta.ofeCantidad%TYPE;
    FUNCTION calcular_subtotal(p_ofeId Oferta.ofeId%TYPE, p_cantidad Compra.comCantidadUnidades%TYPE) RETURN Compra.comSubtotal%TYPE;

    -- Procedimientos
    PROCEDURE productos_mas_baratos;
    PROCEDURE ord_prod_fecha_cad;
    PROCEDURE ord_prod_fecha_cad(p_proTipo IN VARCHAR2);
    PROCEDURE list_ofertas_tipo;
    PROCEDURE ordenar_ofertas_campesino(p_campesino_id IN NUMBER);
    PROCEDURE comprar(p_comId IN INT,
    p_facId IN INT,
    p_ofeId IN INT,
    p_comCantidadUnidades IN INT);

END paquete_compras;
/
--CREACION DEL PAQUETE
CREATE OR REPLACE PACKAGE BODY paquete_compras AS
    -- Funciones
    FUNCTION cantidad_disponible(p_ofeId IN Oferta.ofeId%TYPE) RETURN Oferta.ofeCantidad%TYPE IS
        v_cantidad Oferta.ofeCantidad%TYPE;
    BEGIN
        SELECT ofeCantidad INTO v_cantidad FROM Oferta WHERE ofeId = p_ofeId;
        RETURN v_cantidad;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Oferta inexistente');
            v_cantidad := -1;
            RETURN v_cantidad; 
    END cantidad_disponible;

    FUNCTION calcular_subtotal(p_ofeId Oferta.ofeId%TYPE, p_cantidad Compra.comCantidadUnidades%TYPE) RETURN Compra.comSubtotal%TYPE IS
        v_precio_unitario Oferta.ofePrecio%TYPE;
        v_subtotal Compra.comSubtotal%TYPE;
    BEGIN
        SELECT ofePrecio INTO v_precio_unitario FROM Oferta WHERE ofeId = p_ofeId;
        v_subtotal := p_cantidad * v_precio_unitario;
        RETURN v_subtotal;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Oferta inexistente');
            v_subtotal := -1;
            RETURN v_subtotal;    
    END calcular_subtotal;

    -- Procedimientos
    PROCEDURE productos_mas_baratos IS
        CURSOR producto_cursor IS
            SELECT proNombre, proTipo, ofeDescripcion, ofePrecio, usuNombre || ' ' || usuApellido AS Ofertador
            FROM Oferta
            INNER JOIN Producto ON Oferta.proId = Producto.proId
            INNER JOIN Usuario ON Oferta.usuId = Usuario.usuId
            ORDER BY Oferta.ofePrecio ASC;
    BEGIN
        DBMS_OUTPUT.PUT_LINE('Los productos mas baratos son: ');
        FOR pro_record IN producto_cursor LOOP
            DBMS_OUTPUT.PUT_LINE('Nombre del producto: ' || pro_record.proNombre);
            DBMS_OUTPUT.PUT_LINE('Tipo del producto: ' || pro_record.proTipo);
            DBMS_OUTPUT.PUT_LINE('Descripcion del Producto: ' || pro_record.ofeDescripcion);
            DBMS_OUTPUT.PUT_LINE('Precio de la oferta: ' || pro_record.ofePrecio);
            DBMS_OUTPUT.PUT_LINE('Nombre del ofertador: ' || pro_record.Ofertador);
            DBMS_OUTPUT.PUT_LINE('----------------------------------------');
        END LOOP;
    END productos_mas_baratos;

    PROCEDURE ord_prod_fecha_cad IS
        CURSOR producto_cursor IS
            SELECT proNombre, proTipo, TO_CHAR(ofeFechaCaducidad, 'DD MONTH YYYY') AS fechaCaducidad
            FROM Oferta
            INNER JOIN Producto ON Oferta.proId = Producto.proId
            ORDER BY Oferta.ofeFechaCaducidad ASC;
    BEGIN
        DBMS_OUTPUT.PUT_LINE('Los productos proximos a caducar son: ');
        FOR pro_record IN producto_cursor LOOP
            DBMS_OUTPUT.PUT_LINE('Nombre del producto: ' || pro_record.proNombre);
            DBMS_OUTPUT.PUT_LINE('Tipo del producto: ' || pro_record.proTipo);
            DBMS_OUTPUT.PUT_LINE('Fecha de caducidad: ' || pro_record.fechaCaducidad);
            DBMS_OUTPUT.PUT_LINE('----------------------------------------');
        END LOOP;
    END ord_prod_fecha_cad;

    PROCEDURE ord_prod_fecha_cad(p_proTipo IN VARCHAR2) IS
        CURSOR producto_cursor IS
            SELECT proNombre, proTipo, TO_CHAR(ofeFechaCaducidad, 'DD MONTH YYYY') AS fechaCaducidad
            FROM Oferta
            INNER JOIN Producto ON Oferta.proId = Producto.proId
            WHERE Producto.proTipo = p_proTipo
            ORDER BY Oferta.ofeFechaCaducidad ASC;
    BEGIN
        DBMS_OUTPUT.PUT_LINE('Los productos de tipo ' ||  p_proTipo || ' proximos a caducar son: ');
        FOR pro_record IN producto_cursor LOOP
            DBMS_OUTPUT.PUT_LINE('Nombre del producto: ' || pro_record.proNombre);
            DBMS_OUTPUT.PUT_LINE('Tipo del producto: ' || pro_record.proTipo);
            DBMS_OUTPUT.PUT_LINE('Fecha de caducidad: ' || pro_record.fechaCaducidad);
            DBMS_OUTPUT.PUT_LINE('----------------------------------------');
        END LOOP;
    END ord_prod_fecha_cad;

    PROCEDURE list_ofertas_tipo AS
    BEGIN
        FOR tipo_prod IN (SELECT DISTINCT proTipo FROM PRODUCTO)
        LOOP
            DBMS_OUTPUT.PUT_LINE('Ofertas de tipo ' || tipo_prod.proTipo || ':');
            
            FOR oferta_rec IN (
                SELECT OFERTA.ofeId, USUARIO.usuNombre, PRODUCTO.proNombre, OFERTA.ofeFechaCaducidad, OFERTA.ofeDescripcion, OFERTA.ofeCantidad, OFERTA.ofePrecio
                FROM OFERTA
                INNER JOIN PRODUCTO ON OFERTA.proId = PRODUCTO.proId
                INNER JOIN USUARIO ON OFERTA.usuId = USUARIO.usuId
                WHERE PRODUCTO.proTipo = tipo_prod.proTipo
                ORDER BY OFERTA.proId
            )
            LOOP
                DBMS_OUTPUT.PUT_LINE('ID: ' || oferta_rec.ofeId || ', Usuario: ' || oferta_rec.usuNombre || ', Producto: ' || oferta_rec.proNombre || ', Fecha de Caducidad: ' || oferta_rec.ofeFechaCaducidad || ', Descripción: ' || oferta_rec.ofeDescripcion || ', Cantidad: ' || oferta_rec.ofeCantidad || ', Precio: ' || oferta_rec.ofePrecio);
            END LOOP;
        END LOOP;
    END list_ofertas_tipo;

    PROCEDURE ordenar_ofertas_campesino(p_campesino_id IN NUMBER) IS
        CURSOR offer_cursor IS
            SELECT 
                u.usuNombre ||' '|| u.usuApellido AS NombreCompleto,
                o.ofeDescripcion AS DescripcionOferta,
                o.ofePrecio AS price
            FROM OFERTA o
            INNER JOIN USUARIO u 
            ON o.usuId = u.usuId
            WHERE u.usuId = p_campesino_id AND o.ofeActivo = 'Y'
            ORDER BY price DESC;

        v_record offer_cursor%ROWTYPE;
    BEGIN
        OPEN offer_cursor;
        DBMS_OUTPUT.PUT_LINE('OFERTAS DE CAMPESINO: ');
        LOOP
            FETCH offer_cursor INTO v_record;

            EXIT WHEN offer_cursor%NOTFOUND;

            DBMS_OUTPUT.PUT_LINE(v_record.NombreCompleto ||': '|| v_record.DescripcionOferta ||' - $'|| v_record.price);
        END LOOP;

        CLOSE offer_cursor;
    END ordenar_ofertas_campesino;
    PROCEDURE comprar (
    p_comId IN INT,
    p_facId IN INT,
    p_ofeId IN INT,
    p_comCantidadUnidades IN INT
    )
    IS
    BEGIN
      INSERT INTO COMPRA (comId, facId, ofeId, comCantidadUnidades,comSubtotal)
      VALUES (p_comId, p_facId, p_ofeId, p_comCantidadUnidades,calcular_subtotal(p_ofeId,p_comCantidadUnidades));
END comprar;

END paquete_compras;

--TRIGGERS
CREATE OR REPLACE TRIGGER TR_cantidad_valida
BEFORE INSERT OR UPDATE OF comCantidadUnidades ON Compra
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        IF(:NEW.comCantidadUnidades > paquete_compras.cantidad_disponible(:NEW.ofeId)) THEN
            RAISE_APPLICATION_ERROR(-20200,'Cantidad no disponible');
        END IF;
    END IF;
    IF UPDATING THEN
        IF(:NEW.comCantidadUnidades > paquete_compras.cantidad_disponible(:OLD.ofeId)) THEN
            RAISE_APPLICATION_ERROR(-20200,'Cantidad no disponible');
        END IF;
    END IF;
END;
drop trigger actualizar_precio_oferta;
-- Disparar el trigger
BEGIN
    insertar_compra(10, 1, 1, 30,60000);
END;
--Bloque para probar el procedimiento comprar(cantidad_valida)
BEGIN
    paquete_compras.comprar(6,1,1,11);
    --eliminar_compra(6);
END;
--Select para revisar la compra
select * from compra

--Bloque para probar el subtotal
SET SERVEROUTPUT ON
BEGIN
    DBMS_OUTPUT.PUT_LINE('Subtotal de 5kg de semillas de maiz ' || paquete_compras.calcular_subtotal(1,5));
END;
--Bloque anonimo que testea ordenamiento por campesino con las ofertas del fredy
SET SERVEROUTPUT ON
BEGIN
paquete_compras.ordenar_ofertas_campesino(1);
END;
--Bloque anonimo que ordena por tipo de producto 
SET SERVEROUTPUT ON
BEGIN
paquete_compras.list_ofertas_tipo;
END;
/*
Bloque para ordenar por fecha de caducidad
*/
BEGIN 
    paquete_compras.ord_prod_fecha_cad();
END;
/*
Bloque para ordenar por fecha de caducidad segun tipo de producto
*/
BEGIN 
    paquete_compras.ord_prod_fecha_cad('Insumo');
END;
/*
Bloque para ordenar por ofertas mas baratas
*/
BEGIN 
    paquete_compras.productos_mas_baratos();
END;