import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useTheme } from "@/context";

// Link Item Component
const LinkItem = ({
  icon,
  title,
  url,
  delay,
}: {
  icon: string;
  title: string;
  url?: string;
  delay: number;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInUp.delay(delay).springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          if (url) {
            Linking.openURL(url);
          }
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.1)",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={20} color={theme.primary} />
        </View>
        <Text style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: "500" }}>{title}</Text>
        <Ionicons name="open-outline" size={18} color={theme.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function AboutScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background Gradient */}
      <LinearGradient
        colors={isDark ? ["#1e1b4b", "#0f172a", "#020617"] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Header */}
      <Animated.View
        entering={FadeInDown.springify()}
        style={{
          paddingTop: 56,
          paddingHorizontal: 20,
          paddingBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>About</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
              Learn more about MoviesHub
            </Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}
      >
        {/* App Info Card */}
        <Animated.View
          entering={FadeIn.delay(100)}
          style={{
            alignItems: "center",
            paddingVertical: 40,
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 24,
            marginBottom: 24,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}
        >
          {/* App Logo */}
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
              overflow: "hidden",
            }}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="film" size={48} color="white" />
            </LinearGradient>
          </View>
          
          <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900", marginBottom: 4 }}>
            MoviesHub
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 14, marginBottom: 20 }}>
            Version 1.0.0
          </Text>
          
          {/* Tagline */}
          <Text style={{ color: theme.textSecondary, fontSize: 14, textAlign: "center", paddingHorizontal: 30 }}>
            Your ultimate destination for movies, series, and entertainment. Stream anywhere, anytime.
          </Text>
        </Animated.View>

        {/* Stats */}
        <Animated.View
          entering={FadeIn.delay(200)}
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 24,
          }}
        >
          {[
            { label: "Movies", value: "10K+" },
            { label: "Series", value: "5K+" },
            { label: "Users", value: "50M+" },
          ].map((stat, index) => (
            <View key={stat.label} style={{ alignItems: "center" }}>
              <Text style={{ color: theme.primary, fontSize: 24, fontWeight: "900" }}>{stat.value}</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Links Section */}
        <Animated.View entering={FadeIn.delay(300)}>
          <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "600", marginBottom: 12 }}>
            LEGAL & INFORMATION
          </Text>
          <View
            style={{
              borderRadius: 20,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              paddingHorizontal: 16,
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}
          >
            <LinkItem icon="document-text" title="Terms of Service" url="https://example.com/terms" delay={350} />
            <LinkItem icon="shield-checkmark" title="Privacy Policy" url="https://example.com/privacy" delay={400} />
            <LinkItem icon="information-circle" title="Licenses" url="https://example.com/licenses" delay={450} />
            <LinkItem icon="document" title="Content Guidelines" url="https://example.com/guidelines" delay={500} />
          </View>
        </Animated.View>

        {/* Social Links */}
        <Animated.View entering={FadeIn.delay(400)}>
          <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "600", marginBottom: 12, marginTop: 24 }}>
            FOLLOW US
          </Text>
          <View
            style={{
              borderRadius: 20,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              paddingHorizontal: 16,
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}
          >
            <LinkItem icon="logo-twitter" title="Twitter" url="https://twitter.com" delay={550} />
            <LinkItem icon="logo-instagram" title="Instagram" url="https://instagram.com" delay={600} />
            <LinkItem icon="logo-facebook" title="Facebook" url="https://facebook.com" delay={650} />
            <LinkItem icon="logo-youtube" title="YouTube" url="https://youtube.com" delay={700} />
          </View>
        </Animated.View>

        {/* Credits */}
        <Animated.View entering={FadeInUp.delay(500).springify()}>
          <View style={{ alignItems: "center", marginTop: 32 }}>
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>
              Made with ❤️ by MoviesHub Team
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 8 }}>
              © 2024 MoviesHub. All rights reserved.
            </Text>
          </View>
        </Animated.View>

        {/* Rate App */}
        <Animated.View entering={FadeInUp.delay(600).springify()}>
          <TouchableOpacity
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            style={{
              marginTop: 24,
              padding: 20,
              borderRadius: 20,
              backgroundColor: isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.1)",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons key={star} name="star" size={24} color={Colors.star} style={{ marginHorizontal: 2 }} />
              ))}
            </View>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: "700" }}>
              Enjoying MoviesHub?
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>
              Rate us on the App Store
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
