import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// Swap to your real ID when building for production
const IS_DEV = __DEV__;
const AD_UNIT_ID = IS_DEV
  ? TestIds.BANNER
  : 'ca-app-pub-5099665443395890/1817461817';

export default function AdBanner() {
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={AD_UNIT_ID}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // GDPR/privacy safe default
        }}
        onAdFailedToLoad={(error) => {
          console.log('Ad failed to load:', error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(10, 26, 31, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(79, 229, 212, 0.15)',
    paddingVertical: 4,
  },
});