import knex from "knex";

export const db = knex({
    client: 'sqlite3', 
    connection: {
      filename: "./submissions"
    },
    useNullAsDefault: true
  })

  export const testDb = knex({
    client: 'sqlite3', 
    connection: {
      filename: "./test.db"
    },
    useNullAsDefault: true
  })