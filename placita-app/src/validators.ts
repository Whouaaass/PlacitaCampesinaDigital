/* validators.ts */
/* Validators for the registration and login form */


export function validateUsername(username: string): boolean {
    return username.length > 3;
}
export function validateEmail(email: string): boolean {
    return email.includes('@');
}
export function validatePassword(password: string): boolean {
    return password.length > 6;
}
export function validateId(id: string): boolean {
    return id.length === 10;
}
export function validateAgrocode(agrocode: string): boolean {
    return agrocode === "1234";
}
export function validateTelnumber(telnumber: string): boolean {
    return telnumber.length === 10;
}