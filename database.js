import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

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

async function persistPhoto(tempUri) {
  const filename = `fk_${Date.now()}.jpg`;
  const permanentUri = FileSystem.documentDirectory + 'photos/' + filename;
  await FileSystem.makeDirectoryAsync(
    FileSystem.documentDirectory + 'photos',
    { intermediates: true }
  );
  await FileSystem.copyAsync({ from: tempUri, to: permanentUri });
  return permanentUri;
}

export async function saveScan(result, safety, photoUri) {
  const database = await getDatabase();

  let permanentUri = photoUri;
  try {
    permanentUri = await persistPhoto(photoUri);
  } catch (e) {
    console.log('Photo persist failed, using temp URI:', e);
  }

  const existing = await database.getFirstAsync(
    'SELECT id FROM scans WHERE scientificName = ?',
    [result.scientificName]
  );

  if (existing) {
    await database.runAsync(
      `UPDATE scans SET confidence = ?, photoUri = ?, safetyCategory = ?,
       scannedAt = datetime('now') WHERE scientificName = ?`,
      [result.confidence, permanentUri, safety.category, result.scientificName]
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
      permanentUri,
    ]
  );

  return insertResult.lastInsertRowId;
}

export async function deleteScan(id, photoUri) {
  const database = await getDatabase();

  // Delete the photo file from permanent storage
  if (photoUri) {
    try {
      const fileInfo = await FileSystem.getInfoAsync(photoUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(photoUri, { idempotent: true });
      }
    } catch (e) {
      console.log('Photo file delete failed:', e);
    }
  }

  await database.runAsync('DELETE FROM scans WHERE id = ?', [id]);
}

export async function deleteMultipleScans(scans) {
  for (const scan of scans) {
    await deleteScan(scan.id, scan.photoUri);
  }
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