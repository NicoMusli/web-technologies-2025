module.exports = {
    apps: [{
        name: "server",
        script: "./api/server.js",
        watch: true,
        ignore_watch: ["node_modules", "server/prisma/dev.db", "server/prisma/dev.db-journal", "src", "public", "build"],
        env: {
            NODE_ENV: "development",
            PORT: 3001 // Ensure backend runs on 3001 if frontend is on 3000
        },
        env_file: "./api/.env"
    }, {
        name: "frontend",
        script: "npm",
        args: "start",
        watch: false, // React scripts handles watching internally
        env: {
            NODE_ENV: "development",
        }
    }]
}
