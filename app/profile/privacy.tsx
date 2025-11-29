import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useTheme } from "@/context";

// Setting Toggle Item Component
const SettingToggle = ({
  icon,
  title,
  description,
  value,
  onValueChange,
  index,
}: {
  icon: string;
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  index: number;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInRight.delay(index * 50).springify()}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.1)",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
        >
          <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={22} color={theme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "600" }}>{title}</Text>
          <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
            {description}
          </Text>
        </View>
        <Switch
          value={value}
          onValueChange={(newValue) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onValueChange(newValue);
          }}
          trackColor={{ false: isDark ? "#334155" : "#cbd5e1", true: theme.primary }}
          thumbColor="white"
        />
      </View>
    </Animated.View>
  );
};

// Action Button Component
const ActionButton = ({
  icon,
  title,
  description,
  onPress,
  danger = false,
  index,
}: {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
  danger?: boolean;
  index: number;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInRight.delay(index * 50).springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: danger
              ? "rgba(239, 68, 68, 0.15)"
              : isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.1)",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
        >
          <Ionicons
            name={icon as keyof typeof Ionicons.glyphMap}
            size={22}
            color={danger ? Colors.danger : theme.primary}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: danger ? Colors.danger : theme.text,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {title}
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
            {description}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function PrivacyScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [biometricLogin, setBiometricLogin] = useState(true);
  const [saveLoginInfo, setSaveLoginInfo] = useState(true);
  const [watchHistory, setWatchHistory] = useState(true);
  const [searchHistory, setSearchHistory] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);
  const [activityStatus, setActivityStatus] = useState(true);

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
            <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>
              Privacy & Security
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
              Manage your account security
            </Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Security Section */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={{ marginBottom: 24 }}>
          <Text
            style={{
              color: theme.textSecondary,
              fontSize: 12,
              fontWeight: "700",
              textTransform: "uppercase",
              marginHorizontal: 20,
              marginBottom: 12,
            }}
          >
            Security
          </Text>
          <View
            style={{
              marginHorizontal: 20,
              borderRadius: 20,
              overflow: "hidden",
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}
          >
            <SettingToggle
              icon="shield-checkmark"
              title="Two-Factor Authentication"
              description="Add an extra layer of security"
              value={twoFactorAuth}
              onValueChange={setTwoFactorAuth}
              index={0}
            />
            <SettingToggle
              icon="finger-print"
              title="Biometric Login"
              description="Use Face ID or fingerprint"
              value={biometricLogin}
              onValueChange={setBiometricLogin}
              index={1}
            />
            <SettingToggle
              icon="key"
              title="Save Login Info"
              description="Stay logged in on this device"
              value={saveLoginInfo}
              onValueChange={setSaveLoginInfo}
              index={2}
            />
          </View>
        </Animated.View>

        {/* Privacy Section */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={{ marginBottom: 24 }}>
          <Text
            style={{
              color: theme.textSecondary,
              fontSize: 12,
              fontWeight: "700",
              textTransform: "uppercase",
              marginHorizontal: 20,
              marginBottom: 12,
            }}
          >
            Privacy
          </Text>
          <View
            style={{
              marginHorizontal: 20,
              borderRadius: 20,
              overflow: "hidden",
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}
          >
            <SettingToggle
              icon="eye"
              title="Watch History"
              description="Save your watch history"
              value={watchHistory}
              onValueChange={setWatchHistory}
              index={0}
            />
            <SettingToggle
              icon="search"
              title="Search History"
              description="Save your search queries"
              value={searchHistory}
              onValueChange={setSearchHistory}
              index={1}
            />
            <SettingToggle
              icon="megaphone"
              title="Personalized Ads"
              description="Show ads based on your interests"
              value={personalizedAds}
              onValueChange={setPersonalizedAds}
              index={2}
            />
            <SettingToggle
              icon="share-social"
              title="Data Sharing"
              description="Share data with partners"
              value={dataSharing}
              onValueChange={setDataSharing}
              index={3}
            />
            <SettingToggle
              icon="radio"
              title="Activity Status"
              description="Show when you are online"
              value={activityStatus}
              onValueChange={setActivityStatus}
              index={4}
            />
          </View>
        </Animated.View>

        {/* Account Actions */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={{ marginBottom: 24 }}>
          <Text
            style={{
              color: theme.textSecondary,
              fontSize: 12,
              fontWeight: "700",
              textTransform: "uppercase",
              marginHorizontal: 20,
              marginBottom: 12,
            }}
          >
            Account
          </Text>
          <View
            style={{
              marginHorizontal: 20,
              borderRadius: 20,
              overflow: "hidden",
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}
          >
            <ActionButton
              icon="lock-closed"
              title="Change Password"
              description="Update your account password"
              onPress={() => {}}
              index={0}
            />
            <ActionButton
              icon="mail"
              title="Change Email"
              description="Update your email address"
              onPress={() => {}}
              index={1}
            />
            <ActionButton
              icon="download"
              title="Download My Data"
              description="Get a copy of your data"
              onPress={() => {}}
              index={2}
            />
            <ActionButton
              icon="trash"
              title="Delete Account"
              description="Permanently delete your account"
              onPress={() => {}}
              danger
              index={3}
            />
          </View>
        </Animated.View>

        {/* Legal Links */}
        <Animated.View entering={FadeInDown.delay(400).springify()} style={{ marginBottom: 24 }}>
          <Text
            style={{
              color: theme.textSecondary,
              fontSize: 12,
              fontWeight: "700",
              textTransform: "uppercase",
              marginHorizontal: 20,
              marginBottom: 12,
            }}
          >
            Legal
          </Text>
          <View
            style={{
              marginHorizontal: 20,
              borderRadius: 20,
              overflow: "hidden",
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}
          >
            <ActionButton
              icon="document-text"
              title="Privacy Policy"
              description="Read our privacy policy"
              onPress={() => {}}
              index={0}
            />
            <ActionButton
              icon="document"
              title="Terms of Service"
              description="Read our terms of service"
              onPress={() => {}}
              index={1}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
