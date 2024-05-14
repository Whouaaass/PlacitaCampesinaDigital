drop table municipio cascade constraint;
drop table producto cascade constraint;
drop table factura cascade constraint;
drop table compra cascade constraint;
drop table oferta cascade constraint;
drop table usuario cascade constraint;


-- Tabla MUNICIPIO
CREATE TABLE MUNICIPIO (
    munCodigo INT GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),
    munNombre varchar2(50) NOT NULL,
    munTipoClima varchar2(50) NOT NULL, 
    CONSTRAINT pk_municipio primary key (munCodigo),
    CONSTRAINT ckc_munTipoClima CHECK (munTipoClima IN ('Frio', 'Templado', 'Caliente'))
);

-- Tabla PRODUCTO
CREATE TABLE PRODUCTO (
    proId INT GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),
    proNombre varchar2(100) NOT NULL,
    proTipo varchar2(50) NOT NULL ,
    CONSTRAINT pk_producto primary key (proId),
    CONSTRAINT ckc_prodTipo CHECK (proTipo IN ('Insumo', 'Animal', 'Fruta', 'Vegetal'))
);

-- Tabla USUARIO
CREATE TABLE USUARIO (
    usuId NUMBER(10,0) NOT NULL,
    munCodigo INT NOT NULL,
    usuNombre varchar2(50) NOT NULL,
    usuApellido varchar2(50) NOT NULL,
    usuDireccion varchar2(100) NOT NULL,
    usuContrasenia varchar2(20) NOT NULL,
    usuTelefono int NOT NULL,
    usuTipo varchar2(20),
    CONSTRAINT pk_usuId PRIMARY KEY (usuId),
    CONSTRAINT fk_usu_munCodigo FOREIGN KEY (munCodigo) REFERENCES MUNICIPIO(munCodigo),
    CONSTRAINT ckc_usuTipo CHECK (usuTipo IN ('Comprador', 'Campesino'))
);

-- Tabla OFERTA
CREATE TABLE OFERTA (
    ofeId INT GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),
    usuId NUMBER(10,0) NOT NULL,
    proId INT NOT NULL,
    ofeFechaCaducidad DATE NOT NULL,
    ofeCantidad INT NOT NULL,
    ofeDescripcion varchar2(100) NOT NULL,
    ofePrecio NUMBER(9,2) NOT NULL,
    ofeActivo CHAR(1) NOT NULL,
    CONSTRAINT pk_ofeId PRIMARY KEY (ofeId),
    CONSTRAINT fk_ofer_usuId FOREIGN KEY (usuId) REFERENCES USUARIO(usuId),
    CONSTRAINT fk_ofer_proId FOREIGN KEY (proId) REFERENCES PRODUCTO(proId),
    CONSTRAINT chk_ofer_estado CHECK (ofeActivo IN('Y','N'))
);

-- Tabla FACTURA
CREATE TABLE FACTURA (
    facId INT GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),
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

--PAQUETES
--PAQUETE Municipio
CREATE OR REPLACE PACKAGE paq_municipio IS
--Funciones
FUNCTION codigo_municipio(p_munNombre IN Municipio.munNombre%TYPE) RETURN Municipio.munCodigo%TYPE;
--Procedimientos
PROCEDURE insertar_municipio (    
    p_munNombre IN varchar2,
    p_munTipoClima IN varchar2
);
PROCEDURE actualizar_clima_municipio (
    p_munCodigo IN INT,
    p_munTipoClima IN varchar2
);
PROCEDURE eliminar_municipio (
    p_munId IN MUNICIPIO.munCodigo%type
);
END paq_municipio;
--Cuerpo
CREATE OR REPLACE PACKAGE BODY paq_municipio IS
--Funciones
FUNCTION codigo_municipio(p_munNombre IN Municipio.munNombre%TYPE) 
    RETURN Municipio.munCodigo%TYPE
    IS
        v_codigo Municipio.munCodigo%TYPE;
    BEGIN
        SELECT munCodigo INTO v_codigo FROM Municipio WHERE munNombre = p_munNombre;
        RETURN v_codigo;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Municipio inexistente');
            v_codigo :=-1;
            RETURN v_codigo;
    END codigo_municipio;
