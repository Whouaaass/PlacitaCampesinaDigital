/* validators.ts */
/* String validators for the registration and login form */

export const RegexValidators = {
    name: "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$",
    username: "^[a-zA-Z0-9]{4,}$",
    password: "^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$",
    email: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
    telnumber: "^[0-9]{10}$",   
    cedula: "^[0-9]{8,10}$", 
};
export function validateAgrocode(agrocode: string): boolean {
    return agrocode === "1234";
}