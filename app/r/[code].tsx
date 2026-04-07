import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { capture } from '@/lib/analytics';

export const PENDING_REFERRAL_KEY = 'pendingReferralCode';

export default function ReferralRedirect() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { session, loading } = useAuth();

  useEffect(() => {
    // Wait until auth state is fully resolved
    if (loading) return;

    if (!code) {
      router.replace('/(tabs)');
      return;
    }

    async function handle() {
      capture('referral_link_opened', { referral_code: code });

      if (session?.user) {
        // Already signed in — attribute immediately, then go home
        try {
          await api.attributeReferral(code as string);
          console.log('[Referral] Attributed immediately for signed-in user');
        } catch (e) {
          // Already attributed, self-referral, or invalid — silent fail
          console.log('[Referral] Attribution skipped:', (e as Error).message);
        }
        router.replace('/(tabs)');
      } else {
        // Not signed in — persist code, send user through auth
        await AsyncStorage.setItem(PENDING_REFERRAL_KEY, code as string);
        router.replace('/(auth)/welcome');
      }
    }

    handle();
  }, [code, loading, session?.user?.id]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator color="#6366F1" />
    </View>
  );
}
