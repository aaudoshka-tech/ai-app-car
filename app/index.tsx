import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Images, Wand2, Share2 } from 'lucide-react-native';
import { colors, typography, spacing, radius } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PREVIEW_W = SCREEN_WIDTH - spacing.xl * 2;

const DEMO_PHOTOS = [
  'https://images.pexels.com/photos/38290951/pexels-photo-38290951.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/9121191/pexels-photo-9121191.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/31823166/pexels-photo-31823166.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/19432553/pexels-photo-19432553.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.wordmark}>CAROUSEL</Text>

        <View style={styles.hero}>
          <Text style={styles.headline}>Your camera roll.{'\n'}Curated.</Text>
          <Text style={styles.subtitle}>
            Turn your favourite moments into a carousel worth sharing.
          </Text>
        </View>

        <View style={styles.previewSection}>
          <View style={styles.previewLabelRow}>
            <View style={styles.previewDot} />
            <Text style={styles.previewLabel}>INSTAGRAM CAROUSEL PREVIEW</Text>
          </View>
          <View style={styles.previewStack}>
            {DEMO_PHOTOS.map((uri, i) => {
              const offset = i * 10;
              const scale = 1 - i * 0.04;
              return (
                <View
                  key={i}
                  style={[
                    styles.previewCard,
                    {
                      zIndex: DEMO_PHOTOS.length - i,
                      transform: [
                        { translateY: -offset },
                        { scale },
                      ],
                    },
                  ]}
                >
                  <Image source={{ uri }} style={styles.previewImage} />
                  <View style={styles.previewNum}>
                    <Text style={styles.previewNumText}>{i + 1}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/select')}
          activeOpacity={0.9}
        >
          <Text style={styles.ctaText}>Choose your photos</Text>
          <View style={styles.ctaArrow}>
            <ArrowRight size={18} color={colors.charcoal} strokeWidth={2.5} />
          </View>
        </TouchableOpacity>

        <View style={styles.stepsSection}>
          <Step
            num="01"
            icon={<Images size={18} color={colors.charcoal} strokeWidth={2} />}
            title="Select"
            description="Pick photos straight from your library"
          />
          <View style={styles.stepDivider} />
          <Step
            num="02"
            icon={<Wand2 size={18} color={colors.charcoal} strokeWidth={2} />}
            title="Curate"
            description="AI ranks your shots and suggests an order"
          />
          <View style={styles.stepDivider} />
          <Step
            num="03"
            icon={<Share2 size={18} color={colors.charcoal} strokeWidth={2} />}
            title="Share"
            description="Preview, fine-tune, and post your carousel"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Step({
  num,
  icon,
  title,
  description,
}: {
  num: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.step}>
      <View style={styles.stepLeft}>
        <Text style={styles.stepNum}>{num}</Text>
        <View style={styles.stepIcon}>{icon}</View>
      </View>
      <View style={styles.stepRight}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDesc}>{description}</Text>
      </View>
    </View>
  );
}

const PREVIEW_CARD_W = PREVIEW_W;
const PREVIEW_CARD_H = PREVIEW_W * 1.25;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  wordmark: {
    ...typography.label,
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoal,
    fontSize: 13,
    letterSpacing: 2.5,
    marginBottom: spacing.xxl,
  },
  hero: {
    marginBottom: spacing.xl,
  },
  headline: {
    fontFamily: 'Playfair-Bold',
    fontSize: 40,
    lineHeight: 46,
    color: colors.charcoal,
    marginBottom: spacing.md,
    letterSpacing: -0.8,
  },
  subtitle: {
    ...typography.callout,
    fontFamily: 'Inter-Regular',
    color: colors.charcoalMuted,
    maxWidth: 300,
  },
  previewSection: {
    marginBottom: spacing.xl,
  },
  previewLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  previewDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.lime,
  },
  previewLabel: {
    ...typography.label,
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoalLight,
    fontSize: 10,
  },
  previewStack: {
    height: PREVIEW_CARD_H + 30,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  previewCard: {
    position: 'absolute',
    width: PREVIEW_CARD_W,
    height: PREVIEW_CARD_H,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.ivoryDark,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  previewNum: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(26,26,24,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewNumText: {
    ...typography.caption,
    fontFamily: 'Inter-SemiBold',
    color: colors.white,
    fontSize: 11,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.charcoal,
    paddingVertical: spacing.md + 3,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.xxl,
  },
  ctaText: {
    ...typography.title3,
    fontFamily: 'Inter-SemiBold',
    color: colors.ivory,
    flex: 1,
  },
  ctaArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsSection: {
    backgroundColor: colors.ivoryLight,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  stepLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    width: 70,
    flexShrink: 0,
  },
  stepNum: {
    ...typography.caption,
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoalLight,
    fontSize: 11,
  },
  stepIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.limeSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepRight: {
    flex: 1,
  },
  stepTitle: {
    ...typography.headline,
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoal,
    marginBottom: 2,
  },
  stepDesc: {
    ...typography.footnote,
    fontFamily: 'Inter-Regular',
    color: colors.charcoalMuted,
  },
  stepDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.hairline,
  },
});
