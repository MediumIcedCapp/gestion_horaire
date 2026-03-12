//requires text before and after the @ symbol, and a valid domain
export function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

//requires at least 10 characters, at least one letter and one number
export function validatePassword(password) {
    return /^(?=.*[A-Za-z])(?=.*\d).{10,64}$/.test(password);
}

//requires password and confirmPassword to match
export function passwordMatch(password, confirmPassword) {
    return password === confirmPassword;
}

//requires only letters, spaces, apostrophes and hyphens
export function validateName(name) {
    return /^[\p{L} '-]+$/u.test(name);
}

//requires 3-20 characters, only letters, numbers and underscores
export function validateUsername(username) {
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

export default { validateEmail, validatePassword, passwordMatch, validateName, validateUsername };