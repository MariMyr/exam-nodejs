import bcrypt from 'bcrypt';

export async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

export async function comparePasswords(password, hashedPassword) {
    const isSame = await bcrypt.compare(password, hashedPassword);
    return isSame;
}

