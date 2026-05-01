import * as SQLite from 'expo-sqlite';

let db = null;

export async function getDatabase() {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('floraknight.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS scans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      commonName TEXT NOT NULL,
      scientificName TEXT NOT NULL,
      family TEXT,
      genus TEXT,
      confidence INTEGER,
      safetyCategory TEXT,
      photoUri TEXT,
      scannedAt TEXT DEFAULT (datetime('now'))
    );
  `);

  return db;
}

export async function saveScan(result, safety, photoUri) {
  const database = await getDatabase();

  // Check if we already have this species — avoid duplicates
  const existing = await database.getFirstAsync(
    'SELECT id FROM scans WHERE scientificName = ?',
    [result.scientificName]
  );

  if (existing) {
    // Update with newer photo and confidence
    await database.runAsync(
      `UPDATE scans SET confidence = ?, photoUri = ?, safetyCategory = ?,
       scannedAt = datetime('now') WHERE scientificName = ?`,
      [result.confidence, photoUri, safety.category, result.scientificName]
    );
    return existing.id;
  }

  const insertResult = await database.runAsync(
    `INSERT INTO scans (commonName, scientificName, family, genus, confidence, safetyCategory, photoUri)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      result.commonName,
      result.scientificName,
      result.family,
      result.genus,
      result.confidence,
      safety.category,
      photoUri,
    ]
  );

  return insertResult.lastInsertRowId;
}

export async function getAllScans() {
  const database = await getDatabase();
  return await database.getAllAsync(
    'SELECT * FROM scans ORDER BY scannedAt DESC'
  );
}

export async function getScanCount() {
  const database = await getDatabase();
  const result = await database.getFirstAsync('SELECT COUNT(*) as count FROM scans');
  return result.count;
}

export async function getStats() {
  const database = await getDatabase();
  const total = await database.getFirstAsync('SELECT COUNT(*) as count FROM scans');
  const edible = await database.getFirstAsync(
    "SELECT COUNT(*) as count FROM scans WHERE safetyCategory = 'edible'"
  );
  const toxic = await database.getFirstAsync(
    "SELECT COUNT(*) as count FROM scans WHERE safetyCategory = 'toxic'"
  );
  const medicinal = await database.getFirstAsync(
    "SELECT COUNT(*) as count FROM scans WHERE safetyCategory = 'medicinal'"
  );

  return {
    total: total.count,
    edible: edible.count,
    toxic: toxic.count,
    medicinal: medicinal.count,
  };
}