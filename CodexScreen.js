import { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Image,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { getAllScans, getStats, deleteMultipleScans } from './database';
import { getCategoryStyle } from './plantSafety';

export default function CodexScreen({ onBack, onViewEntry, renderNavBar }) {
  const [scans, setScans] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [editMode, setEditMode] = useState(false);

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

  const handleLongPress = (scan) => {
    setEditMode(true);
    setSelectedIds(new Set([scan.id]));
  };

  const handlePress = (scan) => {
    if (!editMode) {
      onViewEntry(scan);
      return;
    }
    // In edit mode — toggle selection
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(scan.id)) {
        next.delete(scan.id);
        if (next.size === 0) setEditMode(false);
      } else {
        next.add(scan.id);
      }
      return next;
    });
  };

  const cancelEdit = () => {
    setEditMode(false);
    setSelectedIds(new Set());
  };

  const handleDelete = () => {
    const count = selectedIds.size;
    Alert.alert(
      'Delete entries',
      `Remove ${count} ${count === 1 ? 'entry' : 'entries'} from your codex? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Delete ${count === 1 ? 'entry' : `${count} entries`}`,
          style: 'destructive',
          onPress: async () => {
            const toDelete = scans.filter(s => selectedIds.has(s.id));
            await deleteMultipleScans(toDelete);
            cancelEdit();
            loadData();
          },
        },
      ]
    );
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
        {editMode ? (
          <TouchableOpacity style={styles.backBtn} onPress={cancelEdit}>
            <Text style={styles.cancelText}>CANCEL</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backText}>← SCAN</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>
          {editMode ? `${selectedIds.size} SELECTED` : 'FIELD CODEX'}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      {editMode && (
        <View style={styles.editBanner}>
          <Text style={styles.editBannerText}>
            Long-press more entries to select
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Stats row */}
        {stats && !editMode && (
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
              const isSelected = selectedIds.has(scan.id);
              return (
                <TouchableOpacity
                  key={scan.id}
                  style={[
                    styles.gridCell,
                    isSelected && styles.gridCellSelected,
                  ]}
                  onPress={() => handlePress(scan)}
                  onLongPress={() => handleLongPress(scan)}
                  activeOpacity={0.7}
                  delayLongPress={400}
                >
                  {scan.photoUri ? (
                    <Image source={{ uri: scan.photoUri }} style={styles.cellImage} />
                  ) : (
                    <View style={[styles.cellImage, { backgroundColor: '#0f2a30' }]} />
                  )}

                  {/* Selection overlay */}
                  {editMode && (
                    <View style={[
                      styles.selectionOverlay,
                      isSelected && styles.selectionOverlayActive,
                    ]}>
                      {isSelected && (
                        <Text style={styles.selectionCheck}>✕</Text>
                      )}
                    </View>
                  )}

                  {/* Safety indicator dot */}
                  {!editMode && (
                    <View style={[styles.safetyDot, { backgroundColor: catStyle.color }]} />
                  )}

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

        {scans.length > 0 && !editMode && (
          <Text style={styles.footerCount}>
            {scans.length} {scans.length === 1 ? 'species' : 'species'} catalogued
          </Text>
        )}

        {editMode && (
          <Text style={styles.footerHint}>
            Tap entries to select · Long-press to add more
          </Text>
        )}
      </ScrollView>

      {/* Delete button — only visible in edit mode */}
      {editMode && selectedIds.size > 0 && (
        <TouchableOpacity style={styles.deleteBar} onPress={handleDelete}>
          <Text style={styles.deleteBarText}>
            ✕ DELETE {selectedIds.size} {selectedIds.size === 1 ? 'ENTRY' : 'ENTRIES'}
          </Text>
        </TouchableOpacity>
      )}

      {renderNavBar && renderNavBar()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#0a1a1f',
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(79, 229, 212, 0.2)',
  },
  backBtn: { width: 60 },
  backText: { color: '#4fe5d4', fontSize: 12, letterSpacing: 1.5, fontWeight: '600' },
  cancelText: { color: '#ff7b8a', fontSize: 12, letterSpacing: 1.5, fontWeight: '600' },
  headerTitle: {
    color: '#f3c46a', fontSize: 16, fontWeight: '700', letterSpacing: 3,
  },
  editBanner: {
    backgroundColor: 'rgba(255, 123, 138, 0.08)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(255, 123, 138, 0.2)',
    paddingVertical: 8, alignItems: 'center',
  },
  editBannerText: {
    color: '#ff7b8a', fontSize: 10, letterSpacing: 1.5,
  },
  scrollContent: { padding: 16, paddingBottom: 100 },
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
  gridCellSelected: {
    borderColor: '#ff7b8a',
    borderWidth: 2,
  },
  cellImage: {
    width: '100%', height: '65%', resizeMode: 'cover',
  },
  selectionOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '65%',
    backgroundColor: 'transparent',
    alignItems: 'center', justifyContent: 'center',
  },
  selectionOverlayActive: {
    backgroundColor: 'rgba(255, 123, 138, 0.45)',
  },
  selectionCheck: {
    color: '#fff', fontSize: 28, fontWeight: '700',
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
  footerHint: {
    color: '#8fb4b0', fontSize: 10, letterSpacing: 1.5,
    textAlign: 'center', marginTop: 16,
  },
  deleteBar: {
    position: 'absolute', bottom: 56, left: 16, right: 16,
    backgroundColor: '#ff7b8a',
    paddingVertical: 16, borderRadius: 6,
    alignItems: 'center',
    shadowColor: '#ff7b8a', shadowOpacity: 0.4,
    shadowRadius: 12, shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  deleteBarText: {
    color: '#0a1a1f', fontWeight: '700', letterSpacing: 2.5, fontSize: 12,
  },
});