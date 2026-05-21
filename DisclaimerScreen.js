import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function DisclaimerScreen({ onBack }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DISCLAIMER</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.warningBanner}>
          <Text style={styles.warningIcon}>⚠</Text>
          <Text style={styles.warningText}>
            Read this before using FloraKnight for safety decisions.
          </Text>
        </View>

        <Text style={styles.section}>Plant Identification</Text>
        <Text style={styles.body}>
          FloraKnight uses the PlantNet API to identify plant species from photos. While PlantNet is a well-regarded scientific tool, no automated plant identification system is 100% accurate. Lighting conditions, photo angle, growth stage, and regional variation can all affect results.
        </Text>
        <Text style={styles.body}>
          Never consume, handle, or use a plant medicinally based solely on FloraKnight's identification. Always verify with a qualified botanist, local expert, or trusted printed field guide before acting on any result.
        </Text>

        <Text style={styles.section}>Safety Classifications</Text>
        <Text style={styles.body}>
          The edible, medicinal, toxic, and caution classifications in FloraKnight are provided for general informational purposes only. They reflect commonly reported properties and are not exhaustive.
        </Text>
        <Text style={styles.bullet}>• A plant classified as "edible" may still cause reactions in some individuals.</Text>
        <Text style={styles.bullet}>• A plant classified as "medicinal" is not a prescription or medical advice.</Text>
        <Text style={styles.bullet}>• Toxic classifications may not cover all harmful parts or preparation methods.</Text>
        <Text style={styles.bullet}>• An "unknown" classification means the species is not in our database — not that it is safe.</Text>

        <Text style={styles.section}>Disease Detection</Text>
        <Text style={styles.body}>
          The plant disease detection feature uses a machine learning model trained on the PlantVillage dataset, which covers 14 crop species. Results for plants outside this dataset (including many tropical and West African species) may be inaccurate or misleading.
        </Text>
        <Text style={styles.body}>
          Disease detection results should not replace professional agronomic advice. For crop health concerns with economic or livelihood implications, consult an agricultural extension officer or qualified plant pathologist.
        </Text>

        <Text style={styles.section}>No Medical or Agricultural Advice</Text>
        <Text style={styles.body}>
          Nothing in FloraKnight constitutes medical advice, nutritional guidance, or professional agricultural advice. The app is an educational tool designed to assist plant discovery and awareness — not to replace expert judgment.
        </Text>

        <Text style={styles.section}>Limitation of Liability</Text>
        <Text style={styles.body}>
          Tekkmood and the FloraKnight development team accept no liability for any harm, illness, injury, crop loss, or adverse outcome resulting from reliance on information provided by this app. Use FloraKnight at your own risk and always apply independent judgment.
        </Text>

        <Text style={styles.section}>Contact</Text>
        <Text style={styles.body}>
          Questions about this disclaimer? Contact us at tekkmood@tekkmoodarts.com.
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1a1f' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(79, 229, 212, 0.2)',
  },
  backText: { color: '#4fe5d4', fontSize: 12, letterSpacing: 1.5, fontWeight: '600', width: 60 },
  headerTitle: { color: '#f3c46a', fontSize: 14, fontWeight: '700', letterSpacing: 3 },
  content: { padding: 20 },
  warningBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255, 180, 84, 0.1)',
    borderWidth: 1, borderColor: 'rgba(255, 180, 84, 0.4)',
    borderRadius: 6, padding: 14, marginBottom: 24,
  },
  warningIcon: { fontSize: 22, color: '#ffb454' },
  warningText: { color: '#ffb454', fontSize: 13, lineHeight: 19, flex: 1 },
  section: {
    color: '#f3c46a', fontSize: 12, fontWeight: '700',
    letterSpacing: 2, marginTop: 24, marginBottom: 8,
  },
  body: { color: '#e8fffb', fontSize: 13, lineHeight: 21, marginBottom: 8 },
  bullet: { color: '#e8fffb', fontSize: 13, lineHeight: 21, paddingLeft: 8, marginBottom: 4 },
});