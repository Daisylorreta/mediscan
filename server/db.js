import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "data");
const file = path.join(dir, "db.json");

const empty = { users: [], medications: [], consultations: [] };

function read() {
  try {
    return { ...empty, ...JSON.parse(fs.readFileSync(file, "utf8")) };
  } catch {
    return structuredClone(empty);
  }
}

function write(data) {
  fs.mkdirSync(dir, { recursive: true });
  const tmp = file + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, file);
}

// Tiny JSON-file store so the app runs with zero setup.
// Swap these helpers for Postgres/Mongo/Supabase later; routes only use this interface.
export const db = {
  all(table) {
    return read()[table];
  },
  find(table, predicate) {
    return read()[table].find(predicate);
  },
  filter(table, predicate) {
    return read()[table].filter(predicate);
  },
  insert(table, row) {
    const data = read();
    const record = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...row };
    data[table].push(record);
    write(data);
    return record;
  },
  remove(table, predicate) {
    const data = read();
    const before = data[table].length;
    data[table] = data[table].filter((r) => !predicate(r));
    write(data);
    return before !== data[table].length;
  },
};
