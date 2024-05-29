CREATE OR REPLACE TRIGGER TR_verificar_ofertas_iguales
FOR INSERT ON Oferta
COMPOUND TRIGGER
    TYPE OfertaTipo IS RECORD (
        idCampesino Usuario.usuId%TYPE,
        idProducto Producto.proId%TYPE,
        fCaducidad Oferta.ofeFechaCaducidad%TYPE,
        descripcion Oferta.ofeDescripcion%TYPE,
        cantidad Oferta.ofeCantidad%TYPE,
        precio Oferta.ofePrecio%TYPE,
        estado Oferta.ofeActivo%TYPE
    );

    -- Variable para almacenar la oferta nueva
    v_nueva_oferta OfertaTipo;
    v_count NUMBER;

    BEFORE EACH ROW IS
    BEGIN
        -- Almacenar los valores de la nueva oferta en el registro
        v_nueva_oferta.idCampesino := :NEW.usuId;
        v_nueva_oferta.idProducto := :NEW.proId;
        v_nueva_oferta.fCaducidad := :NEW.ofeFechaCaducidad;
        v_nueva_oferta.descripcion := :NEW.ofeDescripcion;
        v_nueva_oferta.cantidad := :NEW.ofeCantidad;
        v_nueva_oferta.precio := :NEW.ofePrecio;
        v_nueva_oferta.estado := :NEW.ofeActivo;
    END BEFORE EACH ROW;

    AFTER STATEMENT IS
    BEGIN
        -- Verificar si hay duplicados en la tabla Oferta
        SELECT COUNT(*)
        INTO v_count
        FROM Oferta 
        WHERE usuId = v_nueva_oferta.idCampesino
          AND proId = v_nueva_oferta.idProducto
          AND ofeFechaCaducidad = v_nueva_oferta.fCaducidad
          AND ofeDescripcion = v_nueva_oferta.descripcion
          AND ofeCantidad = v_nueva_oferta.cantidad
          AND ofePrecio = v_nueva_oferta.precio
          AND ofeActivo = v_nueva_oferta.estado;

        DBMS_OUTPUT.PUT_LINE('Cantidad de ofertas iguales: ' || v_nueva_oferta.Descripcion);
        IF v_count > 1 THEN
            RAISE_APPLICATION_ERROR(-20200, 'Oferta ya registrada');
        END IF;
    END AFTER STATEMENT;
END TR_verificar_ofertas_iguales;

/* Script para probar el método*/
BEGIN    
    INSERT INTO 
        oferta(usuId, proId, ofeFechaCaducidad,ofeDescripcion,ofeCantidad,ofePrecio,ofeActivo) 
        values(10492021, 1, TO_DATE('24/06/2025', 'DD/MM/YYYY'),'Semillas secaFADJSKFAJSLDJFSJLD', 20, 10, 'Y');
END;

-- Segundo TRIGGER compuesto

CREATE OR REPLACE TRIGGER TR_MULTIPLE_DELETE_OFERTA
FOR DELETE ON OFERTA
COMPOUND TRIGGER
    V_COUNT_ANTES INT;
    V_COUNT_DESPUES INT;
    V_DIFERENCIA INT;
    BEFORE STATEMENT IS
    BEGIN
        SELECT COUNT(OFEID) INTO V_COUNT_ANTES FROM OFERTA;
    END BEFORE STATEMENT;

    AFTER STATEMENT IS
    BEGIN
        SELECT COUNT(OFEID) INTO V_COUNT_DESPUES FROM OFERTA;
        V_DIFERENCIA := V_COUNT_ANTES - V_COUNT_DESPUES;
        IF V_DIFERENCIA > 1 THEN
            RAISE_APPLICATION_ERROR(-20200, 'No se puede eliminar más de una oferta a la vez');
        END IF;
    END AFTER STATEMENT;
END TR_MULTIPLE_DELETE_OFERTA;

delete from oferta;
