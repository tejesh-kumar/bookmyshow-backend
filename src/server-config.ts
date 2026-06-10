import dotenv from 'dotenv';

export const InitializeConfig = () => dotenv.config();

InitializeConfig();

export const port = process.env.PORT || 4000;

// module.exports = { port };
