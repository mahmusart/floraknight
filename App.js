import { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);

  // Permission still loading
  if (!permission) {
    return <View style={styles.container} />;
  }

  // Permission denied — ask for it
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>FloraKnight</Text>
        <Text style={styles.text}>Camera access required to scan plants</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setPhoto(result.uri);
    }
  };

  // Photo captured — show preview
  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.preview} />
        <View style={styles.previewOverlay}>
          <Text style={styles.title}>SCAN COMPLETE</Text>
          <TouchableOpacity style={styles.btn} onPress={() => setPhoto(null)}>
            <Text style={styles.btnText}>Scan another</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Camera viewfinder
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      {/* HUD overlay */}
      <View style={styles.hud} pointerEvents="none">
        <View style={[styles.corner, styles.tl]} />
        <View style={[styles.corner, styles.tr]} />
        <View style={[styles.corner, styles.bl]} />
        <View style={[styles.corner, styles.br]} />
      </View>

      {/* Top label */}
      <View style={styles.topLabel} pointerEvents="none">
        <Text style={styles.topLabelText}>● SCAN MODE</Text>
      </View>

      {/* Capture button */}
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
  preview: { flex: 1, resizeMode: 'cover' },
  previewOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 24, alignItems: 'center',
    backgroundColor: 'rgba(10, 26, 31, 0.85)',
  },
  title: {
    color: '#f3c46a', fontSize: 22, fontWeight: '600',
    letterSpacing: 4, marginBottom: 16,
  },
  text: { color: '#e8fffb', fontSize: 15, marginBottom: 20, textAlign: 'center' },
  topLabel: {
    position: 'absolute', top: 60, alignSelf: 'center',
    backgroundColor: 'rgba(15, 42, 48, 0.85)',
    borderWidth: 1, borderColor: 'rgba(79, 229, 212, 0.45)',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 4,
  },
  topLabelText: {
    color: '#4fe5d4', fontSize: 11, letterSpacing: 2, fontWeight: '500',
  },
  hud: { position: 'absolute', top: 110, left: 32, right: 32, bottom: 200 },
  corner: { position: 'absolute', width: 28, height: 28, borderColor: '#4fe5d4', borderWidth: 2 },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  captureBtn: {
    position: 'absolute', bottom: 60, alignSelf: 'center',
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: '#4fe5d4',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(232, 255, 251, 0.85)',
  },
  captureBtnInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#2cb5a7' },
  btn: {
    backgroundColor: '#4fe5d4', paddingHorizontal: 28, paddingVertical: 12,
    borderRadius: 6,
  },
  btnText: {
    color: '#0a1a1f', fontWeight: '700', letterSpacing: 2, fontSize: 12,
  },
});