import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, X, ArrowUp, ArrowDown, Eye, Star, RefreshCw, Wand2 } from 'lucide-react-native';
import { colors, typography, spacing, radius } from '@/constants/theme';
import { useCarousel } from '@/context/CarouselContext';
import { RankedPhoto } from '@/types/photo';

export default function ResultsScreen() {
  const { carouselOrder, setCarouselOrder } = useCarousel();

  if (carouselOrder.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No analysis results yet.</Text>
          <TouchableOpacity onPress={() => router.push('/select')}>
            <Text style={styles.emptyLink}>Select Photos</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const cover = carouselOrder.find((p) => p.isCover) ?? carouselOrder[0];

  const moveUp = (index: number) => {
    if (index <= 0) return;
    const next = [...carouselOrder];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setCarouselOrder(next);
  };

  const moveDown = (index: number) => {
    if (index >= carouselOrder.length - 1) return;
    const next = [...carouselOrder];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setCarouselOrder(next);
  };

  const removePhoto = (id: string) => {
    if (carouselOrder.length <= 2) {
      Alert.alert('Keep at least 2 photos', 'You need at least 2 photos for a carousel.');
      return;
    }
    setCarouselOrder(carouselOrder.filter((p) => p.id !== id));
  };

  const renderItem = ({ item, index }: { item: RankedPhoto; index: number }) => (
    <View style={styles.rankRow}>
      <View style={styles.rankNumber}>
        <Text style={styles.rankNumberText}>{index + 1}</Text>
      </View>
      <Image source={{ uri: item.uri }} style={styles.rankThumb} />
      <View style={styles.rankInfo}>
        <View style={styles.rankHeader}>
          {item.isCover && (
            <View style={styles.coverBadge}>
              <Star size={9} color={colors.charcoal} strokeWidth={2.5} fill={colors.lime} />
              <Text style={styles.coverBadgeText}>COVER</Text>
            </View>
          )}
          <Text style={styles.rankLabel}>Slide {index + 1}</Text>
        </View>
        <Text style={styles.rankReason}>{item.reason}</Text>
      </View>
      <View style={styles.rankControls}>
        <TouchableOpacity
          style={[styles.controlBtn, index === 0 && styles.controlBtnDisabled]}
          onPress={() => moveUp(index)}
          disabled={index === 0}
          activeOpacity={0.7}
        >
          <ArrowUp size={15} color={index === 0 ? colors.charcoalFaint : colors.charcoal} strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.controlBtn,
            index === carouselOrder.length - 1 && styles.controlBtnDisabled,
          ]}
          onPress={() => moveDown(index)}
          disabled={index === carouselOrder.length - 1}
          activeOpacity={0.7}
        >
          <ArrowDown
            size={15}
            color={index === carouselOrder.length - 1 ? colors.charcoalFaint : colors.charcoal}
            strokeWidth={2}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removePhoto(item.id)} activeOpacity={0.7}>
          <X size={16} color={colors.red} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.push('/select')} activeOpacity={0.7}>
          <ChevronLeft size={22} color={colors.charcoal} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>The Edit</Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={carouselOrder}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            <View style={styles.directorNote}>
              <View style={styles.directorNoteHeader}>
                <Wand2 size={14} color={colors.charcoal} strokeWidth={2} />
                <Text style={styles.directorNoteLabel}>CREATIVE DIRECTION</Text>
              </View>
              <Text style={styles.directorNoteText}>
                Here's your recommended carousel. The strongest image leads as your cover — each
                subsequent slide builds a visual narrative that rewards swiping through.
              </Text>
              <View style={styles.disclaimerTag}>
                <Text style={styles.disclaimerTagText}>Placeholder analysis — connect a real AI model for accurate curation</Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>RECOMMENDED COVER</Text>
            <View style={styles.coverCard}>
              <Image source={{ uri: cover.uri }} style={styles.coverImage} />
              <View style={styles.coverOverlay}>
                <View style={styles.coverBadgeLarge}>
                  <Star size={11} color={colors.charcoal} strokeWidth={2.5} fill={colors.lime} />
                  <Text style={styles.coverBadgeLargeText}>BEST COVER</Text>
                </View>
              </View>
              <View style={styles.coverInfo}>
                <Text style={styles.coverReason}>{cover.reason}</Text>
              </View>
            </View>

            <View style={styles.sequenceHeader}>
              <Text style={styles.sectionLabel}>SUGGESTED SEQUENCE · {carouselOrder.length} SLIDES</Text>
              <Text style={styles.sequenceHint}>Reorder or remove</Text>
            </View>
          </View>
        }
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push('/select')}
          activeOpacity={0.85}
        >
          <RefreshCw size={16} color={colors.charcoal} strokeWidth={2} />
          <Text style={styles.backBtnText}>Reshuffle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.previewBtn}
          onPress={() => router.push('/preview')}
          activeOpacity={0.9}
        >
          <Text style={styles.previewBtnText}>Preview carousel</Text>
          <ChevronRight size={18} color={colors.lime} strokeWidth={2.5} />
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
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  headerSection: {
    marginBottom: spacing.lg,
  },
  directorNote: {
    backgroundColor: colors.ivoryLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  directorNoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginBottom: spacing.sm,
  },
  directorNoteLabel: {
    ...typography.label,
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoal,
    fontSize: 10,
  },
  directorNoteText: {
    ...typography.callout,
    fontFamily: 'Inter-Regular',
    color: colors.charcoalSoft,
    lineHeight: 23,
    marginBottom: spacing.md,
  },
  disclaimerTag: {
    backgroundColor: colors.ivoryDark,
    borderRadius: radius.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
  },
  disclaimerTagText: {
    ...typography.footnote,
    fontFamily: 'Inter-Regular',
    color: colors.charcoalMuted,
    fontSize: 12,
  },
  sectionLabel: {
    ...typography.label,
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoalLight,
    fontSize: 11,
    marginBottom: spacing.sm,
  },
  coverCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.ivoryDark,
    marginBottom: spacing.xl,
  },
  coverImage: {
    width: '100%',
    height: 340,
    backgroundColor: colors.ivoryDark,
  },
  coverOverlay: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
  },
  coverBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.ivory,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
  },
  coverBadgeLargeText: {
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoal,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  coverInfo: {
    padding: spacing.md,
  },
  coverReason: {
    ...typography.subheadline,
    fontFamily: 'Inter-Regular',
    color: colors.charcoalSoft,
    lineHeight: 22,
  },
  sequenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sequenceHint: {
    ...typography.footnote,
    fontFamily: 'Inter-Regular',
    color: colors.charcoalLight,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  rankNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.ivoryDark,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rankNumberText: {
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoal,
    fontSize: 13,
  },
  rankThumb: {
    width: 54,
    height: 54,
    borderRadius: radius.sm,
    backgroundColor: colors.ivoryDark,
    flexShrink: 0,
  },
  rankInfo: {
    flex: 1,
    gap: 3,
  },
  rankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  coverBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.lime,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: 4,
  },
  coverBadgeText: {
    fontSize: 9,
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoal,
    letterSpacing: 0.5,
  },
  rankLabel: {
    ...typography.footnote,
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoal,
  },
  rankReason: {
    ...typography.caption,
    fontFamily: 'Inter-Regular',
    color: colors.charcoalMuted,
  },
  rankControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexShrink: 0,
  },
  controlBtn: {
    width: 30,
    height: 30,
    borderRadius: radius.xs,
    backgroundColor: colors.ivoryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnDisabled: {
    opacity: 0.35,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.ivoryLight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  backBtnText: {
    ...typography.headline,
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoal,
  },
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.charcoal,
    paddingVertical: spacing.md,
    flex: 1,
    borderRadius: radius.lg,
  },
  previewBtnText: {
    ...typography.headline,
    fontFamily: 'Inter-SemiBold',
    color: colors.ivory,
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
