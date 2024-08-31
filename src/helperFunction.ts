import {
  getData, Data
} from './dataStore';
import { randomBytes } from 'crypto';
import { BadRequestError, ForbiddenError, TokenError } from './errors';
import crypto from 'crypto';

const VALID_QUIZ_NAME = /^[a-zA-Z0-9 ]+$/;

/**
 * This function generates a random user ID
 * @returns a random user ID
 */
export function generateRandomUserId(data: Data): number {
  // Generate a random number between 1000000000 and 9999999999
  let userId = Math.floor(Math.random() * 9000000000) + 1000000000;
  // Check if the userId already exists
  // find user with the same userId in userId array
  while (data.users.find(user => user.userId === userId)) {
    userId = Math.floor(Math.random() * 9000000000) + 1000000000;
  }
  return userId;
}

/**
 * This function generates a random userSessionId
 * @param data
 * @returns a random userSessionId
 */
export function generateRandomToken(data: Data): string {
  // Generate a random string of length 10
  let token = randomBytes(10 / 2).toString('hex').slice(0, 10);
  // Check if the userSessionId already exists
  while (data.users.some(user => user.session.includes(token))) {
    token = randomBytes(10 / 2).toString('hex').slice(0, 10);
  }
  return token;
}

/**
 * get the current time in seconds
 * @returns the current time in seconds
 */
export function getCurrentTime(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * This function validates the name of a quiz or question
 * @param name
 * @param type
 * @returns error message if the name is invalid, false otherwise
 */
export function validateName(name: string, type: string): boolean {
  const validNamePattern = /^[A-Za-z\s'-]+$/; // Assuming names should only contain alphabetic characters
  if (name.length < 2 || name.length > 20) {
    throw new BadRequestError(`Invalid ${type} name`);
  }
  if (!validNamePattern.test(name)) {
    throw new BadRequestError(`Invalid ${type} name`);
  }
  return false;
}

/**
 * This function validates the description of a quiz
 * @param password
 * @returns error message if the description is invalid, false otherwise
 */
export function isValidPassword(password: string): boolean {
  if (password.length < 8 || !/\d/.test(password) || !/[A-Za-z]/.test(password)) {
    throw new BadRequestError('Invalid password');
  }
  return true;
}

/**
 * This function returns the hashed password of the given password
 * @param password
 * @returns the hashed password
 */
export function getHashedPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}
