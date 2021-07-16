import dotenv from 'dotenv';

dotenv.config();

const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 50,
    autoIndex: false,
    retryWrites: false
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || 'sample';
const MONGO_PASSWORD = process.env.MONGO_USERNAME || 'sample';
const MONGO_HOST = process.env.MONGO_HOST || `no db host set`;

const MONGO = {
    host: MONGO_HOST,
    password: MONGO_PASSWORD,
    username: MONGO_USERNAME,
    options: MONGO_OPTIONS,
    url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`
};

const SERVER_PORT = process.env.SERVER_PORT || 5000;
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const ACCESS_TOKEN_EXPIRETIME = +process.env.ACCESS_TOKEN_EXPIRETIME || 900000; // 15 minutes in milliseconds
const REFRESH_TOKEN_EXPIRETIME = +process.env.REFRESH_TOKEN_EXPIRETIME || 86400000; // 1 day in milliseconds
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || 'devAlly';
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'notsosecret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'notsosecret';

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        accessExpireTime: ACCESS_TOKEN_EXPIRETIME,
        refreshExpireTime: REFRESH_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        accessSecret: ACCESS_TOKEN_SECRET,
        refreshSecret: REFRESH_TOKEN_SECRET
    }
};

const config = {
    server: SERVER,
    mongo: MONGO
};

export default config;
