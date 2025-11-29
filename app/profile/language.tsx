import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
} from "react-native-reanimated";

import { useApp, useTheme } from "@/context";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸", native: "English" },
  { code: "es", name: "Spanish", flag: "🇪🇸", native: "Español" },
  { code: "fr", name: "French", flag: "🇫🇷", native: "Français" },
  { code: "de", name: "German", flag: "🇩🇪", native: "Deutsch" },
  { code: "it", name: "Italian", flag: "🇮🇹", native: "Italiano" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹", native: "Português" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", native: "日本語" },
  { code: "ko", name: "Korean", flag: "🇰🇷", native: "한국어" },
  { code: "zh", name: "Chinese", flag: "🇨🇳", native: "中文" },
  { code: "hi", name: "Hindi", flag: "🇮🇳", native: "हिन्दी" },
  { code: "ar", name: "Arabic", flag: "🇸🇦", native: "العربية" },
  { code: "ru", name: "Russian", flag: "🇷🇺", native: "Русский" },
];

export default function LanguageScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { showToast } = useApp();
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleLanguageSelect = (code: string, name: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedLanguage(code);
    showToast(`Language changed to ${name}`, "success");
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
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
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
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>Language</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
              Choose your preferred language
            </Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* App Language */}
        <Animated.View entering={FadeIn.delay(200)}>
          <Text style={{ color: theme.textSecondary, fontWeight: "600", fontSize: 14, marginBottom: 12 }}>
            App Language
          </Text>
          <View style={{
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 20,
            overflow: "hidden",
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}>
            {LANGUAGES.map((lang, index) => (
              <Animated.View
                key={lang.code}
                entering={FadeInRight.delay(index * 50)}
              >
                <TouchableOpacity
                  onPress={() => handleLanguageSelect(lang.code, lang.name)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 16,
                    borderBottomWidth: index < LANGUAGES.length - 1 ? 1 : 0,
                    borderBottomColor: theme.border,
                    backgroundColor: selectedLanguage === lang.code
                      ? `${theme.primary}15`
                      : "transparent",
                  }}
                >
                  <Text style={{ fontSize: 28, marginRight: 16 }}>{lang.flag}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontWeight: "600", fontSize: 16 }}>
                      {lang.name}
                    </Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                      {lang.native}
                    </Text>
                  </View>
                  {selectedLanguage === lang.code && (
                    <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Content Language Note */}
        <Animated.View entering={FadeIn.delay(400)} style={{ marginTop: 24 }}>
          <View style={{
            backgroundColor: `${theme.primary}15`,
            borderRadius: 16,
            padding: 16,
            flexDirection: "row",
            alignItems: "flex-start",
          }}>
            <Ionicons name="information-circle" size={24} color={theme.primary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: theme.text, fontWeight: "600", marginBottom: 4 }}>
                Content Languages
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 20 }}>
                Audio and subtitle preferences can be set separately for each movie in the playback settings.
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
