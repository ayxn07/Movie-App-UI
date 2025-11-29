import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useTheme } from "@/context";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
];

// Language Item Component
const LanguageItem = ({
  language,
  isSelected,
  onSelect,
  index,
}: {
  language: Language;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInRight.delay(index * 50).springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onSelect();
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 16,
          paddingHorizontal: 20,
          backgroundColor: isSelected
            ? isDark ? `${theme.primary}20` : `${theme.primary}10`
            : "transparent",
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}
      >
        <Text style={{ fontSize: 32, marginRight: 16 }}>{language.flag}</Text>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: isSelected ? theme.primary : theme.text,
              fontSize: 16,
              fontWeight: isSelected ? "700" : "600",
            }}
          >
            {language.name}
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
            {language.nativeName}
          </Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function LanguageScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleSelectLanguage = (code: string) => {
    setSelectedLanguage(code);
    // In a real app, you would save this to storage/context
  };

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
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 20,
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
            <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>Language</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
              Select your preferred language
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Languages List */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            marginHorizontal: 20,
            borderRadius: 20,
            overflow: "hidden",
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}
        >
          {LANGUAGES.map((language, index) => (
            <LanguageItem
              key={language.code}
              language={language}
              isSelected={selectedLanguage === language.code}
              onSelect={() => handleSelectLanguage(language.code)}
              index={index}
            />
          ))}
        </Animated.View>

        {/* Info Section */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={{
            marginHorizontal: 20,
            marginTop: 20,
            padding: 16,
            borderRadius: 16,
            backgroundColor: isDark ? "rgba(139, 92, 246, 0.1)" : "rgba(139, 92, 246, 0.05)",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="information-circle" size={24} color={theme.primary} />
          <Text
            style={{
              flex: 1,
              marginLeft: 12,
              color: theme.textSecondary,
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            Changing the language will update the app interface. Content availability may vary by region.
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Save Button */}
      <Animated.View
        entering={FadeInDown.delay(300).springify()}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 20,
          paddingBottom: 36,
          backgroundColor: isDark ? "rgba(2, 6, 23, 0.95)" : "rgba(255, 255, 255, 0.95)",
          borderTopWidth: 1,
          borderTopColor: theme.border,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.back();
          }}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={{
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Save Changes</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
