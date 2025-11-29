import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
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
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

import { useTheme } from "@/context";

const APP_INFO = {
  version: "1.0.0",
  buildNumber: "2024.11.29",
  platform: "React Native / Expo",
};

const TEAM_MEMBERS = [
  { name: "Sarah Chen", role: "Lead Developer", avatar: "https://randomuser.me/api/portraits/women/45.jpg" },
  { name: "Mike Johnson", role: "UI/UX Designer", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Emily Davis", role: "Backend Engineer", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
  { name: "Alex Thompson", role: "Product Manager", avatar: "https://randomuser.me/api/portraits/men/46.jpg" },
];

const SOCIAL_LINKS = [
  { id: "twitter", icon: "logo-twitter", label: "Twitter", url: "https://twitter.com", color: "#1DA1F2" },
  { id: "instagram", icon: "logo-instagram", label: "Instagram", url: "https://instagram.com", color: "#E1306C" },
  { id: "facebook", icon: "logo-facebook", label: "Facebook", url: "https://facebook.com", color: "#1877F2" },
  { id: "youtube", icon: "logo-youtube", label: "YouTube", url: "https://youtube.com", color: "#FF0000" },
];

const LEGAL_LINKS = [
  { id: "terms", title: "Terms of Service", icon: "document-text" },
  { id: "privacy", title: "Privacy Policy", icon: "shield-checkmark" },
  { id: "licenses", title: "Open Source Licenses", icon: "code-slash" },
  { id: "cookies", title: "Cookie Policy", icon: "ellipse-outline" },
];

export default function AboutScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const handleSocialLink = (url: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(url);
  };

  const handleLegalLink = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <LinearGradient
        colors={isDark ? ["#1e1b4b", "#0f172a", "#020617"] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Header */}
      <Animated.View
        entering={FadeInDown.springify()}
        style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
              alignItems: "center", justifyContent: "center", marginRight: 16,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>About</Text>
        </View>
      </Animated.View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* App Logo & Info */}
        <Animated.View
          entering={FadeIn.delay(100)}
          style={{ alignItems: "center", marginBottom: 32 }}
        >
          <View style={{
            width: 100, height: 100, borderRadius: 24,
            backgroundColor: theme.primary,
            alignItems: "center", justifyContent: "center",
            marginBottom: 16,
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 8,
          }}>
            <Ionicons name="film" size={48} color="white" />
          </View>
          <Text style={{ color: theme.text, fontSize: 24, fontWeight: "900", marginBottom: 4 }}>
            MoviesHub
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
            Your Ultimate Movie Experience
          </Text>
          <View style={{
            marginTop: 16,
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 12,
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}>
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>
              Version {APP_INFO.version} ({APP_INFO.buildNumber})
            </Text>
          </View>
        </Animated.View>

        {/* App Description */}
        <Animated.View entering={FadeIn.delay(200)} style={{ marginBottom: 32 }}>
          <View style={{
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 20,
            padding: 20,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}>
            <Text style={{ color: theme.text, fontSize: 16, lineHeight: 26 }}>
              MoviesHub is your go-to destination for discovering, watching, and sharing movies and TV shows. 
              With our curated collections, personalized recommendations, and seamless streaming experience, 
              we bring the magic of cinema right to your fingertips.
            </Text>
          </View>
        </Animated.View>

        {/* Features */}
        <Animated.View entering={FadeIn.delay(300)} style={{ marginBottom: 32 }}>
          <Text style={{ color: theme.textSecondary, fontWeight: "600", fontSize: 14, marginBottom: 12 }}>
            Features
          </Text>
          <View style={{
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 20,
            padding: 20,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}>
            {[
              { icon: "film", title: "Vast Library", desc: "Thousands of movies & shows" },
              { icon: "download", title: "Offline Mode", desc: "Download for offline viewing" },
              { icon: "people", title: "Social Features", desc: "Share with friends" },
              { icon: "sparkles", title: "4K Streaming", desc: "Crystal clear quality" },
            ].map((feature, index) => (
              <View
                key={feature.title}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  borderBottomWidth: index < 3 ? 1 : 0,
                  borderBottomColor: theme.border,
                }}
              >
                <View style={{
                  width: 44, height: 44, borderRadius: 12,
                  backgroundColor: `${theme.primary}15`,
                  alignItems: "center", justifyContent: "center", marginRight: 14,
                }}>
                  <Ionicons name={feature.icon as keyof typeof Ionicons.glyphMap} size={22} color={theme.primary} />
                </View>
                <View>
                  <Text style={{ color: theme.text, fontWeight: "600", fontSize: 15 }}>{feature.title}</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 13 }}>{feature.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Team */}
        <Animated.View entering={FadeInUp.delay(400)} style={{ marginBottom: 32 }}>
          <Text style={{ color: theme.textSecondary, fontWeight: "600", fontSize: 14, marginBottom: 12 }}>
            Meet the Team
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {TEAM_MEMBERS.map((member, index) => (
              <Animated.View
                key={member.name}
                entering={FadeInUp.delay(400 + index * 100)}
                style={{
                  backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                  borderRadius: 20,
                  padding: 16,
                  marginRight: 12,
                  alignItems: "center",
                  width: 140,
                  borderWidth: isDark ? 0 : 1,
                  borderColor: theme.border,
                }}
              >
                <Image
                  source={{ uri: member.avatar }}
                  style={{ width: 64, height: 64, borderRadius: 32, marginBottom: 12 }}
                  contentFit="cover"
                />
                <Text style={{ color: theme.text, fontWeight: "600", fontSize: 14, textAlign: "center" }}>
                  {member.name}
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 12, textAlign: "center", marginTop: 4 }}>
                  {member.role}
                </Text>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Social Links */}
        <Animated.View entering={FadeIn.delay(500)} style={{ marginBottom: 32 }}>
          <Text style={{ color: theme.textSecondary, fontWeight: "600", fontSize: 14, marginBottom: 12 }}>
            Follow Us
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            {SOCIAL_LINKS.map((social) => (
              <TouchableOpacity
                key={social.id}
                onPress={() => handleSocialLink(social.url)}
                style={{
                  width: 60, height: 60, borderRadius: 16,
                  backgroundColor: `${social.color}20`,
                  alignItems: "center", justifyContent: "center",
                }}
              >
                <Ionicons name={social.icon as keyof typeof Ionicons.glyphMap} size={28} color={social.color} />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Legal Links */}
        <Animated.View entering={FadeIn.delay(600)}>
          <Text style={{ color: theme.textSecondary, fontWeight: "600", fontSize: 14, marginBottom: 12 }}>
            Legal
          </Text>
          <View style={{
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 20,
            overflow: "hidden",
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}>
            {LEGAL_LINKS.map((link, index) => (
              <TouchableOpacity
                key={link.id}
                onPress={() => handleLegalLink(link.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  borderBottomWidth: index < LEGAL_LINKS.length - 1 ? 1 : 0,
                  borderBottomColor: theme.border,
                }}
              >
                <Ionicons name={link.icon as keyof typeof Ionicons.glyphMap} size={20} color={theme.textMuted} />
                <Text style={{ flex: 1, marginLeft: 12, color: theme.text, fontSize: 15 }}>
                  {link.title}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Footer */}
        <Animated.View entering={FadeIn.delay(700)} style={{ alignItems: "center", marginTop: 32 }}>
          <Text style={{ color: theme.textMuted, fontSize: 12, textAlign: "center" }}>
            Made with ❤️ by the MoviesHub Team
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 4 }}>
            © 2024 MoviesHub. All rights reserved.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
