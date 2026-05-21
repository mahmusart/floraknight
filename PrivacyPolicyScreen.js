import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function PrivacyPolicyScreen({ onBack }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PRIVACY POLICY</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.updated}>Last updated: May 2026</Text>

        <Text style={styles.section}>1. Who We Are</Text>
        <Text style={styles.body}>
          FloraKnight is developed by Tekkmood (Nigeria). You can contact us at tekkmood@gmail.com with any questions about this policy.
        </Text>

        <Text style={styles.section}>2. What Data We Collect</Text>
        <Text style={styles.body}>
          FloraKnight collects the minimum data necessary to function:
        </Text>
        <Text style={styles.bullet}>• Photos you take within the app — sent to PlantNet's API for plant identification, then stored locally on your device only.</Text>
        <Text style={styles.bullet}>• Scan results — plant name, species, safety category, and scan date are stored in a local database on your device.</Text>
        <Text style={styles.bullet}>• Daily scan count — stored locally on your device to manage your free scan limit. Resets every day.</Text>
        <Text style={styles.bullet}>• Advertising data — our ad partner (Google AdMob) may collect device identifiers and usage data to serve relevant ads. See Google's privacy policy at policies.google.com/privacy.</Text>

        <Text style={styles.section}>3. What We Do NOT Collect</Text>
        <Text style={styles.bullet}>• We do not collect your name, email, or any personal account information.</Text>
        <Text style={styles.bullet}>• We do not store your photos on any server. Photos are sent to PlantNet solely for identification and are not retained by us.</Text>
        <Text style={styles.bullet}>• We do not sell your data to any third party.</Text>
        <Text style={styles.bullet}>• We do not track your location.</Text>

        <Text style={styles.section}>4. Third-Party Services</Text>
        <Text style={styles.body}>
          FloraKnight uses the following third-party services to operate:
        </Text>
        <Text style={styles.bullet}>• PlantNet API (Pl@ntNet) — plant species identification. Privacy policy: plantnet.org</Text>
        <Text style={styles.bullet}>• Hugging Face — disease detection and object recognition. Privacy policy: huggingface.co/privacy</Text>
        <Text style={styles.bullet}>• Google AdMob — advertising. Privacy policy: policies.google.com/privacy</Text>

        <Text style={styles.section}>5. Data Storage</Text>
        <Text style={styles.body}>
          All scan history and photos are stored exclusively on your device using local SQLite storage and your device's file system. Uninstalling FloraKnight permanently deletes all this data. We have no access to it.
        </Text>

        <Text style={styles.section}>6. Children's Privacy</Text>
        <Text style={styles.body}>
          FloraKnight is not directed at children under the age of 13. We do not knowingly collect data from children.
        </Text>

        <Text style={styles.section}>7. Your Rights</Text>
        <Text style={styles.body}>
          Since all data is stored on your device, you have full control over it. You can delete your entire scan history from within the Codex tab at any time. Uninstalling the app removes all data permanently.
        </Text>

        <Text style={styles.section}>8. Changes to This Policy</Text>
        <Text style={styles.body}>
          We may update this policy as the app evolves. The latest version will always be accessible within the app. Continued use after changes constitutes acceptance.
        </Text>

        <Text style={styles.section}>9. Contact</Text>
        <Text style={styles.body}>
          Questions or concerns? Reach us at tekkmood@tekkmoodarts.com.
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
  updated: { color: '#8fb4b0', fontSize: 11, letterSpacing: 1, marginBottom: 24 },
  section: {
    color: '#f3c46a', fontSize: 12, fontWeight: '700',
    letterSpacing: 2, marginTop: 24, marginBottom: 8,
  },
  body: { color: '#e8fffb', fontSize: 13, lineHeight: 21, marginBottom: 8 },
  bullet: { color: '#e8fffb', fontSize: 13, lineHeight: 21, paddingLeft: 8, marginBottom: 4 },
});