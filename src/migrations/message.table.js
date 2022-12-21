import knex from "knex";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = {
    client: "sqlite3",
    connection: {
        filename: path.resolve(__dirname, "../database/ecommerce.sqlite"),
    },
    useNullAsDefault: true,
};

const database = knex(config);

const createMessageTable = async () => {
    try {
        await database.schema.dropTableIfExists("message")
        await database.schema.createTable("message", (messageTable) => {
            messageTable.increments("id").primary();
            messageTable.string("email", 100).notNullable();
            messageTable.string("msg", 500).notNullable();
            messageTable.string("date", 50).notNullable();
        });

        console.log("Tabla [Message] creada!");
        database.destroy();
    } catch (err) {
        console.log(err);
    }
};

createMessageTable();