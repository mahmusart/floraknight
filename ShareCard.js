import { forwardRef } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { getCategoryStyle } from './plantSafety';

const ShareCard = forwardRef(({ photo, result, safety }, ref) => {
  const catStyle = getCategoryStyle(safety.category);

  return (
    <ViewShot
      ref={ref}
      options={{ format: 'png', quality: 1 }}
      style={styles.card}
    >
      <View style={styles.photoContainer}>
        <Image source={{ uri: photo }} style={styles.photo} />
        <View style={styles.hudOverlay}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
        </View>
        <View style={styles.scanBadge}>
          <Text style={styles.scanBadgeText}>● IDENTIFIED</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.commonName}>{result.commonName}</Text>
        <Text style={styles.sciName}>{result.scientificName}</Text>

        <View style={[
          styles.safetyRow,
          { borderColor: catStyle.color, backgroundColor: catStyle.color + '15' },
        ]}>
          <Text style={[styles.safetyIcon, { color: catStyle.color }]}>
            {catStyle.icon}
          </Text>
          <Text style={[styles.safetyLabel, { color: catStyle.color }]}>
            {catStyle.label}
          </Text>
          <Text style={styles.confidence}>{result.confidence}% match</Text>
        </View>

        <Text style={styles.summary} numberOfLines={2}>
          {safety.summary}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.logoText}>FLORAKNIGHT</Text>
          <Text style={styles.tagline}>Scan. Discover. Grow.</Text>
        </View>
        <View style={styles.footerRight}>
          <Text style={styles.tiktokLabel}>Find us on TikTok</Text>
          <Text style={styles.tiktokHandle}>@tekkmood</Text>
        </View>
      </View>
    </ViewShot>
  );
});

const styles = StyleSheet.create({
  card: {
    width: 360,
    backgroundColor: '#0a1a1f',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(79, 229, 212, 0.4)',
  },
  photoContainer: {
    width: '100%',
    height: 280,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  hudOverlay: {
    position: 'absolute',
    top: 16, left: 16, right: 16, bottom: 16,
  },
  corner: {
    position: 'absolute', width: 20, height: 20,
    borderColor: '#4fe5d4', borderWidth: 1.5,
  },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  scanBadge: {
    position: 'absolute', top: 12, alignSelf: 'center',
    backgroundColor: 'rgba(10, 26, 31, 0.85)',
    borderWidth: 1, borderColor: 'rgba(79, 229, 212, 0.5)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 3,
  },
  scanBadgeText: {
    color: '#4fe5d4', fontSize: 9, letterSpacing: 2, fontWeight: '600',
  },
  infoSection: { padding: 16 },
  commonName: { color: '#e8fffb', fontSize: 22, fontWeight: '700', marginBottom: 2 },
  sciName: { color: '#4fe5d4', fontSize: 12, fontStyle: 'italic', marginBottom: 12 },
  safetyRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderRadius: 4,
    paddingHorizontal: 10, paddingVertical: 8,
    marginBottom: 10, gap: 8,
  },
  safetyIcon: { fontSize: 16, fontWeight: 'bold' },
  safetyLabel: { fontSize: 10, letterSpacing: 2, fontWeight: '700' },
  confidence: { color: '#8fb4b0', fontSize: 10, marginLeft: 'auto', letterSpacing: 1 },
  summary: { color: '#e8fffb', fontSize: 11, lineHeight: 16, opacity: 0.85 },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: 'rgba(79, 229, 212, 0.2)',
    backgroundColor: 'rgba(6, 18, 22, 0.6)',
  },
  footerLeft: {},
  logoText: { color: '#f3c46a', fontSize: 11, fontWeight: '700', letterSpacing: 3 },
  tagline: { color: '#8fb4b0', fontSize: 8, letterSpacing: 1.5, marginTop: 1 },
  footerRight: { alignItems: 'flex-end' },
  tiktokLabel: { color: '#8fb4b0', fontSize: 8, letterSpacing: 1 },
  tiktokHandle: { color: '#4fe5d4', fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
});

export default ShareCard;