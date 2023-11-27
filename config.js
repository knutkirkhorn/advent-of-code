import dotenv from 'dotenv';

// Load the stored variables from `.env` file into process.env
dotenv.config();

export default {
	cookieSession: process.env.COOKIE_SESSION || '',
};
