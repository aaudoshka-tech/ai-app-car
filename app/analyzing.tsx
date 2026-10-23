import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback } from 'react';
import { colors, typography, spacing, radius } from '@/constants/theme';
import { useCarousel } from '@/context/CarouselContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDE_W = SCREEN_WIDTH - spacing.xl * 2;

const STEPS = [
  'Studying composition and framing',
  'Evaluating colour and contrast',
  'Scoring cover potential',
  'Mapping the narrative flow',
];

export default function AnalyzingScreen() {
  const { photos, isAnalyzing, carouselOrder } = useCarousel();

  useFocusEffect(
    useCallback(() => {
      if (!isAnalyzing && carouselOrder.length > 0) {
        const timer = setTimeout(() => router.replace('/results'), 200);
        return () => clearTimeout(timer);
      }
      if (!isAnalyzing && carouselOrder.length === 0 && photos.length > 0) {
        router.replace('/select');
      }
    }, [isAnalyzing, carouselOrder.length, photos.length])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.wordmark}>CAROUSEL</Text>

        <Text style={styles.title}>Curating your photos</Text>
        <Text style={styles.subtitle}>
          Our AI is reviewing each image to find the strongest cover and the most compelling sequence.
        </Text>

        <View style={styles.previewWrap}>
          {photos.slice(0, 5).map((photo, i) => {
            const angle = (i - 2) * 6;
            const offset = Math.abs(i - 2) * 8;
            return (
              <View
                key={photo.id}
                style={[
                  styles.previewCard,
                  {
                    zIndex: photos.length - Math.abs(i - 2),
                    transform: [
                      { rotate: `${angle}deg` },
                      { translateY: -offset },
                    ],
                  },
                ]}
              >
                <Image source={{ uri: photo.uri }} style={styles.previewImage} />
              </View>
            );
          })}
        </View>

        <View style={styles.stepsContainer}>
          {STEPS.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepDot}>
                <View style={styles.stepDotInner} />
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.spacer} />

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Placeholder analysis — no real AI model is connected yet.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const CARD_W = SLIDE_W * 0.55;
const CARD_H = CARD_W * 1.3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  wordmark: {
    ...typography.label,
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoalLight,
    fontSize: 11,
    letterSpacing: 2.5,
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 32,
    lineHeight: 38,
    color: colors.charcoal,
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    ...typography.subheadline,
    fontFamily: 'Inter-Regular',
    color: colors.charcoalMuted,
    maxWidth: 300,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  previewWrap: {
    height: CARD_H + 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  previewCard: {
    position: 'absolute',
    width: CARD_W,
    height: CARD_H,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.ivoryDark,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  stepsContainer: {
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.limeSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotInner: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.lime,
  },
  stepText: {
    ...typography.subheadline,
    fontFamily: 'Inter-Regular',
    color: colors.charcoal,
  },
  spacer: {
    flex: 1,
  },
  disclaimer: {
    backgroundColor: colors.ivoryDark,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  disclaimerText: {
    ...typography.footnote,
    fontFamily: 'Inter-Regular',
    color: colors.charcoalMuted,
    textAlign: 'center',
  },
});
