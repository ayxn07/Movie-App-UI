import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useApp, useTheme } from "@/context";

interface PrivacySetting {
  id: string;
  icon: string;
  title: string;
  description: string;
  hasToggle: boolean;
}

const PRIVACY_SETTINGS: PrivacySetting[] = [
  {
    id: "watch_history",
    icon: "time",
    title: "Watch History",
    description: "Keep track of movies and shows you watch",
    hasToggle: true,
  },
  {
    id: "personalized_ads",
    icon: "megaphone",
    title: "Personalized Ads",
    description: "Allow personalized advertisements based on your activity",
    hasToggle: true,
  },
  {
    id: "profile_visibility",
    icon: "eye",
    title: "Profile Visibility",
    description: "Let others see your profile and activity",
    hasToggle: true,
  },
  {
    id: "data_collection",
    icon: "analytics",
    title: "Usage Analytics",
    description: "Help us improve by sharing anonymous usage data",
    hasToggle: true,
  },
];

const SECURITY_OPTIONS = [
  {
    id: "change_password",
    icon: "key",
    title: "Change Password",
    description: "Update your account password",
  },
  {
    id: "two_factor",
    icon: "shield-checkmark",
    title: "Two-Factor Authentication",
    description: "Add an extra layer of security",
  },
  {
    id: "active_sessions",
    icon: "laptop",
    title: "Active Sessions",
    description: "Manage devices logged into your account",
  },
  {
    id: "download_data",
    icon: "download",
    title: "Download Your Data",
    description: "Get a copy of your personal data",
  },
  {
    id: "delete_account",
    icon: "trash",
    title: "Delete Account",
    description: "Permanently delete your account and data",
    danger: true,
  },
];

export default function PrivacyScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { showToast } = useApp();
  const [privacySettings, setPrivacySettings] = useState({
    watch_history: true,
    personalized_ads: false,
    profile_visibility: true,
    data_collection: true,
  });

  const toggleSetting = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPrivacySettings(prev => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev],
    }));
  };

  const handleSecurityOption = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (id === "delete_account") {
      showToast("Account deletion requires email confirmation", "info");
    } else {
      showToast("This feature is coming soon!", "info");
    }
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
            <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>Privacy & Security</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
              Manage your privacy settings
            </Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Privacy Settings */}
        <Animated.View entering={FadeIn.delay(200)}>
          <Text style={{ color: theme.textSecondary, fontWeight: "600", fontSize: 14, marginBottom: 12 }}>
            Privacy
          </Text>
          <View style={{
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 20,
            overflow: "hidden",
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}>
            {PRIVACY_SETTINGS.map((setting, index) => (
              <Animated.View
                key={setting.id}
                entering={FadeInRight.delay(index * 50)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 16,
                    borderBottomWidth: index < PRIVACY_SETTINGS.length - 1 ? 1 : 0,
                    borderBottomColor: theme.border,
                  }}
                >
                  <View style={{
                    width: 44, height: 44, borderRadius: 12,
                    backgroundColor: `${theme.primary}15`,
                    alignItems: "center", justifyContent: "center", marginRight: 14,
                  }}>
                    <Ionicons name={setting.icon as keyof typeof Ionicons.glyphMap} size={22} color={theme.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontWeight: "600", fontSize: 15 }}>
                      {setting.title}
                    </Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                      {setting.description}
                    </Text>
                  </View>
                  <Switch
                    value={privacySettings[setting.id as keyof typeof privacySettings]}
                    onValueChange={() => toggleSetting(setting.id)}
                    trackColor={{ false: theme.border, true: theme.primary }}
                    thumbColor="white"
                  />
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Security Options */}
        <Animated.View entering={FadeIn.delay(400)} style={{ marginTop: 24 }}>
          <Text style={{ color: theme.textSecondary, fontWeight: "600", fontSize: 14, marginBottom: 12 }}>
            Security
          </Text>
          <View style={{
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 20,
            overflow: "hidden",
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}>
            {SECURITY_OPTIONS.map((option, index) => (
              <Animated.View
                key={option.id}
                entering={FadeInRight.delay(200 + index * 50)}
              >
                <TouchableOpacity
                  onPress={() => handleSecurityOption(option.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 16,
                    borderBottomWidth: index < SECURITY_OPTIONS.length - 1 ? 1 : 0,
                    borderBottomColor: theme.border,
                  }}
                >
                  <View style={{
                    width: 44, height: 44, borderRadius: 12,
                    backgroundColor: option.danger ? `${Colors.danger}15` : `${theme.primary}15`,
                    alignItems: "center", justifyContent: "center", marginRight: 14,
                  }}>
                    <Ionicons
                      name={option.icon as keyof typeof Ionicons.glyphMap}
                      size={22}
                      color={option.danger ? Colors.danger : theme.primary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      color: option.danger ? Colors.danger : theme.text,
                      fontWeight: "600",
                      fontSize: 15,
                    }}>
                      {option.title}
                    </Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                      {option.description}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Last Updated */}
        <Animated.View entering={FadeIn.delay(600)} style={{ marginTop: 24, alignItems: "center" }}>
          <Text style={{ color: theme.textMuted, fontSize: 12 }}>
            Privacy Policy last updated: November 2024
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
