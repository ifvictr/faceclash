<?php
/*
 * Faceclash configuration file
 *
 * It must be present and configured correctly at all times during gameplay, or the game won't function properly.
 *
 * Configuration fields:
 * - DATABASE_USER: What's your database username?
 * - DATABASE_PASSWORD: What's your user password? You can leave this blank if there isn't one set.
 * - DATABASE_NAME: What's your database's name?
 * - DATABASE_HOST: Where your database is located?
 * - DATABASE_PORT: On what port is your database? Default port is set to '3306'.
 *
 * - ADMIN_USER: What do you want your dashboard admin username to be? Default username is 'admin'.
 * - ADMIN_PASSWORD: How about the password? Default password is 'password'.
 *
 * - APP_DEBUG: Would you like to see debug/error messages? If set to 'true', debug mode will be enabled. Default value is 'false'.
 */
class Config{
    // Database config
    const DATABASE_USER = "";
    const DATABASE_PASSWORD = "";
    const DATABASE_NAME = "";
    const DATABASE_HOST = "";
    const DATABASE_PORT = 3306;
    // Admin config
    const ADMIN_USER = "admin";
    const ADMIN_PASSWORD = "password";
    // App config
    const APP_DEBUG = false;
}