import { useState, useRef } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Image,
  ActivityIndicator, ScrollView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { identifyPlant } from './plantNet';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const cameraRef = useRef(null);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>FLORAKNIGHT</Text>
        <Text style={styles.text}>Camera access required to scan plants</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const reset = () => {
    setPhoto(null);
    setResult(null);
    setError(null);
    setScanning(false);
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const captured = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setPhoto(captured.uri);
      setScanning(true);
      setError(null);

      const identified = await identifyPlant(captured.uri);
      setResult(identified);
    } catch (e) {
      setError(e.message);
    } finally {
      setScanning(false);
    }
  };

  // Result or error screen
  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.preview} />
        <View style={styles.resultPanel}>
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {scanning && (
              <View style={styles.scanningBox}>
                <ActivityIndicator size="large" color="#4fe5d4" />
                <Text style={styles.scanningText}>ANALYZING SUBJECT...</Text>
              </View>
            )}

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorTitle}>SCAN FAILED</Text>
                <Text style={styles.errorMsg}>{error}</Text>
              </View>
            )}

            {result && (
              <>
                <Text style={styles.codexTag}>SUBJECT IDENTIFIED</Text>
                <Text style={styles.species}>{result.commonName}</Text>
                <Text style={styles.latin}>{result.scientificName}</Text>

                <View style={styles.confidenceBox}>
                  <Text style={styles.label}>MATCH CONFIDENCE</Text>
                  <Text style={styles.confidenceValue}>{result.confidence}%</Text>
                  <View style={styles.confBar}>
                    <View style={[styles.confFill, { width: `${result.confidence}%` }]} />
                  </View>
                </View>

                <View style={styles.infoCard}>
                  <Text style={styles.cardTitle}>TAXONOMY</Text>
                  <Text style={styles.cardText}>Family: {result.family}</Text>
                  <Text style={styles.cardText}>Genus: {result.genus}</Text>
                </View>

                {result.allMatches.length > 1 && (
                  <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>OTHER POSSIBILITIES</Text>
                    {result.allMatches.slice(1).map((m, i) => (
                      <Text key={i} style={styles.cardText}>
                        {m.commonName} — {m.confidence}%
                      </Text>
                    ))}
                  </View>
                )}
              </>
            )}

            <TouchableOpacity style={styles.btn} onPress={reset}>
              <Text style={styles.btnText}>Scan another</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  }

  // Camera viewfinder
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <View style={styles.hud} pointerEvents="none">
        <View style={[styles.corner, styles.tl]} />
        <View style={[styles.corner, styles.tr]} />
        <View style={[styles.corner, styles.bl]} />
        <View style={[styles.corner, styles.br]} />
      </View>
      <View style={styles.topLabel} pointerEvents="none">
        <Text style={styles.topLabelText}>● SCAN MODE</Text>
      </View>
      <TouchableOpacity style={styles.captureBtn} onPress={takePhoto}>
        <View style={styles.captureBtnInner} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1a1f' },
  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#0a1a1f', padding: 24,
  },
  camera: { flex: 1 },
  preview: { position: 'absolute', top: 0, left: 0, right: 0, height: '40%', resizeMode: 'cover' },
  title: { color: '#f3c46a', fontSize: 24, fontWeight: '600', letterSpacing: 4, marginBottom: 16 },
  text: { color: '#e8fffb', fontSize: 15, marginBottom: 20, textAlign: 'center' },
  topLabel: {
    position: 'absolute', top: 60, alignSelf: 'center',
    backgroundColor: 'rgba(15, 42, 48, 0.85)',
    borderWidth: 1, borderColor: 'rgba(79, 229, 212, 0.45)',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 4,
  },
  topLabelText: { color: '#4fe5d4', fontSize: 11, letterSpacing: 2, fontWeight: '500' },
  hud: { position: 'absolute', top: 110, left: 32, right: 32, bottom: 200 },
  corner: { position: 'absolute', width: 28, height: 28, borderColor: '#4fe5d4', borderWidth: 2 },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  captureBtn: {
    position: 'absolute', bottom: 60, alignSelf: 'center',
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: '#4fe5d4', alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(232, 255, 251, 0.85)',
  },
  captureBtnInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#2cb5a7' },

  resultPanel: {
    position: 'absolute', top: '40%', left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(10, 26, 31, 0.97)', padding: 22,
    borderTopWidth: 1, borderColor: 'rgba(79, 229, 212, 0.45)',
  },
  scanningBox: { alignItems: 'center', paddingVertical: 40 },
  scanningText: {
    color: '#4fe5d4', marginTop: 16,
    letterSpacing: 3, fontSize: 12, fontWeight: '500',
  },
  errorBox: {
    backgroundColor: 'rgba(255, 123, 138, 0.1)',
    borderLeftWidth: 2, borderLeftColor: '#ff7b8a',
    padding: 14, marginBottom: 16, borderRadius: 4,
  },
  errorTitle: { color: '#ff7b8a', fontSize: 11, letterSpacing: 2, marginBottom: 6, fontWeight: '600' },
  errorMsg: { color: '#e8fffb', fontSize: 13, lineHeight: 18 },
  codexTag: { color: '#f3c46a', fontSize: 10, letterSpacing: 2, marginBottom: 6 },
  species: { color: '#e8fffb', fontSize: 24, fontWeight: '600', marginBottom: 4 },
  latin: { color: '#4fe5d4', fontSize: 13, fontStyle: 'italic', marginBottom: 18 },
  confidenceBox: {
    backgroundColor: 'rgba(15, 42, 48, 0.78)', padding: 12, borderRadius: 4,
    borderWidth: 1, borderColor: 'rgba(79, 229, 212, 0.25)', marginBottom: 12,
  },
  label: { color: '#8fb4b0', fontSize: 10, letterSpacing: 1.5, marginBottom: 4 },
  confidenceValue: { color: '#6cd9a3', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  confBar: { height: 4, backgroundColor: 'rgba(79, 229, 212, 0.1)', borderRadius: 2, overflow: 'hidden' },
  confFill: { height: '100%', backgroundColor: '#6cd9a3' },
  infoCard: {
    backgroundColor: 'rgba(15, 42, 48, 0.78)', padding: 14, borderRadius: 4,
    borderWidth: 1, borderColor: 'rgba(79, 229, 212, 0.25)',
    borderLeftWidth: 2, borderLeftColor: '#f3c46a', marginBottom: 12,
  },
  cardTitle: { color: '#f3c46a', fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  cardText: { color: '#e8fffb', fontSize: 13, lineHeight: 20 },
  btn: {
    backgroundColor: '#4fe5d4', paddingHorizontal: 28, paddingVertical: 14,
    borderRadius: 6, marginTop: 8, alignSelf: 'center',
  },
  btnText: { color: '#0a1a1f', fontWeight: '700', letterSpacing: 2, fontSize: 12 },
});