import { useLocalSearchParams, Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography, spacing } from '@/constants/theme';

export default function NotFoundScreen() {
  const { name } = useLocalSearchParams<{ name?: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>This screen doesn't exist{name ? `: ${name}` : ''}.</Text>
      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>Go to home screen</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.ivory,
  },
  text: {
    ...typography.headline,
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoal,
  },
  link: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  linkText: {
    ...typography.body,
    fontFamily: 'Inter-SemiBold',
    color: colors.charcoal,
  },
});
