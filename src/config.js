const config = {
    API_BASE_URL: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'
};

export default config;
