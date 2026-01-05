import Database from "better-sqlite3";
import path from "path";

// Use environment variable for database path, with fallback for development
const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), "dev-workspace.db");

const db: Database.Database = new Database(dbPath);

// Enable WAL mode for better performance in production
db.pragma('journal_mode = WAL');

db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    createdAt TEXT NOT NULL
  )
`).run();

export default db;