--Procedimientos
PROCEDURE insertar_municipio (    
    p_munNombre IN varchar2,
    p_munTipoClima IN varchar2
)
IS
BEGIN
    INSERT INTO MUNICIPIO ( munNombre, munTipoClima)
    VALUES ( p_munNombre, p_munTipoClima);
    COMMIT;
END insertar_municipio;
PROCEDURE actualizar_clima_municipio (
    p_munCodigo IN INT,
    p_munTipoClima IN varchar2
)
IS
BEGIN
    UPDATE MUNICIPIO
    SET munTipoClima = p_munTipoClima
    WHERE munCodigo = p_munCodigo;
    COMMIT;
END actualizar_clima_municipio;
PROCEDURE eliminar_municipio (
    p_munId IN MUNICIPIO.munCodigo%type
)
IS
BEGIN
    DELETE FROM MUNICIPIO WHERE munCodigo = p_munId;
END eliminar_municipio;
END paq_municipio;

--Paquete producto
CREATE OR REPLACE PACKAGE paq_producto IS
--Funciones
--Procedimientos
PROCEDURE eliminar_producto (
    p_proId IN producto.proId%type
);
PROCEDURE actualizar_producto (
    p_proId IN INT,
    p_proNombre IN varchar2,
    p_proTipo IN varchar2
);
PROCEDURE insertar_producto(    
    p_proNombre IN varchar2,
    p_proTipo IN varchar2
);
END paq_producto;
--Cuerpo
CREATE OR REPLACE PACKAGE BODY paq_producto IS
--Funciones
--Procedimientos
PROCEDURE eliminar_producto (
    p_proId IN producto.proId%type
)
IS
BEGIN
    DELETE FROM PRODUCTO WHERE proId = p_proId;
END eliminar_producto;
PROCEDURE actualizar_producto (
    p_proId IN INT,
    p_proNombre IN varchar2,
    p_proTipo IN varchar2
)
IS
BEGIN
    UPDATE PRODUCTO
    SET proNombre = p_proNombre,
        proTipo = p_proTipo
    WHERE proId = p_proId;
    COMMIT;
END actualizar_producto;
PROCEDURE insertar_producto (    
    p_proNombre IN varchar2,
    p_proTipo IN varchar2
)
IS
BEGIN
    INSERT INTO PRODUCTO ( proNombre, proTipo)
    VALUES ( p_proNombre, p_proTipo);
    COMMIT;
END insertar_producto;
END paq_producto;
--CRUD Producto
--Insertar Producto
CREATE OR REPLACE PACKAGE paq_usuario IS
--Funciones
--Procedimientos
PROCEDURE eliminar_usuario (
    p_usuId IN usuario.usuId%type
);

PROCEDURE actualizar_usuario (
    p_usuId IN NUMBER,
    p_munCodigo IN INT,
    p_usuNombre IN varchar2,
    p_usuApellido IN varchar2,
    p_usuDireccion IN varchar2,
    p_usuTelefono IN INT, 
    p_usuContrasenia IN varchar2,
    p_usuTipo IN varchar2
);
PROCEDURE insertar_usuario (
    p_usuId IN NUMBER,
    p_munCodigo IN INT,
    p_usuNombre IN varchar2,
    p_usuApellido IN varchar2,
    p_usuDireccion IN varchar2,
    p_usuTelefono IN INT,
    p_usuContrasenia IN varchar2,
    p_usuTipo IN varchar2
);
END paq_usuario;
--Cuerpo
CREATE OR REPLACE PACKAGE BODY paq_usuario IS
--Funciones
--Procedimientos
PROCEDURE eliminar_usuario (
    p_usuId IN usuario.usuId%type
)
IS
BEGIN
    DELETE FROM USUARIO WHERE usuId = p_usuId;
