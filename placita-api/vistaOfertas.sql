CREATE OR REPLACE VIEW vista_ofertas_disponibles AS
    SELECT
        ofeid AS id,
        pronombre AS nombre,
        protipo AS tipo,
        ofedescripcion AS descripcion,
        ofeprecio AS precio,
        ofecantidad AS cantidad,
        ofefechacaducidad AS fechaCaducidad,
        usunombre || ' ' || usuapellido AS ofertador
    FROM
        oferta
        INNER JOIN producto
        ON oferta.proid = producto.proid
        INNER JOIN usuario
        ON oferta.usuid = usuario.usuid
    WHERE
        oferta.ofeactivo = 'Y';