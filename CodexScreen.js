import { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Image,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { getAllScans, getStats } from './database';
import { getCategoryStyle } from './plantSafety';

export default function CodexScreen({ onBack, onViewEntry }) {
  const [scans, setScans] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [scanData, statsData] = await Promise.all([
        getAllScans(),
        getStats(),
      ]);
      setScans(scanData);
      setStats(statsData);
    } catch (e) {
      console.log('Codex load error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4fe5d4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>← SCAN</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FIELD CODEX</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Stats row */}
        {stats && (
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{stats.total}</Text>
              <Text style={styles.statLabel}>DISCOVERED</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: '#6cd9a3' }]}>{stats.edible}</Text>
              <Text style={styles.statLabel}>EDIBLE</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: '#4fe5d4' }]}>{stats.medicinal}</Text>
              <Text style={styles.statLabel}>MEDICINAL</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: '#ff7b8a' }]}>{stats.toxic}</Text>
              <Text style={styles.statLabel}>TOXIC</Text>
            </View>
          </View>
        )}

        {/* Empty state */}
        {scans.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>◎</Text>
            <Text style={styles.emptyTitle}>No entries yet</Text>
            <Text style={styles.emptyText}>
              Scan your first plant to begin your field codex. Every discovery is recorded here.
            </Text>
            <TouchableOpacity style={styles.scanBtn} onPress={onBack}>
              <Text style={styles.scanBtnText}>START SCANNING</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Scan grid */}
        {scans.length > 0 && (
          <View style={styles.grid}>
            {scans.map((scan) => {
              const catStyle = getCategoryStyle(scan.safetyCategory || 'unknown');
              return (
                <TouchableOpacity
                  key={scan.id}
                  style={styles.gridCell}
                  onPress={() => onViewEntry(scan)}
                  activeOpacity={0.7}
                >
                  {scan.photoUri ? (
                    <Image source={{ uri: scan.photoUri }} style={styles.cellImage} />
                  ) : (
                    <View style={[styles.cellImage, { backgroundColor: '#0f2a30' }]} />
                  )}

                  {/* Safety indicator dot */}
                  <View style={[styles.safetyDot, { backgroundColor: catStyle.color }]} />

                  {/* Category badge */}
                  <View style={[styles.cellBadge, { backgroundColor: catStyle.color + '30', borderColor: catStyle.color }]}>
                    <Text style={[styles.cellBadgeText, { color: catStyle.color }]}>
                      {catStyle.label}
                    </Text>
                  </View>

                  <View style={styles.cellInfo}>
                    <Text style={styles.cellName} numberOfLines={1}>
                      {scan.commonName}
                    </Text>
                    <Text style={styles.cellLatin} numberOfLines={1}>
                      {scan.scientificName}
                    </Text>
                  </View>

                  {/* HUD corners */}
                  <View style={styles.cellHud}>
                    <View style={[styles.miniCorner, styles.mcTl]} />
                    <View style={[styles.miniCorner, styles.mcTr]} />
                    <View style={[styles.miniCorner, styles.mcBl]} />
                    <View style={[styles.miniCorner, styles.mcBr]} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Footer count */}
        {scans.length > 0 && (
          <Text style={styles.footerCount}>
            {scans.length} {scans.length === 1 ? 'species' : 'species'} catalogued
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#0a1a1f',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(79, 229, 212, 0.2)',
  },
  backBtn: { width: 60 },
  backText: { color: '#4fe5d4', fontSize: 12, letterSpacing: 1.5, fontWeight: '600' },
  headerTitle: {
    color: '#f3c46a', fontSize: 16, fontWeight: '700', letterSpacing: 3,
  },

  scrollContent: { padding: 16, paddingBottom: 40 },

  statsRow: {
    flexDirection: 'row', gap: 8, marginBottom: 20,
  },
  statBox: {
    flex: 1, backgroundColor: 'rgba(15, 42, 48, 0.78)',
    borderWidth: 1, borderColor: 'rgba(79, 229, 212, 0.2)',
    borderRadius: 4, padding: 10, alignItems: 'center',
  },
  statNum: {
    color: '#e8fffb', fontSize: 20, fontWeight: '700', marginBottom: 2,
  },
  statLabel: {
    color: '#8fb4b0', fontSize: 7, letterSpacing: 1.5, fontWeight: '500',
  },

  emptyState: {
    alignItems: 'center', paddingVertical: 60, paddingHorizontal: 24,
  },
  emptyIcon: { color: '#4fe5d4', fontSize: 48, marginBottom: 16, opacity: 0.5 },
  emptyTitle: {
    color: '#e8fffb', fontSize: 18, fontWeight: '600', marginBottom: 8,
  },
  emptyText: {
    color: '#8fb4b0', fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 24,
  },
  scanBtn: {
    backgroundColor: '#4fe5d4', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 6,
  },
  scanBtnText: {
    color: '#0a1a1f', fontWeight: '700', letterSpacing: 2, fontSize: 12,
  },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
  },
  gridCell: {
    width: '48%', aspectRatio: 0.85,
    backgroundColor: '#0f2a30',
    borderRadius: 6, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(79, 229, 212, 0.2)',
    position: 'relative',
  },
  cellImage: {
    width: '100%', height: '65%', resizeMode: 'cover',
  },
  safetyDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4,
  },
  cellBadge: {
    position: 'absolute', top: 8, left: 8,
    borderWidth: 1, borderRadius: 3,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  cellBadgeText: { fontSize: 7, letterSpacing: 1.5, fontWeight: '700' },
  cellInfo: {
    padding: 8, flex: 1, justifyContent: 'center',
  },
  cellName: {
    color: '#e8fffb', fontSize: 12, fontWeight: '600', marginBottom: 2,
  },
  cellLatin: {
    color: '#4fe5d4', fontSize: 9, fontStyle: 'italic',
  },
  cellHud: {
    position: 'absolute', top: 4, left: 4, right: 4, bottom: 4,
    pointerEvents: 'none',
  },
  miniCorner: {
    position: 'absolute', width: 10, height: 10,
    borderColor: 'rgba(79, 229, 212, 0.3)', borderWidth: 1,
  },
  mcTl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  mcTr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  mcBl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  mcBr: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },

  footerCount: {
    color: '#8fb4b0', fontSize: 11, letterSpacing: 2,
    textAlign: 'center', marginTop: 20,
  },
});