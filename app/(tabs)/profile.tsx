import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInRight } from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { ThemeColors, ThemeToggle, useTheme } from "@/context";

// Profile Stats
const ProfileStats = ({ theme }: { theme: ThemeColors }) => (
  <Animated.View
    entering={FadeInDown.delay(200).springify()}
    className="flex-row justify-around rounded-3xl p-5 mx-5 mb-6"
    style={{ backgroundColor: theme.card }}
  >
    {[
      { label: "Watched", value: "142", icon: "eye" },
      { label: "Hours", value: "287", icon: "time" },
      { label: "Lists", value: "8", icon: "list" },
    ].map((stat, index) => (
      <Animated.View
        key={stat.label}
        entering={FadeIn.delay(300 + index * 100)}
        className="items-center"
      >
        <View className="w-12 h-12 rounded-full bg-violet-600/20 items-center justify-center mb-2">
          <Ionicons name={stat.icon as any} size={22} color={theme.primary} />
        </View>
        <Text className="text-xl font-black" style={{ color: theme.text }}>{stat.value}</Text>
        <Text className="text-xs mt-1" style={{ color: theme.textSecondary }}>{stat.label}</Text>
      </Animated.View>
    ))}
  </Animated.View>
);

// Settings Item
const SettingsItem = ({
  icon,
  label,
  value,
  hasToggle,
  toggleValue,
  onToggle,
  delay = 0,
  theme,
  customRight,
}: {
  icon: string;
  label: string;
  value?: string;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  delay?: number;
  theme: ThemeColors;
  customRight?: React.ReactNode;
}) => (
  <Animated.View entering={FadeInRight.delay(delay).springify()}>
    <TouchableOpacity
      className="flex-row items-center justify-between py-4"
      style={{ borderBottomWidth: 1, borderBottomColor: theme.border }}
      disabled={hasToggle || !!customRight}
    >
      <View className="flex-row items-center gap-4">
        <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: theme.backgroundTertiary }}>
          <Ionicons name={icon as any} size={20} color={theme.primary} />
        </View>
        <Text className="font-semibold text-base" style={{ color: theme.text }}>{label}</Text>
      </View>
      {customRight ? (
        customRight
      ) : hasToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: theme.backgroundTertiary, true: theme.primary }}
          thumbColor="white"
        />
      ) : (
        <View className="flex-row items-center gap-2">
          {value && <Text className="text-sm" style={{ color: theme.textSecondary }}>{value}</Text>}
          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </View>
      )}
    </TouchableOpacity>
  </Animated.View>
);

