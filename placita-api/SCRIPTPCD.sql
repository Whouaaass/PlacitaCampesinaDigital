select * from user_triggers;
--Push

drop table municipio cascade constraint;
drop table producto cascade constraint;
drop table factura cascade constraint;
drop table compra cascade constraint;
drop table oferta cascade constraint;
drop table usuario cascade constraint;
--Eliminar datos de las tablas
/*BEGIN
delete from compra;
delete from factura;
delete from oferta;
delete from usuario;
delete from producto;
delete from municipio;
END;*/
-- Tabla MUNICIPIO
CREATE TABLE MUNICIPIO (
    munCodigo INT NOT NULL,
    munNombre varchar2(50) NOT NULL,
    munTipoClima varchar2(50) NOT NULL, 
    CONSTRAINT pk_municipio primary key (munCodigo),
    CONSTRAINT ckc_munTipoClima CHECK (munTipoClima IN ('Frio', 'Templado', 'Caliente'))
);

-- Tabla PRODUCTO
CREATE TABLE PRODUCTO (
    proId INT NOT NULL,
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
    ofeId INT NOT NULL,
    usuId NUMBER(10,0) NOT NULL,
    proId INT NOT NULL,
    ofeFechaCaducidad DATE NOT NULL,
    ofeCantidad INT NOT NULL,
    ofeDescripcion varchar2(100) NOT NULL,
    ofePrecio NUMBER(9,2) NOT NULL,
    ofeActivo CHAR(1) NOT NULL,
    CONSTRAINT pk_ofeId PRIMARY KEY (ofeId),
    CONSTRAINT uq_ofe UNIQUE (ofeId, usuId, proId, ofeFechaCaducidad, ofeCantidad, ofeDescripcion, ofePrecio, ofeActivo),
    CONSTRAINT fk_ofer_usuId FOREIGN KEY (usuId) REFERENCES USUARIO(usuId),
    CONSTRAINT fk_ofer_proId FOREIGN KEY (proId) REFERENCES PRODUCTO(proId),
    CONSTRAINT chk_ofer_estado CHECK (ofeActivo IN('Y','N'))
);
--Secuencia de id oferta 
CREATE SEQUENCE ofeId_seq
START WITH 1
INCREMENT BY 1
NOCACHE;
--Trigger ins_oferta
CREATE OR REPLACE TRIGGER TG_ins_oferta
BEFORE INSERT ON oferta
FOR EACH ROW
BEGIN
    :NEW.ofeId := ofeId_seq.NEXTVAL;
END;


-- Tabla FACTURA
CREATE TABLE FACTURA (
    facId INT NOT NULL,
    usuId NUMBER NOT NULL,
    facFecha DATE NOT NULL,
    facTotal DECIMAL(11,2) NOT NULL,
    CONSTRAINT PK_facId PRIMARY KEY (facId),
    CONSTRAINT FK_FAC_usuId FOREIGN KEY (usuId) REFERENCES USUARIO(usuId)
);
--Secuencia de id factura
CREATE SEQUENCE facId_seq
START WITH 1
INCREMENT BY 1
NOCACHE;
--Trigger ins_factura
CREATE OR REPLACE TRIGGER TG_ins_factura
BEFORE INSERT ON factura
FOR EACH ROW
BEGIN
    if :NEW.facId is null then
        :NEW.facId := facId_seq.NEXTVAL;
    end if;
END;
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
--Secuencia de id compra
CREATE SEQUENCE comId_seq
START WITH 1
INCREMENT BY 1
NOCACHE;
--Trigger ins_compra
CREATE OR REPLACE TRIGGER TG_ins_compra
BEFORE INSERT ON compra
FOR EACH ROW
BEGIN
    :NEW.comId := comId_seq.NEXTVAL;
