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
import Animated, { FadeIn, FadeInDown, FadeInRight } from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useTheme } from "@/context";

// Setting Item Component
const SettingItem = ({
  icon,
  title,
  subtitle,
  hasToggle,
  toggleValue,
  onToggle,
  onPress,
  delay = 0,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  delay?: number;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInRight.delay(delay).springify()}>
      <TouchableOpacity
        onPress={() => {
          if (!hasToggle && onPress) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
          }
        }}
        disabled={hasToggle}
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
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 15, fontWeight: "600" }}>{title}</Text>
          {subtitle && (
            <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>{subtitle}</Text>
          )}
        </View>
        {hasToggle ? (
          <Switch
            value={toggleValue}
            onValueChange={(value) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onToggle?.(value);
            }}
            trackColor={{ false: theme.backgroundTertiary, true: theme.primary }}
            thumbColor="white"
          />
        ) : (
          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function PrivacyScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  // Privacy settings state
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [showActivity, setShowActivity] = useState(false);
  const [personalizedAds, setPersonalizedAds] = useState(true);
  const [dataCollection, setDataCollection] = useState(true);
  const [autoLock, setAutoLock] = useState(false);

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
            <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>Privacy & Security</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
              Manage your account security
            </Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}
      >
        {/* Security Section */}
        <Animated.View entering={FadeIn.delay(100)}>
          <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "600", marginBottom: 12, marginTop: 8 }}>
            SECURITY
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
            <SettingItem
              icon="key"
              title="Two-Factor Authentication"
              subtitle="Add an extra layer of security"
              hasToggle
              toggleValue={twoFactorAuth}
              onToggle={setTwoFactorAuth}
              delay={150}
            />
            <SettingItem
              icon="finger-print"
              title="Biometric Login"
              subtitle="Use Face ID or fingerprint"
              hasToggle
              toggleValue={biometricAuth}
              onToggle={setBiometricAuth}
              delay={200}
            />
            <SettingItem
              icon="lock-closed"
              title="Auto-Lock App"
              subtitle="Lock after 5 minutes of inactivity"
              hasToggle
              toggleValue={autoLock}
              onToggle={setAutoLock}
              delay={250}
            />
            <SettingItem
              icon="key-outline"
              title="Change Password"
              subtitle="Update your account password"
              onPress={() => {}}
              delay={300}
            />
          </View>
        </Animated.View>

        {/* Privacy Section */}
        <Animated.View entering={FadeIn.delay(200)}>
          <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "600", marginBottom: 12, marginTop: 24 }}>
            PRIVACY
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
            <SettingItem
              icon="eye"
              title="Profile Visibility"
              subtitle="Allow others to see your profile"
              hasToggle
              toggleValue={profileVisible}
              onToggle={setProfileVisible}
              delay={350}
            />
            <SettingItem
              icon="time"
              title="Activity Status"
              subtitle="Show when you are online"
              hasToggle
              toggleValue={showActivity}
              onToggle={setShowActivity}
              delay={400}
            />
            <SettingItem
              icon="people"
              title="Blocked Users"
              subtitle="Manage your blocked list"
              onPress={() => {}}
              delay={450}
            />
          </View>
        </Animated.View>

        {/* Data & Analytics Section */}
        <Animated.View entering={FadeIn.delay(300)}>
          <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "600", marginBottom: 12, marginTop: 24 }}>
            DATA & ANALYTICS
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
            <SettingItem
              icon="analytics"
              title="Data Collection"
              subtitle="Help improve our services"
              hasToggle
              toggleValue={dataCollection}
              onToggle={setDataCollection}
              delay={500}
            />
            <SettingItem
              icon="megaphone"
              title="Personalized Ads"
              subtitle="Show relevant advertisements"
              hasToggle
              toggleValue={personalizedAds}
              onToggle={setPersonalizedAds}
              delay={550}
            />
            <SettingItem
              icon="download"
              title="Download My Data"
              subtitle="Request a copy of your data"
              onPress={() => {}}
              delay={600}
            />
            <SettingItem
              icon="trash"
              title="Delete Account"
              subtitle="Permanently delete your account"
              onPress={() => {}}
              delay={650}
            />
          </View>
        </Animated.View>

        {/* Legal Section */}
        <Animated.View entering={FadeIn.delay(400)}>
          <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "600", marginBottom: 12, marginTop: 24 }}>
            LEGAL
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
            <SettingItem
              icon="document-text"
              title="Privacy Policy"
              onPress={() => {}}
              delay={700}
            />
            <SettingItem
              icon="document"
              title="Terms of Service"
              onPress={() => {}}
              delay={750}
            />
            <SettingItem
              icon="shield-checkmark"
              title="Security Guidelines"
              onPress={() => {}}
              delay={800}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