// Subscription Banner
const SubscriptionBanner = () => (
  <Animated.View entering={FadeInDown.delay(400).springify()} className="mx-5 mb-6">
    <TouchableOpacity activeOpacity={0.9}>
      <LinearGradient
        colors={["#7c3aed", "#4f46e5", "#2563eb"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl p-5"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-2">
              <Ionicons name="diamond" size={20} color="#fbbf24" />
              <Text className="text-yellow-400 font-bold text-sm">PREMIUM</Text>
            </View>
            <Text className="text-white text-xl font-black mb-1">
              Upgrade to Premium
            </Text>
            <Text className="text-violet-200 text-sm">
              Get unlimited access to all movies and exclusive content
            </Text>
          </View>
          <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
            <Ionicons name="arrow-forward" size={24} color="white" />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  </Animated.View>
);

export default function ProfileScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [notifications, setNotifications] = React.useState(true);
  const [downloads, setDownloads] = React.useState(false);

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background Gradient */}
      <LinearGradient
        colors={isDark ? ["#1e1b4b", "#0f172a", "#020617"] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]}
        className="absolute inset-0"
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header with Profile */}
        <Animated.View
          entering={FadeInDown.springify()}
          className="items-center pt-14 pb-6"
        >
          {/* Profile Picture */}
          <View className="relative mb-4">
            <View className="w-28 h-28 rounded-full border-4 border-violet-500 overflow-hidden">
              <Image
                source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            </View>
            <TouchableOpacity
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-violet-600 items-center justify-center border-4"
              style={{ borderColor: theme.background }}
            >
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <Text className="text-2xl font-black" style={{ color: theme.text }}>John Doe</Text>
          <Text className="text-sm mt-1" style={{ color: theme.textSecondary }}>john.doe@email.com</Text>

          {/* Edit Profile Button */}
          <TouchableOpacity className="mt-4">
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              className="px-6 py-2.5 rounded-full flex-row items-center gap-2"
            >
              <Ionicons name="create-outline" size={18} color="white" />
              <Text className="text-white font-bold">Edit Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats */}
        <ProfileStats theme={theme} />

        {/* Quick Access Section */}
        <Animated.View
          entering={FadeInDown.delay(250).springify()}
          className="px-5 mb-6"
        >
          <Text className="text-sm font-bold uppercase mb-4" style={{ color: theme.textSecondary }}>
            Quick Access
          </Text>
          <View className="flex-row justify-between gap-3">
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/friends");
              }}
              className="flex-1 rounded-2xl p-4 items-center"
              style={{ backgroundColor: theme.card }}
            >
              <View className="w-12 h-12 rounded-full bg-blue-500/20 items-center justify-center mb-2">
                <Ionicons name="people" size={24} color="#3b82f6" />
              </View>
              <Text className="font-bold text-sm" style={{ color: theme.text }}>Friends</Text>
              <Text className="text-xs mt-1" style={{ color: theme.textSecondary }}>Chat & Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/mylist");
              }}
              className="flex-1 rounded-2xl p-4 items-center"
              style={{ backgroundColor: theme.card }}
            >
              <View className="w-12 h-12 rounded-full bg-violet-500/20 items-center justify-center mb-2">
                <Ionicons name="bookmark" size={24} color={theme.primary} />
              </View>
              <Text className="font-bold text-sm" style={{ color: theme.text }}>My List</Text>
              <Text className="text-xs mt-1" style={{ color: theme.textSecondary }}>Saved Movies</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/category/downloads");
              }}
              className="flex-1 rounded-2xl p-4 items-center"
              style={{ backgroundColor: theme.card }}
            >
              <View className="w-12 h-12 rounded-full bg-green-500/20 items-center justify-center mb-2">
                <Ionicons name="download" size={24} color="#22c55e" />
              </View>
              <Text className="font-bold text-sm" style={{ color: theme.text }}>Downloads</Text>
              <Text className="text-xs mt-1" style={{ color: theme.textSecondary }}>Offline</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        <SubscriptionBanner />

        {/* Settings Section */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          className="px-5"
        >
          <Text className="text-sm font-bold uppercase mb-4" style={{ color: theme.textSecondary }}>
            Preferences
          </Text>
          <View className="rounded-3xl px-4" style={{ backgroundColor: theme.card }}>
            <SettingsItem
              icon="notifications"
              label="Notifications"
              hasToggle
              toggleValue={notifications}
              onToggle={setNotifications}
              delay={350}
              theme={theme}
            />
            <SettingsItem
              icon="download"
              label="Auto Downloads"
              hasToggle
              toggleValue={downloads}
              onToggle={setDownloads}
              delay={400}
              theme={theme}
            />
            <SettingsItem
              icon="language"
              label="Language"
              value="English"
              delay={450}
              theme={theme}
            />
            <SettingsItem
              icon="moon"
              label="Dark Mode"
              delay={500}
              theme={theme}
              customRight={<ThemeToggle />}
            />
          </View>
        </Animated.View>

        {/* Account Section */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          className="px-5 mt-6"
        >
          <Text className="text-sm font-bold uppercase mb-4" style={{ color: theme.textSecondary }}>
            Account
          </Text>
          <View className="rounded-3xl px-4" style={{ backgroundColor: theme.card }}>
            <SettingsItem
              icon="card"
              label="Subscription"
              value="Free"
              delay={550}
              theme={theme}
            />
            <SettingsItem
              icon="shield-checkmark"
              label="Privacy & Security"
              delay={600}
              theme={theme}
            />
            <SettingsItem
              icon="help-circle"
              label="Help & Support"
              delay={650}
              theme={theme}
            />
            <SettingsItem
              icon="information-circle"
              label="About"
              delay={700}
              theme={theme}
            />
          </View>
        </Animated.View>

        {/* Logout Button */}
        <Animated.View
          entering={FadeIn.delay(800)}
          className="px-5 mt-8"
        >
          <TouchableOpacity className="bg-red-500/10 rounded-2xl py-4 flex-row items-center justify-center gap-2">
            <Ionicons name="log-out-outline" size={22} color={Colors.danger} />
            <Text className="text-red-500 font-bold text-base">Log Out</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* App Version */}
        <Animated.View entering={FadeIn.delay(900)} className="items-center mt-6">
          <Text className="text-xs" style={{ color: theme.textMuted }}>MoviesHub v1.0.0</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