END;
--PAQUETES
--PAQUETE Municipio
CREATE OR REPLACE PACKAGE paq_municipio IS
--Funciones
FUNCTION codigo_municipio(p_munNombre IN Municipio.munNombre%TYPE) RETURN Municipio.munCodigo%TYPE;
--Procedimientos
PROCEDURE insertar_municipio (
    p_munCodigo IN INT,
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
    p_munCodigo IN INT,
    p_munNombre IN varchar2,
    p_munTipoClima IN varchar2
)
IS
BEGIN
    INSERT INTO MUNICIPIO (munCodigo, munNombre, munTipoClima)
    VALUES (p_munCodigo, p_munNombre, p_munTipoClima);
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
    p_proId IN INT,
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
    p_proId IN INT,
    p_proNombre IN varchar2,
    p_proTipo IN varchar2
)
IS
BEGIN
    INSERT INTO PRODUCTO (proId, proNombre, proTipo)
    VALUES (p_proId, p_proNombre, p_proTipo);
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
PROCEDURE insertar_usuario (
    p_usuId IN NUMBER,
    p_munNombre IN varchar2,
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
PROCEDURE insertar_usuario (
    p_usuId IN NUMBER,
    p_munNombre IN varchar2,
    p_usuNombre IN varchar2,
    p_usuApellido IN varchar2,
    p_usuDireccion IN varchar2,
    p_usuTelefono IN INT,
    p_usuContrasenia IN varchar2,
    p_usuTipo IN varchar2
)
IS
    v_munCodigo MUNICIPIO.munCodigo%TYPE;
BEGIN
    SELECT munCodigo INTO v_munCodigo FROM MUNICIPIO WHERE munNombre = p_munNombre;
    INSERT INTO USUARIO (usuId, munCodigo, usuNombre, usuApellido, usuDireccion, usuTelefono, usuContrasenia, usuTipo)
    VALUES (p_usuId, v_munCodigo, p_usuNombre, p_usuApellido, p_usuDireccion, p_usuTelefono,  p_usuContrasenia, p_usuTipo);
    COMMIT;
END insertar_usuario;
END paq_usuario;



--Vistas
CREATE OR REPLACE VIEW v_ofertas as
SELECT
    OFERTA.ofeId as ofeid,
    USUARIO.usuid as usuid,    
    USUARIO.usunombre || ' ' || USUARIO.usuapellido AS ofertador,
    PRODUCTO.proNombre as nombre,
    PRODUCTO.proTipo as tipo,
    OFERTA.ofeFechaCaducidad as fechaCaducidad,
    OFERTA.ofeDescripcion as descripcion,
    OFERTA.ofeCantidad as cantidad,
    OFERTA.ofePrecio as precio
FROM OFERTA
INNER JOIN PRODUCTO ON OFERTA.proId = PRODUCTO.proId
INNER JOIN USUARIO ON OFERTA.usuId = USUARIO.usuId
WHERE OFERTA.ofeActivo = 'Y';

CREATE OR REPLACE VIEW v_ofertas_alf AS
SELECT
    OFERTA.ofeId as ofeid,
    USUARIO.usunombre || ' ' || USUARIO.usuapellido AS ofertador,
    PRODUCTO.proNombre as nombre,
    OFERTA.ofeFechaCaducidad as fechaCaducidad,
    OFERTA.ofeDescripcion as descripcion,
    OFERTA.ofeCantidad as cantidad,
    OFERTA.ofePrecio as precio
FROM OFERTA
INNER JOIN PRODUCTO ON OFERTA.proId = PRODUCTO.proId
INNER JOIN USUARIO ON OFERTA.usuId = USUARIO.usuId
ORDER BY PRODUCTO.proNombre ASC;
--SELECT * FROM v_ofertas_alf;


CREATE OR REPLACE VIEW v_ofertas_mas_baratas AS
SELECT
    OFERTA.ofeId as ofeid,
    USUARIO.usunombre || ' ' || USUARIO.usuapellido AS ofertador,
    PRODUCTO.proNombre as nombre,
    OFERTA.ofeFechaCaducidad as fechaCaducidad,
    OFERTA.ofeDescripcion as descripcion,
    OFERTA.ofeCantidad as cantidad,
    OFERTA.ofePrecio as precio
FROM OFERTA
INNER JOIN PRODUCTO ON OFERTA.proId = PRODUCTO.proId
INNER JOIN USUARIO ON OFERTA.usuId = USUARIO.usuId
ORDER BY Oferta.ofePrecio ASC;
--Select * from v_ofertas_mas_baratas


CREATE OR REPLACE VIEW v_ord_ofe_fecha_cad AS
SELECT proNombre, proTipo, TO_CHAR(ofeFechaCaducidad, 'DD MONTH YYYY') AS fechaCaducidad
FROM Oferta
INNER JOIN Producto ON Oferta.proId = Producto.proId
ORDER BY Oferta.ofeFechaCaducidad ASC;
--Select * from v_ord_ofe_fecha_cad;


CREATE OR REPLACE VIEW v_ofe_animal AS
SELECT proNombre, proTipo, usuNombre || ' ' || usuApellido AS Campesino,TO_CHAR(ofeFechaCaducidad, 'DD MONTH YYYY') AS fechaCaducidad
            FROM Oferta
            INNER JOIN Producto ON Oferta.proId = Producto.proId
            INNER JOIN USUARIO ON Oferta.usuId = Usuario.usuId
            WHERE Producto.proTipo = 'Animal'
            ORDER BY Oferta.ofeFechaCaducidad ASC;
--Select * from v_ofe_animal;
CREATE OR REPLACE VIEW v_ofe_vegetal AS
SELECT proNombre, proTipo, usuNombre || ' ' || usuApellido AS Campesino,TO_CHAR(ofeFechaCaducidad, 'DD MONTH YYYY') AS fechaCaducidad
            FROM Oferta
            INNER JOIN Producto ON Oferta.proId = Producto.proId
            INNER JOIN USUARIO ON Oferta.usuId = Usuario.usuId
            WHERE Producto.proTipo = 'Vegetal'
            ORDER BY Oferta.ofeFechaCaducidad ASC;
--Select * from v_ofe_vegetal;
CREATE OR REPLACE VIEW v_ofe_insumo AS
SELECT proNombre, proTipo, usuNombre || ' ' || usuApellido AS Campesino,TO_CHAR(ofeFechaCaducidad, 'DD MONTH YYYY') AS fechaCaducidad
            FROM Oferta
            INNER JOIN Producto ON Oferta.proId = Producto.proId
            INNER JOIN USUARIO ON Oferta.usuId = Usuario.usuId
            WHERE Producto.proTipo = 'Insumo'
            ORDER BY Oferta.ofeFechaCaducidad ASC;
--Select * from v_ofe_insumo;
CREATE OR REPLACE VIEW v_ofe_fruta AS
SELECT proNombre, proTipo, usuNombre || ' ' || usuApellido AS Campesino,TO_CHAR(ofeFechaCaducidad, 'DD MONTH YYYY') AS fechaCaducidad
            FROM Oferta
            INNER JOIN Producto ON Oferta.proId = Producto.proId
            INNER JOIN USUARIO ON Oferta.usuId = Usuario.usuId
            WHERE Producto.proTipo = 'Fruta'
            ORDER BY Oferta.ofeFechaCaducidad ASC;
--Select * from v_ofe_fruta;

--Paquete oferta
CREATE OR REPLACE PACKAGE paq_oferta IS
--Funciones
FUNCTION calcular_subtotal(p_ofeId Oferta.ofeId%TYPE, p_cantidad Compra.comCantidadUnidades%TYPE) RETURN Compra.comSubtotal%TYPE;
FUNCTION cantidad_disponible(p_ofeId IN Oferta.ofeId%TYPE) RETURN Oferta.ofeCantidad%TYPE;
FUNCTION obtener_descuento(p_ofeId IN  Oferta.ofeId%TYPE) RETURN Oferta.ofePrecio%TYPE;
--Procedimientos
PROCEDURE ord_ofe_nombre_Prod;
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
    p_usuId IN NUMBER,
    p_proNombre IN VARCHAR2,
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
FUNCTION obtener_descuento(p_ofeId IN  Oferta.ofeId%TYPE) RETURN Oferta.ofePrecio%TYPE IS
    v_fechaCaducidad Oferta.ofeFechaCaducidad%TYPE;
    v_hoy DATE := SYSDATE;
    v_descuento Oferta.ofePrecio%TYPE;
    v_precio Oferta.ofePrecio%TYPE;
    BEGIN
        SELECT ofeFechaCaducidad,ofePrecio INTO v_fechaCaducidad,v_precio FROM Oferta WHERE ofeId = p_ofeId;
        CASE
        WHEN v_fechaCaducidad > v_hoy + 30 THEN --Ningun descuento
            v_descuento := 0;
        WHEN v_fechaCaducidad BETWEEN v_hoy + 21 AND v_hoy + 30 THEN --10% de descuento
            v_descuento := v_precio * 0.1;
        WHEN v_fechaCaducidad BETWEEN v_hoy + 11 AND v_hoy + 20 THEN--20% de descuento
            v_descuento := v_precio * 0.2;
        WHEN v_fechaCaducidad <= v_hoy + 10 THEN--50% de descuento
            v_descuento := v_precio * 0.5;
        ELSE
            v_descuento := 0; -- Caso default
        END CASE;
        return v_descuento;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Oferta inexistente');
        v_descuento := 0;
        return v_descuento;
END obtener_descuento;        
--Procedimientos
PROCEDURE ord_ofe_nombre_Prod
IS
    CURSOR CursorOfertas IS
        SELECT
            OFERTA.ofeId,
            USUARIO.usuNombre,
            PRODUCTO.proNombre,
            OFERTA.ofeFechaCaducidad,
            OFERTA.ofeDescripcion,
            OFERTA.ofeCantidad,
            OFERTA.ofePrecio
        FROM OFERTA
        INNER JOIN PRODUCTO ON OFERTA.proId = PRODUCTO.proId
        INNER JOIN USUARIO ON OFERTA.usuId = USUARIO.usuId
        ORDER BY PRODUCTO.proNombre ASC;
BEGIN
    FOR OfertaRec IN CursorOfertas
    LOOP
        -- Aquí puedes realizar las operaciones que necesites con los datos de cada oferta
        DBMS_OUTPUT.PUT_LINE('ID: ' || OfertaRec.ofeId || ', Usuario: ' || OfertaRec.usuNombre || ', Producto: ' || OfertaRec.proNombre || ', Fecha de Caducidad: ' || To_Char(OfertaRec.ofeFechaCaducidad, 'DD MONTH YYYY') || ', Descripción: ' || OfertaRec.ofeDescripcion || ', Cantidad: ' || OfertaRec.ofeCantidad || ', Precio: ' || OfertaRec.ofePrecio);
    END LOOP;
END ord_ofe_nombre_Prod;
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
    IF p_ofeFechaCaducidad < SYSDATE THEN
        RAISE_APPLICATION_ERROR(-20012, 'La fecha de caducidad no puede ser menor a la fecha actual');
    END IF;
    IF p_ofeCantidad <= 0 THEN
        RAISE_APPLICATION_ERROR(-20013, 'La cantidad no puede ser menor o igual a 0');
    END IF;
    IF p_ofePrecio <= 0 THEN
        RAISE_APPLICATION_ERROR(-20014, 'El precio no puede ser menor o igual a 0');
    END IF;

    UPDATE OFERTA
    SET ofeFechaCaducidad = p_ofeFechaCaducidad,
        ofeCantidad = p_ofeCantidad,
        ofePrecio = p_ofePrecio,
        ofeDescripcion = p_ofeDescripcion, 
        ofeActivo = p_ofeActivo
    WHERE ofeId = p_ofeId AND usuId = p_usuId AND proId = p_proId;
    IF SQL%ROWCOUNT < 1 THEN
        RAISE_APPLICATION_ERROR(-20011, 'No se pudo actualizar la oferta');
    END IF;
    COMMIT;
END actualizar_oferta;
PROCEDURE actualizar_oferta (
    p_ofeId IN INT,
    p_usuId IN NUMBER,
    p_proNombre IN VARCHAR2,
    p_ofeFechaCaducidad IN DATE,
    p_ofeDescripcion IN varchar2,
    p_ofeCantidad IN INT,
    p_ofePrecio NUMBER,
    p_ofeActivo CHAR
)
IS
 v_proId PRODUCTO.proId%TYPE;
BEGIN
    SELECT proId INTO v_proId FROM PRODUCTO WHERE proNombre = p_proNombre;
    actualizar_oferta(p_ofeId, p_usuId, v_proId, p_ofeFechaCaducidad, p_ofeDescripcion, p_ofeCantidad, p_ofePrecio, p_ofeActivo);
END actualizar_oferta;
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
    v_proId PRODUCTO.proId%TYPE;
BEGIN
    IF p_ofeFechaCaducidad < SYSDATE THEN
        RAISE_APPLICATION_ERROR(-20012, 'La fecha de caducidad no puede ser menor a la fecha actual');
    END IF;
    IF p_ofeCantidad <= 0 THEN
        RAISE_APPLICATION_ERROR(-20013, 'La cantidad no puede ser menor o igual a 0');
    END IF;
    IF p_ofePrecio <= 0 THEN
        RAISE_APPLICATION_ERROR(-20014, 'El precio no puede ser menor o igual a 0');
    END IF;

    SELECT proId INTO v_proId FROM PRODUCTO WHERE proNombre = p_proNombre;
    INSERT INTO OFERTA(usuId, proId, ofeFechaCaducidad,ofeDescripcion,ofeCantidad,ofePrecio,ofeActivo)
    VALUES (p_usuId, v_proId, p_ofeFechaCaducidad, p_ofeDescripcion,p_ofeCantidad, p_ofePrecio,p_ofeActivo);
    COMMIT;

    
END insertar_oferta;


END paq_oferta;

--Paquete oferta
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
    INSERT INTO FACTURA (usuId, facFecha, facTotal)
    VALUES (p_usuId, p_facFecha, p_facTotal);
    COMMIT;
END insertar_factura;
END paq_factura;

--Paquete compra
CREATE OR REPLACE PACKAGE paq_compra IS
--Funciones
--Procedimientos
PROCEDURE comprar (
    p_facId IN INT,
    p_ofeId IN INT,
    p_comCantidadUnidades IN INT
    );
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
    p_facId IN INT,
    p_ofeId IN INT,
    p_comCantidadUnidades IN INT,
    p_comSubtotal NUMBER
);
END paq_compra;
--Vistas
CREATE OR REPLACE VIEW v_compras AS
SELECT c.comId AS "ID de Compra",
    f.facId AS "ID de Factura",
    u.usuId AS "ID de Usuario",
    u.usuNombre AS "Nombre de Usuario",
    c.ofeId AS "ID de Oferta",
    o.ofeDescripcion AS "Descripción de la Oferta",
    c.comCantidadUnidades AS "Cantidad de Unidades",
    c.comSubtotal AS "Subtotal",
    f.facFecha AS "Fecha de Factura",
    f.facTotal AS "Total de Factura"
