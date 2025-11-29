import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useTheme } from "@/context";

const SOCIAL_LINKS = [
  { icon: "logo-facebook", url: "https://facebook.com/movieshub", color: "#1877F2" },
  { icon: "logo-twitter", url: "https://twitter.com/movieshub", color: "#1DA1F2" },
  { icon: "logo-instagram", url: "https://instagram.com/movieshub", color: "#E4405F" },
  { icon: "logo-youtube", url: "https://youtube.com/movieshub", color: "#FF0000" },
];

const TEAM_MEMBERS = [
  {
    name: "Sarah Chen",
    role: "CEO & Founder",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Michael Johnson",
    role: "CTO",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Design",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "David Kim",
    role: "Lead Developer",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];

// Link Item Component
const LinkItem = ({
  icon,
  title,
  onPress,
  index,
}: {
  icon: string;
  title: string;
  onPress: () => void;
  index: number;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInUp.delay(index * 50).springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}
      >
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={20}
          color={theme.primary}
          style={{ marginRight: 16 }}
        />
        <Text style={{ flex: 1, color: theme.text, fontSize: 16, fontWeight: "500" }}>{title}</Text>
        <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Team Member Card
const TeamMemberCard = ({
  member,
  index,
}: {
  member: (typeof TEAM_MEMBERS)[0];
  index: number;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).springify()}
      style={{
        alignItems: "center",
        width: 80,
      }}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          overflow: "hidden",
          borderWidth: 2,
          borderColor: theme.primary,
          marginBottom: 8,
        }}
      >
        <Image
          source={{ uri: member.avatar }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      </View>
      <Text
        style={{
          color: theme.text,
          fontSize: 12,
          fontWeight: "600",
          textAlign: "center",
        }}
        numberOfLines={1}
      >
        {member.name}
      </Text>
      <Text
        style={{
          color: theme.textSecondary,
          fontSize: 10,
          textAlign: "center",
        }}
        numberOfLines={1}
      >
        {member.role}
      </Text>
    </Animated.View>
  );
};

export default function AboutScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const handleOpenURL = (url: string) => {
    Linking.openURL(url).catch(() => {
      // Handle error
    });
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
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* App Logo and Info */}
        <Animated.View
          entering={FadeIn.delay(100)}
          style={{
            alignItems: "center",
            paddingVertical: 32,
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 24,
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="film" size={48} color="white" />
            </LinearGradient>
          </View>
          <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>MoviesHub</Text>
          <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 4 }}>
            Version 1.0.0 (Build 100)
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 16,
              marginTop: 16,
            }}
          >
            {SOCIAL_LINKS.map((social) => (
              <TouchableOpacity
                key={social.icon}
                onPress={() => handleOpenURL(social.url)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: `${social.color}20`,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={social.icon as keyof typeof Ionicons.glyphMap}
                  size={22}
                  color={social.color}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Description */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={{
            marginHorizontal: 20,
            marginBottom: 24,
            padding: 20,
            borderRadius: 20,
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}
        >
          <Text
            style={{
              color: theme.text,
              fontSize: 15,
              lineHeight: 24,
              textAlign: "center",
            }}
          >
            MoviesHub is your ultimate destination for streaming movies and TV shows. We bring you
            thousands of titles from around the world, all in stunning quality. Our mission is to
            make entertainment accessible to everyone, everywhere.
          </Text>
        </Animated.View>

        {/* Team Section */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={{ marginBottom: 24 }}>
          <Text
            style={{
              color: theme.textSecondary,
              fontSize: 12,
              fontWeight: "700",
              textTransform: "uppercase",
              marginHorizontal: 20,
              marginBottom: 16,
            }}
          >
            Our Team
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
          >
            {TEAM_MEMBERS.map((member, index) => (
              <TeamMemberCard key={member.name} member={member} index={index} />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Stats */}
        <Animated.View
          entering={FadeInDown.delay(350).springify()}
          style={{
            marginHorizontal: 20,
            marginBottom: 24,
            flexDirection: "row",
            gap: 12,
          }}
        >
          {[
            { value: "10M+", label: "Downloads" },
            { value: "50K+", label: "Movies" },
            { value: "4.8", label: "Rating" },
          ].map((stat, index) => (
            <View
              key={stat.label}
              style={{
                flex: 1,
                padding: 16,
                borderRadius: 16,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                alignItems: "center",
                borderWidth: isDark ? 0 : 1,
                borderColor: theme.border,
              }}
            >
              <Text style={{ color: theme.primary, fontSize: 24, fontWeight: "900" }}>
                {stat.value}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>
                {stat.label}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* Links Section */}
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
            <LinkItem
              icon="document-text"
              title="Terms of Service"
              onPress={() => handleOpenURL("https://movieshub.com/terms")}
              index={0}
            />
            <LinkItem
              icon="shield"
              title="Privacy Policy"
              onPress={() => handleOpenURL("https://movieshub.com/privacy")}
              index={1}
            />
            <LinkItem
              icon="document"
              title="License Agreement"
              onPress={() => handleOpenURL("https://movieshub.com/license")}
              index={2}
            />
            <LinkItem
              icon="code"
              title="Open Source Libraries"
              onPress={() => {}}
              index={3}
            />
          </View>
        </Animated.View>

        {/* Rate App */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={{ marginHorizontal: 20, marginBottom: 24 }}
        >
          <TouchableOpacity activeOpacity={0.9}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 20,
                padding: 20,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "800" }}>
                Enjoying MoviesHub?
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 4 }}>
                Rate us on the App Store
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 12,
                  gap: 8,
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons key={star} name="star" size={28} color="#fbbf24" />
                ))}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Copyright */}
        <Animated.View entering={FadeIn.delay(600)} style={{ alignItems: "center" }}>
          <Text style={{ color: theme.textMuted, fontSize: 12 }}>
            © 2024 MoviesHub. All rights reserved.
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 4 }}>
            Made with ❤️ by the MoviesHub Team
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
