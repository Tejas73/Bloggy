import bcrypt from 'bcrypt';

export async function hashPassword (password: string): Promise<string | null>{
    try {
        const salt = await bcrypt.genSalt(10)
        const encryptedPassword = await bcrypt.hash(password, salt)
        console.log(typeof encryptedPassword)
        return encryptedPassword
    } catch (error) {
        console.error('Error hashing password:', error);
        return null;
    }
}