FROM COMPRA c
INNER JOIN FACTURA f ON c.facId = f.facId
INNER JOIN USUARIO u ON f.usuId = u.usuId
INNER JOIN OFERTA o ON c.ofeId = o.ofeId;
--Select * from v_compras;
--Cuerpo
CREATE OR REPLACE PACKAGE BODY paq_compra IS 
--Funciones
--Procedimientos
 PROCEDURE comprar (
    p_facId IN INT,
    p_ofeId IN INT,
    p_comCantidadUnidades IN INT
    )
    IS
    BEGIN
      INSERT INTO COMPRA (facId, ofeId, comCantidadUnidades,comSubtotal)
      VALUES (p_facId, p_ofeId, p_comCantidadUnidades,paq_oferta.calcular_subtotal(p_ofeId,p_comCantidadUnidades));
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
    p_facId IN INT,
    p_ofeId IN INT,
    p_comCantidadUnidades IN INT,
    p_comSubtotal NUMBER
)
IS
BEGIN
    INSERT INTO COMPRA (facId, ofeId, comCantidadUnidades,comSubtotal)
    VALUES (p_facId, p_ofeId, p_comCantidadUnidades,p_comSubtotal);
    COMMIT;
END insertar_compra;
END paq_compra;

CREATE OR REPLACE TYPE compra_record AS OBJECT (
    comId NUMBER,
    facId NUMBER,
    usuId NUMBER,
    usuNombre VARCHAR2(100),
    ofeId NUMBER,
    ofeDescripcion VARCHAR2(255),
    comCantidadUnidades NUMBER,
    comSubtotal NUMBER,
    facFecha DATE,
    facTotal NUMBER
);
--Instanciar la tabla compra por factura
CREATE OR REPLACE TYPE compra_table  AS TABLE OF compra_record;
--Funcion
CREATE OR REPLACE FUNCTION ver_compras_por_factura(fac_id_param NUMBER)
RETURN compra_table PIPELINED AS
BEGIN
    FOR r IN (
        SELECT c.comId,
            f.facId,
            u.usuId,
            u.usuNombre,
            c.ofeId,
            o.ofeDescripcion,
            c.comCantidadUnidades,
            c.comSubtotal,
            f.facFecha,
            f.facTotal
        FROM COMPRA c
        INNER JOIN FACTURA f ON c.facId = f.facId
        INNER JOIN USUARIO u ON f.usuId = u.usuId
        INNER JOIN OFERTA o ON c.ofeId = o.ofeId
        WHERE f.facId = fac_id_param
    ) LOOP
        PIPE ROW (compra_record(r.comId, r.facId, r.usuId, r.usuNombre, r.ofeId, r.ofeDescripcion, r.comCantidadUnidades, r.comSubtotal, r.facFecha, r.facTotal));
    END LOOP;
    RETURN;
