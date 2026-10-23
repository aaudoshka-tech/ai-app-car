import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { ImagePlus, X, ArrowRight, ChevronLeft, Sparkles } from 'lucide-react-native';
import { colors, typography, spacing, radius } from '@/constants/theme';
import { useCarousel } from '@/context/CarouselContext';
import { SelectedPhoto } from '@/types/photo';
import { analyzePhotos } from '@/utils/analyze';

const COLUMNS = 3;

export default function SelectScreen() {
  const { photos, setPhotos, removePhoto, setRankedPhotos, setCarouselOrder, isAnalyzing, setIsAnalyzing } =
    useCarousel();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useFocusEffect(
    useCallback(() => {
      ImagePicker.requestMediaLibraryPermissionsAsync().then((result) => {
        setHasPermission(result.granted);
      });
    }, [])
  );

  const pickPhotos = async () => {
    if (hasPermission === null) return;

    if (!hasPermission) {
      Alert.alert(
        'Photo Access Needed',
        'Please allow Carousel to access your photo library in Settings.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.9,
      orderedSelection: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) return;

    const newPhotos: SelectedPhoto[] = result.assets.map((asset, index) => ({
      id: `${asset.uri}-${Date.now()}-${index}`,
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
    }));

    setPhotos([...photos, ...newPhotos]);
  };

  const handleAnalyze = async () => {
    if (photos.length < 2) {
      Alert.alert('Add More Photos', 'Select at least 2 photos for analysis.');
      return;
    }

    setIsAnalyzing(true);
    router.push('/analyzing');
    try {
      const ranked = await analyzePhotos(photos);
      setRankedPhotos(ranked);
      setCarouselOrder(ranked);
    } catch {
      Alert.alert('Analysis Error', 'Something went wrong during analysis. Please try again.');
      router.back();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderPhoto = ({ item, index }: { item: SelectedPhoto; index: number }) => (
    <View style={styles.thumbWrap}>
      <Image source={{ uri: item.uri }} style={styles.thumbnail} />
      <View style={styles.thumbNumber}>
        <Text style={styles.thumbNumberText}>{index + 1}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => removePhoto(item.id)}
        activeOpacity={0.7}
      >
        <X size={12} color={colors.white} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.7}>
          <ChevronLeft size={22} color={colors.charcoal} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Select Photos</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.body}>
        {photos.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <ImagePlus size={36} color={colors.charcoalLight} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>No photos selected</Text>
            <Text style={styles.emptyDesc}>
              Tap below to choose photos from your library. You can select up to 10 at once.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionCount}>
                {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
              </Text>
              <TouchableOpacity onPress={pickPhotos} activeOpacity={0.7}>
                <Text style={styles.addMoreText}>Add more</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={photos}
              keyExtractor={(item) => item.id}
              renderItem={renderPhoto}
              numColumns={COLUMNS}
              contentContainerStyle={styles.grid}
              scrollEnabled={false}
            />
          </>
        )}
      </View>

      <View style={styles.footer}>
        {photos.length === 0 ? (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={pickPhotos}
            activeOpacity={0.9}
          >
            <ImagePlus size={20} color={colors.charcoal} strokeWidth={2} />
            <Text style={styles.primaryBtnText}>Choose from library</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={pickPhotos}
              activeOpacity={0.85}
            >
              <ImagePlus size={18} color={colors.charcoal} strokeWidth={2} />
              <Text style={styles.secondaryBtnText}>Add more</Text>
            </TouchableOpacity>
            {photos.length >= 2 && (
              <TouchableOpacity
                style={styles.analyzeBtn}
                onPress={handleAnalyze}
                activeOpacity={0.9}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <ActivityIndicator color={colors.ivory} size="small" />
                ) : (
                  <>
                    <Sparkles size={18} color={colors.lime} strokeWidth={2} />
                    <Text style={styles.analyzeBtnText}>Analyze my photos</Text>
                    <ArrowRight size={18} color={colors.lime} strokeWidth={2} />
                  </>
                )}
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const THUMB_SIZE = 108;

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
    ...typography.headline,
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoal,
  },
  body: {
    flex: 1,
    padding: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    backgroundColor: colors.ivoryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontFamily: 'Playfair-SemiBold',
    fontSize: 22,
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  emptyDesc: {
    ...typography.subheadline,
    fontFamily: 'Inter-Regular',
    color: colors.charcoalMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionCount: {
    ...typography.label,
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoal,
    fontSize: 13,
  },
  addMoreText: {
    ...typography.subheadline,
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoal,
  },
  grid: {
    gap: spacing.sm + 2,
  },
  thumbWrap: {
    position: 'relative',
    marginRight: spacing.sm + 2,
    marginBottom: spacing.sm + 2,
  },
  thumbnail: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.md,
    backgroundColor: colors.ivoryDark,
  },
  thumbNumber: {
    position: 'absolute',
    bottom: spacing.xs + 2,
    left: spacing.xs + 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(26,26,24,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbNumberText: {
    fontFamily: 'Inter-SemiBold',
    color: colors.ivory,
    fontSize: 11,
  },
  removeBtn: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.ivory,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.charcoal,
    paddingVertical: spacing.md + 3,
    borderRadius: radius.lg,
  },
  primaryBtnText: {
    ...typography.title3,
    fontFamily: 'Inter-SemiBold',
    color: colors.lime,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.ivoryLight,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  secondaryBtnText: {
    ...typography.headline,
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoal,
  },
  analyzeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.charcoal,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.lg,
  },
  analyzeBtnText: {
    ...typography.headline,
    fontFamily: 'Inter-SemiBold',
    color: colors.ivory,
  },
});
