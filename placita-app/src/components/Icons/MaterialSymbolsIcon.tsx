/**
 * Representa el ícono de Material Symbols de Google.
 */
import { FC } from 'react';

interface MaterialSymbolsIconProps extends React.HTMLAttributes<HTMLSpanElement> {
    name: string;
    fill?: string;
    weight?: string;
    grad?: string;
    opsz?: string;
    color?: string | undefined;
    size?: string | undefined;
}

/**
 * @brief Componente MaterialSymbolsIcon que renderiza un ícono de Material Symbols.
 * @param name El nombre del ícono.
 * @param fill El relleno del ícono 0..1.
 * @param weight El peso del ícono 100..700.
 * @param grad El gradiente del ícono -50..200.
 * @param opsz El tamaño óptico del ícono 20..48.
 * @param color El color del ícono.
 * @param size El tamaño del ícono.
 */
const MaterialSymbolsIcon: FC<MaterialSymbolsIconProps> = ({ name, fill = 0, weight = 400, grad = 0, opsz = 48, color = "white", size, ...props }) => {
    const style = {
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grad}, 'opsz' ${opsz}`,
        color: color,
        fontSize: size,
    };
    return (
        <span className="material-symbols-rounded" style={style} {...props}>
            {name}
        </span>
    );
};

export default MaterialSymbolsIcon;