END;
--SELECT * FROM TABLE(ver_compras_por_factura(1));

--Select * from v_compras_fac;

--drop type compra_type 
--drop type compra_table_type 
-- drop procedure comprar
CREATE OR REPLACE TYPE compra_type AS OBJECT (        
    ofeId INT,    
    comCantidadUnidades INT    
);

CREATE OR REPLACE TYPE compra_table_type AS TABLE OF compra_type;
CREATE OR REPLACE PROCEDURE comprar (
    compras IN compra_table_type,
    p_usuId IN usuario.USUID%TYPE    
) AS
    -- Variables for storing intermediate data
    v_comId NUMBER;
    v_facId NUMBER;
    v_total NUMBER := 0;
    v_precioUnitario NUMBER;
    v_subtotal NUMBER;
    -- for ouput
    rc sys_refcursor;
BEGIN
    -- Start the transaction
    -- Generate a new ID for factura
    v_facId := OFEID_SEQ.NEXTVAL;
    SELECT ofeId_seq.NEXTVAL INTO v_facId FROM dual;

    -- Inserts into the factura so the compras can reference it
    INSERT INTO FACTURA ( FACID, usuId, facFecha, facTotal)
        VALUES ( v_facid, p_usuId, SYSDATE, 0);

    

    FOR i IN 1 .. compras.COUNT LOOP
        -- Gets the unitary price of the offer
        
        SELECT ofePrecio INTO v_precioUnitario FROM OFERTA WHERE ofeId = compras(i).ofeId;
        -- Compute subtotal
        v_subtotal := v_precioUnitario * compras(i).comCantidadUnidades;        
        -- Generate a new ID for the compra (assuming a sequence is used)
        SELECT comId_seq.NEXTVAL INTO v_comId FROM dual;   
        -- Insert compra
        INSERT INTO COMPRA (comId, facId, ofeId, comCantidadUnidades, comSubtotal) /* Depending on the trigger to check quantity*/
        VALUES (v_comId, v_facId, compras(i).ofeId, compras(i).comCantidadUnidades, v_subtotal);
        UPDATE OFERTA SET ofeCantidad = ofeCantidad - compras(i).comCantidadUnidades WHERE ofeId = compras(i).ofeId;
        -- Update the total of the factura
        v_total := v_total + v_subtotal;        
    END LOOP;

    -- Push the total value into the factura
    UPDATE FACTURA SET FACTOTAL = v_total WHERE facId = v_facId;

    -- Return the data
    OPEN rc FOR SELECT c.comId,
            f.facId as facid,
            u.usuId as usuid,
            u.usuNombre || ' ' || u.USUAPELLIDO as comprador,
            c.ofeId as ofeid,            
            c.comCantidadUnidades as unidades,
            c.comSubtotal as subtotal,
            f.facFecha as fechacompra,
            f.facTotal as total
        FROM COMPRA c
        INNER JOIN FACTURA f ON c.facId = f.facId
        INNER JOIN USUARIO u ON f.usuId = u.usuId
        INNER JOIN OFERTA o ON c.ofeId = o.ofeId
        WHERE f.facId = v_facId;
    dbms_sql.return_result(rc);
    -- Commit the transaction
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        -- Rollback the transaction in case of an error
        dbms_output.put_line('Error: ' || SQLERRM);
        ROLLBACK;
        RAISE;
