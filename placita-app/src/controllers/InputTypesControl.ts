export const controlIntInput = (value : string, maxLenght : number) => {    
    if (value.length > maxLenght) value = value.substring(0, maxLenght);
    let valuen = parseInt(value);
    if (isNaN(valuen)) valuen = 0;
    return valuen;
}

export const controlFloatInput = (value : string, maxLenght : number) => {    
    if (value.length > maxLenght) value = value.substring(0, maxLenght);
    value = value.replace(',', '.');
    if (value.endsWith('.')) return value;
    let valuen = parseFloat(value);
    if (isNaN(valuen)) valuen = 0;
    return valuen;
}