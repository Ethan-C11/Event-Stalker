import {defineConfig} from "drizzle-kit";
const {dbFileName} = require("./config");

export default defineConfig({
    schema: "./db/schema.js",
    out: "./drizzle",
    dialect: "sqlite",
    dbCredentials: {
        url: `db/${dbFileName}`,
    },
});

