import AsyncStorage from '@react-native-async-storage/async-storage';

const LIMIT_KEY = 'fk_daily_scans';
export const DAILY_SCAN_LIMIT = 5;

// Returns today as YYYY-MM-DD in local time
function getTodayDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Internal — get raw limit data, resetting if it's a new day
async function getLimitData() {
  try {
    const raw = await AsyncStorage.getItem(LIMIT_KEY);
    if (!raw) return { date: getTodayDate(), count: 0 };
    const data = JSON.parse(raw);
    if (data.date !== getTodayDate()) {
      // New day — reset count
      return { date: getTodayDate(), count: 0 };
    }
    return data;
  } catch {
    return { date: getTodayDate(), count: 0 };
  }
}

// How many scans have been used today
export async function getScansUsedToday() {
  const data = await getLimitData();
  return data.count;
}

// How many scans are left today
export async function getScansRemaining() {
  const data = await getLimitData();
  return Math.max(0, DAILY_SCAN_LIMIT - data.count);
}

// Whether the user is allowed to scan
export async function canScan() {
  const data = await getLimitData();
  return data.count < DAILY_SCAN_LIMIT;
}

// Call this after a successful scan (plant identified OR joke triggered)
// Returns updated remaining count
export async function incrementScanCount() {
  const data = await getLimitData();
  const updated = { date: data.date, count: data.count + 1 };
  await AsyncStorage.setItem(LIMIT_KEY, JSON.stringify(updated));
  return Math.max(0, DAILY_SCAN_LIMIT - updated.count);
}

// DEV ONLY — reset the counter (remove from production)
export async function resetScanLimit() {
  await AsyncStorage.removeItem(LIMIT_KEY);
}
