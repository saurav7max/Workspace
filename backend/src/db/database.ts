import Database from "better-sqlite3";

const db: Database.Database = new Database("dev-workspace.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    createdAt TEXT NOT NULL
  )
`).run();

export default db;
