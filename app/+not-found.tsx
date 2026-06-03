import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';

import { Theme, Spacing, Radius } from '@/constants/Colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={styles.container}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>This screen doesn’t exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Return to dashboard</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.bg,
    padding: Spacing.xl,
  },
  code: { fontSize: 56, fontWeight: '800', color: Theme.textTertiary, letterSpacing: -2 },
  title: { fontSize: 16, color: Theme.textSecondary, marginTop: Spacing.sm },
  link: {
    marginTop: Spacing.xl,
    backgroundColor: Theme.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: Radius.md,
  },
  linkText: { fontSize: 14, color: Theme.bg, fontWeight: '700' },
});
