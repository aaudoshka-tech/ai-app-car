import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Image,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Check, RotateCcw, Star } from 'lucide-react-native';
import { colors, typography, spacing, radius } from '@/constants/theme';
import { useCarousel } from '@/context/CarouselContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDE_WIDTH = SCREEN_WIDTH - spacing.lg * 2;
const SLIDE_HEIGHT = SLIDE_WIDTH * 1.25;

export default function PreviewScreen() {
  const { carouselOrder, reset } = useCarousel();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  if (carouselOrder.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nothing to preview.</Text>
          <TouchableOpacity onPress={() => router.push('/select')}>
            <Text style={styles.emptyLink}>Select Photos</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    if (index !== currentIndex) setCurrentIndex(index);
  };

  const goTo = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * SLIDE_WIDTH, animated: true });
  };

  const goPrev = () => {
    if (currentIndex > 0) goTo(currentIndex - 1);
  };

  const goNext = () => {
    if (currentIndex < carouselOrder.length - 1) goTo(currentIndex + 1);
  };

  const handleStartOver = () => {
    reset();
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.push('/results')} activeOpacity={0.7}>
          <ChevronLeft size={22} color={colors.charcoal} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Preview</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.body}>
        <View style={styles.counterRow}>
          <Text style={styles.counter}>
            {currentIndex + 1} <Text style={styles.counterTotal}>/ {carouselOrder.length}</Text>
          </Text>
          {carouselOrder[currentIndex]?.isCover && (
            <View style={styles.coverTag}>
              <Star size={9} color={colors.charcoal} strokeWidth={2.5} fill={colors.lime} />
              <Text style={styles.coverTagText}>COVER</Text>
            </View>
          )}
        </View>

        <View style={styles.carouselWrap}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollContent}
          >
            {carouselOrder.map((photo, index) => (
              <View key={photo.id} style={styles.slide}>
                <Image
                  source={{ uri: photo.uri }}
                  style={styles.slideImage}
                  resizeMode="cover"
                />
                <View style={styles.slideNumWrap}>
                  <Text style={styles.slideNum}>{index + 1}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.navControls}>
          <TouchableOpacity
            style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
            onPress={goPrev}
            disabled={currentIndex === 0}
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color={currentIndex === 0 ? colors.charcoalFaint : colors.charcoal} strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.dots}>
            {carouselOrder.map((_, index) => (
              <TouchableOpacity key={index} onPress={() => goTo(index)}>
                <View style={[styles.dot, index === currentIndex && styles.dotActive]} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.navBtn,
              currentIndex === carouselOrder.length - 1 && styles.navBtnDisabled,
            ]}
            onPress={goNext}
            disabled={currentIndex === carouselOrder.length - 1}
            activeOpacity={0.7}
          >
            <ChevronRight
              size={20}
              color={currentIndex === carouselOrder.length - 1 ? colors.charcoalFaint : colors.charcoal}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbStrip}
        >
          {carouselOrder.map((photo, index) => (
            <TouchableOpacity
              key={photo.id}
              onPress={() => goTo(index)}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: photo.uri }}
                style={[styles.thumb, index === currentIndex && styles.thumbActive]}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.startOverBtn} onPress={handleStartOver} activeOpacity={0.85}>
          <RotateCcw size={16} color={colors.charcoal} strokeWidth={2} />
          <Text style={styles.startOverText}>Start Over</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => router.push('/')}
          activeOpacity={0.9}
        >
          <Check size={18} color={colors.lime} strokeWidth={2.5} />
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  navTitle: {
    fontFamily: 'Playfair-SemiBold',
    fontSize: 20,
    color: colors.charcoal,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  counter: {
    ...typography.title3,
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoal,
  },
  counterTotal: {
    ...typography.callout,
    fontFamily: 'Inter-Regular',
    color: colors.charcoalLight,
  },
  coverTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.lime,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  coverTagText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoal,
    letterSpacing: 0.5,
  },
  carouselWrap: {
    width: SLIDE_WIDTH,
    height: SLIDE_HEIGHT,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  scrollContent: {
    alignItems: 'center',
  },
  slide: {
    width: SLIDE_WIDTH,
    height: SLIDE_HEIGHT,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.ivoryDark,
    position: 'relative',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  slideNumWrap: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(26,26,24,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideNum: {
    fontFamily: 'Inter-SemiBold',
    color: colors.ivory,
    fontSize: 13,
  },
  navControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.ivoryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  navBtnDisabled: {
    opacity: 0.35,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.charcoalFaint,
  },
  dotActive: {
    backgroundColor: colors.charcoal,
    width: 22,
  },
  thumbStrip: {
    gap: spacing.xs + 2,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: radius.xs,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.ivoryDark,
    opacity: 0.5,
  },
  thumbActive: {
    borderColor: colors.charcoal,
    opacity: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  startOverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    flex: 1,
    backgroundColor: colors.ivoryLight,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  startOverText: {
    ...typography.headline,
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoal,
  },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    flex: 1,
    backgroundColor: colors.charcoal,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  doneText: {
    ...typography.headline,
    fontFamily: 'Inter-SemiBold',
    color: colors.lime,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.ivory,
  },
  emptyText: {
    ...typography.body,
    fontFamily: 'Inter-Regular',
    color: colors.charcoalMuted,
  },
  emptyLink: {
    ...typography.headline,
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoal,
  },
});