END comprar;

-- EXECUTE comprar(compra_table_type(compra_type(3, 1), compra_type(4, 2)), 10492027);

--Eliminar datos de las tablas
/*BEGIN
delete from compra;
delete from factura;
delete from oferta;
delete from usuario;
delete from producto;
delete from municipio;
END;*/
--BLOQUE ANONIMO PARA INSERCIONES
ALTER TRIGGER TG_ins_oferta DISABLE;
ALTER TRIGGER TG_ins_factura DISABLE;
ALTER TRIGGER TG_ins_compra DISABLE;
BEGIN
delete from compra;
delete from factura;
delete from oferta;
delete from usuario;
delete from producto;
delete from municipio;
    -- Inserciones en la tabla MUNICIPIO
    paq_municipio.insertar_municipio(1, 'Timbio', 'Templado');
    paq_municipio.insertar_municipio(2, 'Buenos Aires', 'Frio');
    paq_municipio.insertar_municipio(3, 'Caloto', 'Templado');
    paq_municipio.insertar_municipio(4, 'Corinto', 'Frio');
    paq_municipio.insertar_municipio(5, 'Guachene', 'Caliente');
    paq_municipio.insertar_municipio(6, 'Miranda', 'Templado');
    paq_municipio.insertar_municipio(7, 'Piendamo', 'Frio');
    paq_municipio.insertar_municipio(8, 'Rosas', 'Frio');
    paq_municipio.insertar_municipio(9, 'Santander de Quilichao', 'Caliente');
    paq_municipio.insertar_municipio(10, 'Popayán', 'Templado');
    paq_municipio.insertar_municipio(11, 'Cajibio', 'Templado');
    paq_municipio.insertar_municipio(12, 'Silvia', 'Templado');
    paq_municipio.insertar_municipio(13, 'Sotara', 'Templado');
    paq_municipio.insertar_municipio(14, 'Suarez', 'Caliente');
    paq_municipio.insertar_municipio(15, 'Timbiqui', 'Caliente');
    paq_municipio.insertar_municipio(16, 'Totoro', 'Templado');
    paq_municipio.insertar_municipio(17, 'Villa Rica', 'Templado');
    paq_municipio.insertar_municipio(18, 'Toribio', 'Frio');
    paq_municipio.insertar_municipio(19, 'Almaguer', 'Frio');
    paq_municipio.insertar_municipio(20, 'Argelia', 'Frio');
    paq_municipio.insertar_municipio(21, 'Balboa', 'Templado');
    paq_municipio.insertar_municipio(22, 'Bolivar', 'Templado');
    paq_municipio.insertar_municipio(23, 'Lopez de Micay', 'Caliente');
    paq_municipio.insertar_municipio(26, 'El Tambo', 'Templado');
    paq_municipio.insertar_municipio(27, 'Florencia', 'Frio');
    paq_municipio.insertar_municipio(28, 'Guapi', 'Caliente');
    paq_municipio.insertar_municipio(29, 'Inza', 'Templado');
    paq_municipio.insertar_municipio(30, 'Jambalo', 'Frio');
    paq_municipio.insertar_municipio(31, 'La Sierra', 'Frio');
    paq_municipio.insertar_municipio(32, 'La Vega', 'Templado');
    paq_municipio.insertar_municipio(34, 'Mercaderes', 'Templado');
    paq_municipio.insertar_municipio(36, 'Padilla', 'Frio');
    paq_municipio.insertar_municipio(37, 'Patia', 'Caliente');
    paq_municipio.insertar_municipio(38, 'Piamonte', 'Templado');
    paq_municipio.insertar_municipio(40, 'Purace', 'Frio');
    paq_municipio.insertar_municipio(41, 'Caldono', 'Caliente');
    paq_municipio.insertar_municipio(42, 'San Sebastian', 'Templado');

    -- Inserciones en la tabla PRODUCTO
    paq_producto.insertar_producto(1, 'Semillas de Maíz', 'Insumo');
    paq_producto.insertar_producto(2, 'Gallina', 'Animal');
    paq_producto.insertar_producto(3, 'Manzanas', 'Fruta');
    paq_producto.insertar_producto(4, 'Tomates', 'Vegetal');
    paq_producto.insertar_producto(5, 'Fertilizante Orgánico', 'Insumo');
    paq_producto.insertar_producto(6, 'Fertilizante inorganico', 'Insumo');
    paq_producto.insertar_producto(7, 'Mula', 'Animal');
    paq_producto.insertar_producto(8, 'Fresas', 'Fruta');
    paq_producto.insertar_producto(9, 'Espinaca', 'Vegetal');
    paq_producto.insertar_producto(10, 'Semillas de cacao', 'Insumo');

    -- Inserciones en la tabla USUARIO
    paq_usuario.insertar_usuario(10492021, 1, 'Freddy', 'Anaya', 'Calle 15 #7-33',1223, 'papitas20', 'Campesino');
    paq_usuario.insertar_usuario(10492022, 4, 'Jhoan', 'Chacon', 'Calle 19 #3-16',3232, 'arroz20', 'Comprador');
    paq_usuario.insertar_usuario(10492023, 2, 'Jonathan', 'Guejia', 'Carrera 2 #1-32',2323, 'ola123', 'Campesino');
    paq_usuario.insertar_usuario(10492025, 1, 'Julian', 'Alvarez', 'Transversal 5 #1-32',5445, 'contra123', 'Comprador');
    paq_usuario.insertar_usuario(10492026, 5, 'Jorge', 'Vilota', 'Calle 11 #2-63',1233, 'campo20', 'Comprador');
    paq_usuario.insertar_usuario(10492027, 3, 'Juan', 'Hernandez', 'Calle 15 #1-3',2322, 'azucar220', 'Comprador');

    -- Inserciones en la tabla OFERTA
    INSERT INTO oferta(ofeId,usuId, proId, ofeFechaCaducidad,ofeDescripcion,ofeCantidad,ofePrecio,ofeActivo) values(1,10492021, 1, SYSDATE + 10,'Semillas secas' ,2220,1000,'Y');
    INSERT INTO oferta(ofeId,usuId, proId, ofeFechaCaducidad,ofeDescripcion,ofeCantidad,ofePrecio,ofeActivo) values(2,10492023, 2, SYSDATE + 5,'Gallina rabona' ,1225,7000,'Y');
    INSERT INTO oferta(ofeId,usuId, proId, ofeFechaCaducidad,ofeDescripcion,ofeCantidad,ofePrecio,ofeActivo) values(3,10492021, 3, SYSDATE + 8, 'Manzanas verdes muy verdes' ,2210,3000,'Y');
    INSERT INTO oferta(ofeId,usuId, proId, ofeFechaCaducidad,ofeDescripcion,ofeCantidad,ofePrecio,ofeActivo) values(4,10492021, 4, SYSDATE + 12, 'Tomates muy rojos' ,225,2500,'Y');
    INSERT INTO oferta(ofeId,usuId, proId, ofeFechaCaducidad,ofeDescripcion,ofeCantidad,ofePrecio,ofeActivo) values(5,10492023, 5, SYSDATE + 7,'Fertilizante de marca DiomedesOrg' ,2225,20000,'Y');

    -- Inserciones en la tabla FACTURA
    /*
    INSERT INTO FACTURA (facId,usuId, facFecha, facTotal)VALUES (1,10492021, SYSDATE, 20000.50);
    INSERT INTO FACTURA (facId,usuId, facFecha, facTotal)VALUES (2,10492022, SYSDATE - 1, 11500.25);
    INSERT INTO FACTURA (facId,usuId, facFecha, facTotal)VALUES (3,10492023, SYSDATE - 2, 12000.75);
    INSERT INTO FACTURA (facId,usuId, facFecha, facTotal)VALUES (4,10492025, SYSDATE - 3, 59800.00);
    INSERT INTO FACTURA (facId,usuId, facFecha, facTotal)VALUES (5,10492027, SYSDATE - 4, 21500.75);

    -- Inserciones en la tabla COMPRA
    INSERT INTO COMPRA (comId,facId, ofeId, comCantidadUnidades,comSubtotal)VALUES (1,1, 1, 2,1000);
    INSERT INTO COMPRA (comId,facId, ofeId, comCantidadUnidades,comSubtotal)VALUES (2,2, 2, 1,2300);
    INSERT INTO COMPRA (comId,facId, ofeId, comCantidadUnidades,comSubtotal)VALUES (3,3, 3, 3,2150);
    INSERT INTO COMPRA (comId,facId, ofeId, comCantidadUnidades,comSubtotal)VALUES (4,4, 4, 1,4500);
    INSERT INTO COMPRA (comId,facId, ofeId, comCantidadUnidades,comSubtotal)VALUES (5,5, 5, 5,5000);
*/
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
    paq_oferta.actualizar_oferta(3, 10492021, 3, TO_DATE('20/04/25','DD/MM/YY'),'Manzana menos manzanosa' ,15, 4000, 'Y');
    paq_oferta.actualizar_oferta(5, 10492023, 5, TO_DATE('01/04/25','DD/MM/YY'), ':(',30, 22000, 'Y');

    --UPDATE PARA FACTURA
    /*
    paq_factura.actualizar_fecha_factura(1, 10492021, SYSDATE - 5);
    paq_factura.actualizar_fecha_factura(3, 10492023, SYSDATE - 4);
    paq_factura.actualizar_fecha_factura(5, 10492026, SYSDATE + 7);
    */
    --UPDATE COMPRA
    /*paq_compra.actualizar_compra(1, 1, 1, 5, 10000);
    paq_compra.actualizar_compra(3, 3, 3, 4, 4500);
    paq_compra.actualizar_compra(5, 5, 5, 10, 5400);
    */
    COMMIT;
END;
ALTER TRIGGER TG_ins_oferta ENABLE;
ALTER TRIGGER TG_ins_factura ENABLE;
ALTER TRIGGER TG_ins_compra ENABLE;
--TRIGGERS
CREATE OR REPLACE TRIGGER TR_validar_longitud_cedula
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
END TR_validar_longitud_cedula;
select * from usuario
--ALTER TRIGGER TR_validar_longitud_cedula DISABLE;


set serveroutput on
CREATE OR REPLACE TRIGGER TR_cantidad_valida
BEFORE INSERT OR UPDATE OF comCantidadUnidades ON Compra
FOR EACH ROW
BEGIN
    dbms_output.put_line('1: ' || :NEW.comCantidadUnidades  || '  2: ' ||  paq_oferta.cantidad_disponible(:NEW.ofeId)    );
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
--ALTER TRIGGER TR_cantidad_valida DISABLE;