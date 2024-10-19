import bcrypt from 'bcrypt';
import { salt } from './variables';

export default class BCrypt {
  private saltRounds: number;

  constructor(saltRounds: number = 10) {
    this.saltRounds = salt || saltRounds;
  }

  async hashPasscode(passcode: string) {
    try {
      const hashedPasscode = await bcrypt.hash(passcode, this.saltRounds);
      return hashedPasscode;
    } catch (error) {
      console.log('Error while hashing passcode:', error);
      throw new Error('Error while hashing passcode');
    }
  }

  async comparePasscode(passcode: string, hashedPasscode: string) {
    try {
      const match = await bcrypt.compare(passcode, hashedPasscode);
      return match;
    } catch (error) {
      console.log('Error while verifying passcode:', error);
      throw new Error('Error while verifying passcode');
    }
  }
}
