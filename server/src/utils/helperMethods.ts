import bcrypt from "bcryptjs";
import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";

configDotenv();

export async function hashPassword(password: string): Promise<string> {
  // Generate a salt for bcrypt
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  // Hash the password with the generated salt
  const hashedPassword = await bcrypt.hash(password, salt);

  // Return the hashed password
  return hashedPassword;
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  // Compare the provided password with the hashed password
  const match = await bcrypt.compare(password, hashedPassword);

  // Return whether the passwords match
  return match;
}

export const createToken = (user: any) => {
  const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
  return token;
};