END eliminar_usuario;
PROCEDURE actualizar_usuario (
    p_usuId IN NUMBER,
    p_munCodigo IN INT,
    p_usuNombre IN varchar2,
    p_usuApellido IN varchar2,
    p_usuDireccion IN varchar2,
    p_usuTelefono IN INT, 
    p_usuContrasenia IN varchar2,
    p_usuTipo IN varchar2
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

PROCEDURE insertar_usuario (
    p_usuId IN NUMBER,
    p_munCodigo IN INT,
    p_usuNombre IN varchar2,
    p_usuApellido IN varchar2,
    p_usuDireccion IN varchar2,
    p_usuTelefono IN INT,
    p_usuContrasenia IN varchar2,
    p_usuTipo IN varchar2
)
IS
BEGIN
    INSERT INTO USUARIO (usuId, munCodigo, usuNombre, usuApellido, usuDireccion, usuTelefono, usuContrasenia, usuTipo)
    VALUES (p_usuId, p_munCodigo, p_usuNombre, p_usuApellido, p_usuDireccion, p_usuTelefono,  p_usuContrasenia, p_usuTipo);
    COMMIT;
END insertar_usuario;
END paq_usuario;

--Paquete oferta
CREATE OR REPLACE PACKAGE paq_oferta IS
--Funciones
FUNCTION calcular_subtotal(p_ofeId Oferta.ofeId%TYPE, p_cantidad Compra.comCantidadUnidades%TYPE) RETURN Compra.comSubtotal%TYPE;
FUNCTION cantidad_disponible(p_ofeId IN Oferta.ofeId%TYPE) RETURN Oferta.ofeCantidad%TYPE;
--Procedimientos
PROCEDURE ofertas_mas_baratas;
PROCEDURE ord_ofe_fecha_cad;
PROCEDURE ord_ofe_fecha_cad(p_proTipo IN varchar2);
PROCEDURE list_ofertas_tipo;
PROCEDURE ordenar_ofertas_campesino(p_campesino_id IN NUMBER);
PROCEDURE desactivar_oferta (
    p_ofeId IN oferta.ofeId%type
);
PROCEDURE actualizar_oferta (
    p_ofeId IN INT,
    p_usuId IN NUMBER,
    p_proId IN INT,
    p_ofeFechaCaducidad IN DATE,
    p_ofeDescripcion IN varchar2,
    p_ofeCantidad IN INT,
    p_ofePrecio NUMBER,
    p_ofeActivo CHAR
);
PROCEDURE actualizar_oferta (
    p_ofeId IN INT,
    p_usuId IN INT,
    p_proNombre IN VARCHAR2,
    p_ofeFechaCaducidad IN DATE,
    p_ofeDescripcion IN varchar2,
    p_ofeCantidad IN INT,
    p_ofePrecio NUMBER,
    p_ofeActivo CHAR
);
PROCEDURE insertar_oferta (    
    p_usuId IN NUMBER,
    p_proId IN INT,
    p_ofeFechaCaducidad IN DATE,
    p_ofeDescripcion IN varchar2,
    p_ofeCantidad IN INT,
    p_ofePrecio NUMBER,
    p_ofeActivo CHAR
);
PROCEDURE insertar_oferta (
    p_usuId IN NUMBER,
    p_proNombre IN VARCHAR2,
    p_ofeFechaCaducidad IN DATE,
    p_ofeDescripcion IN varchar2,
    p_ofeCantidad IN INT,
    p_ofePrecio NUMBER,
    p_ofeActivo CHAR
);
END paq_oferta;
--Cuerpo
CREATE OR REPLACE PACKAGE BODY paq_oferta IS
--Funciones
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
    
--Procedimientos
PROCEDURE ofertas_mas_baratas IS
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
    END ofertas_mas_baratas;
PROCEDURE ord_ofe_fecha_cad IS
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
END ord_ofe_fecha_cad;
PROCEDURE ord_ofe_fecha_cad(p_proTipo IN varchar2) IS
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
    END ord_ofe_fecha_cad;
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
PROCEDURE desactivar_oferta (
    p_ofeId IN oferta.ofeId%type
)
IS
BEGIN
    UPDATE OFERTA
    SET ofeActivo = 'N'
    WHERE ofeId = p_ofeId;
    COMMIT;
END desactivar_oferta;
PROCEDURE actualizar_oferta (
    p_ofeId IN INT,
    p_usuId IN NUMBER,
    p_proId IN INT,
    p_ofeFechaCaducidad IN DATE,
    p_ofeDescripcion IN varchar2,
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
PROCEDURE actualizar_oferta (
    p_ofeId IN INT,
    p_usuId IN INT,
    p_proNombre IN VARCHAR2,
    p_ofeFechaCaducidad IN DATE,
    p_ofeDescripcion IN varchar2,
    p_ofeCantidad IN INT,
    p_ofePrecio NUMBER,
    p_ofeActivo CHAR
)
IS
    v_proid PRODUCTO.proId%TYPE;
BEGIN
    SELECT proId INTO v_proid FROM PRODUCTO WHERE proNombre = p_proNombre;
    UPDATE OFERTA
    SET ofeFechaCaducidad = p_ofeFechaCaducidad,
        ofeCantidad = p_ofeCantidad,
        ofePrecio = p_ofePrecio,
        ofeDescripcion = p_ofeDescripcion, 
        ofeActivo = p_ofeActivo
    WHERE ofeId = p_ofeId AND usuId = p_usuId AND proId = v_proid;
    COMMIT;
END actualizar_oferta;
PROCEDURE insertar_oferta (    
    p_usuId IN NUMBER,
    p_proId IN INT,
    p_ofeFechaCaducidad IN DATE,
    p_ofeDescripcion IN varchar2,
    p_ofeCantidad IN INT,
    p_ofePrecio NUMBER,
    p_ofeActivo CHAR
)
IS
BEGIN
    INSERT INTO OFERTA (usuId, proId, ofeFechaCaducidad,ofeDescripcion,ofeCantidad,ofePrecio,ofeActivo)
    VALUES (p_usuId, p_proId, p_ofeFechaCaducidad, p_ofeDescripcion,p_ofeCantidad, p_ofePrecio,p_ofeActivo);
    COMMIT;
END insertar_oferta;
PROCEDURE insertar_oferta (
    p_usuId IN NUMBER,
    p_proNombre IN VARCHAR2,
    p_ofeFechaCaducidad IN DATE,
    p_ofeDescripcion IN varchar2,
    p_ofeCantidad IN INT,
    p_ofePrecio NUMBER,
    p_ofeActivo CHAR
)
IS
    v_proid PRODUCTO.proId%TYPE;
 BEGIN
    SELECT proId INTO v_proid FROM PRODUCTO WHERE proNombre = p_proNombre;
    INSERT INTO OFERTA (usuId, proId, ofeFechaCaducidad,ofeDescripcion,ofeCantidad,ofePrecio,ofeActivo)
    VALUES (p_usuId, v_proId, p_ofeFechaCaducidad, p_ofeDescripcion,p_ofeCantidad, p_ofePrecio,p_ofeActivo);
    COMMIT;
END insertar_oferta;
END paq_oferta;

--Paquete factura
CREATE OR REPLACE PACKAGE paq_factura IS
--Funciones
--Procedimientos
--PROCEDIMIENTO PARA FACTURA
PROCEDURE eliminar_factura (
    p_facId IN factura.facId%type
);
PROCEDURE actualizar_fecha_factura (
    p_facId IN INT,
    p_usuId IN NUMBER,
    p_facFecha IN DATE
);
PROCEDURE insertar_factura (    
    p_usuId IN NUMBER,
    p_facFecha IN DATE,
    p_facTotal IN DECIMAL
);
END paq_factura;
--Cuerpo
CREATE OR REPLACE PACKAGE BODY paq_factura IS
--Funciones
--Procedimientos
PROCEDURE eliminar_factura (
    p_facId IN factura.facId%type
)
IS
BEGIN
    DELETE FROM FACTURA WHERE facId = p_facId;
END eliminar_factura;
PROCEDURE actualizar_fecha_factura (
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
PROCEDURE insertar_factura (    
    p_usuId IN NUMBER,
    p_facFecha IN DATE,
    p_facTotal IN DECIMAL
)
IS
BEGIN
    INSERT INTO FACTURA ( usuId, facFecha, facTotal)
    VALUES ( p_usuId, p_facFecha, p_facTotal);
    COMMIT;
END insertar_factura;
END paq_factura;

--Paquete compra
CREATE OR REPLACE PACKAGE paq_compra IS
--Funciones
--Procedimientos
PROCEDURE comprar(p_comId IN INT,
    p_facId IN INT,
    p_ofeId IN INT,
    p_comCantidadUnidades IN INT);
PROCEDURE eliminar_compra (
    p_comId IN compra.comId%type
);
PROCEDURE actualizar_compra (
    p_comId IN INT,
    p_facId IN INT,
    p_ofeId IN INT,
    p_comCantidadUnidades IN INT,
    p_comSubtotal NUMBER
);

PROCEDURE insertar_compra (
    p_comId IN INT,
    p_facId IN INT,
    p_ofeId IN INT,
    p_comCantidadUnidades IN INT,
    p_comSubtotal NUMBER
);
END paq_compra;
--Cuerpo
CREATE OR REPLACE PACKAGE BODY paq_compra IS 
--Funciones
--Procedimientos
 PROCEDURE comprar (
    p_comId IN INT,
    p_facId IN INT,
    p_ofeId IN INT,
    p_comCantidadUnidades IN INT
    )
    IS
    BEGIN
      INSERT INTO COMPRA (comId, facId, ofeId, comCantidadUnidades,comSubtotal)
      VALUES (p_comId, p_facId, p_ofeId, p_comCantidadUnidades,paq_oferta.calcular_subtotal(p_ofeId,p_comCantidadUnidades));
END comprar;
PROCEDURE eliminar_compra (
    p_comId IN compra.comId%type
)
IS
BEGIN
    DELETE FROM COMPRA WHERE comId = p_comId;
END eliminar_compra;
PROCEDURE actualizar_compra (
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

PROCEDURE insertar_compra (
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
END paq_compra;

--TRIGGERS
CREATE OR REPLACE TRIGGER validar_longitud_cedula
BEFORE INSERT ON Usuario
FOR EACH ROW
DECLARE
    v_cedula_length NUMBER(2);
BEGIN
    -- Obtener la longitud de la cédula
    v_cedula_length := LENGTH(:NEW.usuId);
    
    -- Verificar si la longitud es mayor que 10
    IF v_cedula_length < 8 THEN
        -- Lanzar una excepción si la longitud es mayor que 10
        RAISE_APPLICATION_ERROR(-20001, 'La cédula no puede tener menos de 8 dígitos.');
    END IF;
END validar_longitud_cedula;

CREATE OR REPLACE TRIGGER TR_cantidad_valida
BEFORE INSERT OR UPDATE OF comCantidadUnidades ON Compra
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        IF(:NEW.comCantidadUnidades > paq_oferta.cantidad_disponible(:NEW.ofeId)) THEN
            RAISE_APPLICATION_ERROR(-20200,'Cantidad no disponible');
        END IF;
    END IF;
    IF UPDATING THEN
        IF(:NEW.comCantidadUnidades > paq_oferta.cantidad_disponible(:OLD.ofeId)) THEN
            RAISE_APPLICATION_ERROR(-20200,'Cantidad no disponible');
        END IF;
    END IF;
END TR_cantidad_valida;

CREATE OR REPLACE TRIGGER validar_longitud_cedula
BEFORE INSERT ON Usuario
FOR EACH ROW
DECLARE
    v_cedula_length NUMBER(2);
BEGIN
    -- Obtener la longitud de la c?dula
    v_cedula_length := LENGTH(:NEW.usuId);
    
    -- Verificar si la longitud es mayor que 10
    IF v_cedula_length < 8 THEN
        -- Lanzar una excepci?n si la longitud es mayor que 10
        RAISE_APPLICATION_ERROR(-20001, 'La c?dula no puede tener menos de 8 d?gitos.');
    END IF;
END validar_longitud_cedula;
--Eliminar datos de las tablas
BEGIN
delete from compra;
delete from factura;
delete from oferta;
delete from usuario;
delete from producto;
delete from municipio;
END;
--BLOQUE ANONIMO PARA INSERCIONES
BEGIN
    -- Inserciones en la tabla MUNICIPIO
    paq_municipio.insertar_municipio('Timbio', 'Templado');
    paq_municipio.insertar_municipio('Buenos Aires', 'Frio');
    paq_municipio.insertar_municipio('Caloto', 'Templado');
    paq_municipio.insertar_municipio('Corinto', 'Frio');
    paq_municipio.insertar_municipio('Guachene', 'Caliente');
    paq_municipio.insertar_municipio('Miranda', 'Templado');
    paq_municipio.insertar_municipio('Piendamo', 'Frio');
    paq_municipio.insertar_municipio('Rosas', 'Frio');
    paq_municipio.insertar_municipio('Santander de Quilichao', 'Caliente');
    paq_municipio.insertar_municipio('Popayán', 'Templado');
    paq_municipio.insertar_municipio('Cajibio', 'Templado');
    paq_municipio.insertar_municipio('Silvia', 'Templado');
    paq_municipio.insertar_municipio('Sotara', 'Templado');
    paq_municipio.insertar_municipio('Suarez', 'Caliente');
    paq_municipio.insertar_municipio('Timbiqui', 'Caliente');
    paq_municipio.insertar_municipio('Totoro', 'Templado');
    paq_municipio.insertar_municipio('Villa Rica', 'Templado');
    paq_municipio.insertar_municipio('Toribio', 'Frio');
    paq_municipio.insertar_municipio('Almaguer', 'Frio');
    paq_municipio.insertar_municipio('Argelia', 'Frio');
    paq_municipio.insertar_municipio('Balboa', 'Templado');
    paq_municipio.insertar_municipio('Bolivar', 'Templado');
    paq_municipio.insertar_municipio('Lopez de Micay', 'Caliente');
    paq_municipio.insertar_municipio('El Tambo', 'Templado');
    paq_municipio.insertar_municipio('Florencia', 'Frio');
    paq_municipio.insertar_municipio('Guapi', 'Caliente');
    paq_municipio.insertar_municipio('Inza', 'Templado');
    paq_municipio.insertar_municipio('Jambalo', 'Frio');
    paq_municipio.insertar_municipio('La Sierra', 'Frio');
    paq_municipio.insertar_municipio('La Vega', 'Templado');
    paq_municipio.insertar_municipio('Mercaderes', 'Templado');
    paq_municipio.insertar_municipio( 'Padilla', 'Frio');
    paq_municipio.insertar_municipio( 'Patia', 'Caliente');
    paq_municipio.insertar_municipio( 'Piamonte', 'Templado');
    paq_municipio.insertar_municipio( 'Purace', 'Frio');
    paq_municipio.insertar_municipio( 'Caldono', 'Caliente');
    paq_municipio.insertar_municipio( 'San Sebastian', 'Templado');

    -- Inserciones en la tabla PRODUCTO
    paq_producto.insertar_producto('Semillas de Maíz', 'Insumo');
    paq_producto.insertar_producto('Gallina', 'Animal');
    paq_producto.insertar_producto('Manzanas', 'Fruta');
    paq_producto.insertar_producto('Tomates', 'Vegetal');
    paq_producto.insertar_producto('Fertilizante Orgánico', 'Insumo');
    paq_producto.insertar_producto('Fertilizante inorganico', 'Insumo');
    paq_producto.insertar_producto('Mula', 'Animal');
    paq_producto.insertar_producto('Fresas', 'Fruta');
    paq_producto.insertar_producto('Espinaca', 'Vegetal');
    paq_producto.insertar_producto('Semillas de cacao', 'Insumo');

    -- Inserciones en la tabla USUARIO
    paq_usuario.insertar_usuario(10492021, 1, 'Freddy', 'Anaya', 'Calle 15 #7-33',1223, 'papitas20', 'Campesino');
    paq_usuario.insertar_usuario(10492022, 4, 'Jhoan', 'Chacon', 'Calle 19 #3-16',3232, 'arroz20', 'Comprador');
    paq_usuario.insertar_usuario(10492023, 2, 'Jonathan', 'Guejia', 'Carrera 2 #1-32',2323, 'ola123', 'Campesino');
    paq_usuario.insertar_usuario(10492025, 1, 'Julian', 'Alvarez', 'Transversal 5 #1-32',5445, 'contra123', 'Comprador');
    paq_usuario.insertar_usuario(10492026, 5, 'Jorge', 'Vilota', 'Calle 11 #2-63',1233, 'campo20', 'Comprador');
    paq_usuario.insertar_usuario(10492027, 3, 'Juan', 'Hernandez', 'Calle 15 #1-3',2322, 'azucar220', 'Comprador');

    -- Inserciones en la tabla OFERTA
    paq_oferta.insertar_oferta(10492021, 1, SYSDATE + 10,'Semillas secas' ,20,1000,'Y');
    paq_oferta.insertar_oferta(10492023, 2, SYSDATE + 5,'Gallina rabona' ,15,7000,'Y');
    paq_oferta.insertar_oferta(10492021, 3, SYSDATE + 8, 'Manzanas verdes muy verdes' ,10,3000,'Y');
    paq_oferta.insertar_oferta(10492021, 4, SYSDATE + 12, 'Tomates muy rojos' ,5,2500,'Y');
    paq_oferta.insertar_oferta(10492023, 5, SYSDATE + 7,'Fertilizante de marca DiomedesOrg' ,25,20000,'Y');

    -- Inserciones en la tabla FACTURA
    paq_factura.insertar_factura(10492021, SYSDATE, 20000.50);
    paq_factura.insertar_factura(10492022, SYSDATE - 1, 11500.25);
    paq_factura.insertar_factura(10492023, SYSDATE - 2, 12000.75);
    paq_factura.insertar_factura(10492025, SYSDATE - 3, 59800.00);
    paq_factura.insertar_factura(10492027, SYSDATE - 4, 21500.75);

    -- Inserciones en la tabla COMPRA
    paq_compra.insertar_compra(1, 1, 1, 2,1000);
    paq_compra.insertar_compra(2, 2, 2, 1,2300);
    paq_compra.insertar_compra(3, 3, 3, 3,2150);
    paq_compra.insertar_compra(4, 4, 4, 1,4500);
    paq_compra.insertar_compra(5, 5, 5, 5,5000);

    COMMIT;
END;

--BLOQUE ANONIMO PARA LAS ACTUALIZACIONES(3 UPDATE POR CADA TABLA)
BEGIN
    --UPDATE PARA MUNICIPIO
    paq_municipio.actualizar_clima_municipio(3, 'Caliente');
    paq_municipio.actualizar_clima_municipio(7, 'Templado');
    paq_municipio.actualizar_clima_municipio(6, 'Caliente');

    --UPDATE PARA PRODUCTO
    paq_producto.actualizar_producto(3, 'Peras', 'Fruta');
    paq_producto.actualizar_producto(2, 'Vaca', 'Animal');
    paq_producto.actualizar_producto(1, 'Abono', 'Insumo');

    --UPDATE PARA USUARIO
    paq_usuario.actualizar_usuario(10492025, 1, 'Jude', 'Bellingham', 'Carrera 3 #7-14','1234', 'rg4l', 'Campesino');
    paq_usuario.actualizar_usuario(10492026, 5, 'Ferland', 'Mendy', 'Carrera 8 #2-15','6532', 'fumarola33', 'Campesino');
    paq_usuario.actualizar_usuario(10492027, 3, 'Rodrygo', 'Goes', 'Calle 12 #7-14','2323', 'papas01', 'Comprador');
  
    --UPDATE PARA OFERTA
    paq_oferta.actualizar_oferta(1, 10492021, 1, TO_DATE('27/05/24','DD/MM/YY'),'Semillas mojadas' ,28, 1500, 'Y');
    paq_oferta.actualizar_oferta(3, 10492021, 3, TO_DATE('20/04/24','DD/MM/YY'),'Manzana menos manzanosa' ,15, 4000, 'Y');
    paq_oferta.actualizar_oferta(5, 10492023, 5, TO_DATE('01/04/24','DD/MM/YY'), ':(',30, 22000, 'Y');

    --UPDATE PARA FACTURA
    paq_factura.actualizar_fecha_factura(1, 10492021, SYSDATE - 5);
    paq_factura.actualizar_fecha_factura(3, 10492023, SYSDATE - 4);
    paq_factura.actualizar_fecha_factura(5, 10492026, SYSDATE + 7);

    --UPDATE COMPRA
    paq_compra.actualizar_compra(1, 1, 1, 5, 10000);
    paq_compra.actualizar_compra(3, 3, 3, 4, 4500);
    paq_compra.actualizar_compra(5, 5, 5, 10, 5400);
    
    COMMIT;
END;

--BLOQUE ANONIMO PARA LA DESACTIVACION DE OFERTAS (3)
BEGIN
    --DESACTIVAR OFERTA
    paq_oferta.desactivar_oferta(1);
    paq_oferta.desactivar_oferta(2);
    paq_oferta.desactivar_oferta(3);
    COMMIT;
END;
-- Disparar el trigger cantidad valida
BEGIN
    insertar_compra(10, 1, 1, 30,60000);
END;
--Bloque para probar el procedimiento comprar(cantidad_valida)
BEGIN
    paq_compra.comprar(6,1,1,11);
    --eliminar_compra(6);
END;
--Select para revisar la compra
select * from compra

--Bloque para probar el subtotal
SET SERVEROUTPUT ON
BEGIN
    DBMS_OUTPUT.PUT_LINE('Subtotal de 5kg de semillas de maiz ' || paq_oferta.calcular_subtotal(1,5));
END;
--Bloque anonimo que testea ordenamiento por campesino con las ofertas del fredy
SET SERVEROUTPUT ON
BEGIN
paq_oferta.ordenar_ofertas_campesino(10492021);
END;
--Bloque anonimo que ordena por tipo de producto 
SET SERVEROUTPUT ON
BEGIN
paq_oferta.list_ofertas_tipo;
END;
/*
Bloque para ordenar por fecha de caducidad
*/
BEGIN 
    paq_oferta.ord_ofe_fecha_cad();
END;
/*
Bloque para ordenar por fecha de caducidad segun tipo de producto
*/
BEGIN 
    paq_oferta.ord_ofe_fecha_cad('Insumo');
END;
/*
Bloque para ordenar por ofertas mas baratas
*/
BEGIN 
    paq_oferta.ofertas_mas_baratas();
END;