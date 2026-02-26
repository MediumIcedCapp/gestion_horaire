//requires text before and after the @ symbol, and a valid domain
export function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

//Requires at least 8 characters, one uppercase letter, one lowercase letter, and one number
export function validatePassword(password) {
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/. test(password);
}

export function passwordMatch(password, confirmPassword) {
    return password === confirmPassword;
}

export function validateName(name) {
    return /^[a-zA-Z]+$/.test(name);
}

export function validateUsername(username) {
    return /^[a-zA-Z0-9]+$/.test(username);
}

export default { validateEmail, validatePassword, passwordMatch, validateName, validateUsername };