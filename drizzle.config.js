module.exports = {
    schema: "./db/schema.js",
    out: "./drizzle",
    driver: "better-sqlite",
    dbCredentials: {
        url: "sqlite.db",
    },
};