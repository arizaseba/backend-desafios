import knex from "knex";

const config = {
    client: "mysql",
    connection: {
        host: "127.0.0.1",
        user: "root",
        password: "",
        database: "mibase",
    },
    pool: { min: 0, max: 7 }
};

const database = knex(config);

const createTable = async () => {
    try {
        await database.schema.dropTableIfExists("product");
        await database.schema.createTable("product", (productsTable) => {
            productsTable.increments("id").primary();
            productsTable.string("timestamp", 50).notNullable();
            productsTable.string("nombre", 50).notNullable();
            productsTable.string("desc", 500).notNullable();
            productsTable.string("codigo", 6).notNullable();
            productsTable.float("precio").notNullable();
            productsTable.string("foto", 500).notNullable();
            productsTable.integer("stock").notNullable();
        });

        console.log("Tabla [Products] creada!");
        database.destroy();
    } catch (err) {
        console.log("Error:", err);
        database.destroy();
    }
};

createTable();