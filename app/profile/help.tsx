import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInRight } from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useTheme } from "@/context";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How do I download movies for offline viewing?",
    answer: "To download a movie, navigate to the movie details page and tap the download button. Choose your preferred quality and the movie will be saved to your device. You can access downloaded content in the Downloads section.",
  },
  {
    question: "Can I share my account with family members?",
    answer: "Yes! With our Family plan, you can create up to 6 profiles and watch on 6 devices simultaneously. Each family member gets their own personalized recommendations.",
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription anytime from the Subscription page in your profile settings. Your access will continue until the end of your billing period.",
  },
  {
    question: "What video quality is supported?",
    answer: "We support multiple quality options: 480p (SD), 720p (HD), 1080p (Full HD), and 4K Ultra HD. Available quality depends on your subscription plan and internet connection.",
  },
  {
    question: "How do I change the subtitle language?",
    answer: "During playback, tap the screen and select the CC icon. You can choose from over 10 subtitle languages. You can also set a default subtitle language in your profile settings.",
  },
  {
    question: "Why is my video buffering?",
    answer: "Buffering usually occurs due to slow internet connection. Try lowering the video quality, moving closer to your WiFi router, or switching to a wired connection if possible.",
  },
];

const CONTACT_OPTIONS = [
  {
    icon: "chatbubbles",
    title: "Live Chat",
    description: "Chat with our support team",
    color: Colors.primary,
  },
  {
    icon: "mail",
    title: "Email Support",
    description: "support@movieshub.com",
    color: Colors.secondary,
  },
  {
    icon: "call",
    title: "Phone Support",
    description: "+1 (800) 123-4567",
    color: Colors.success,
  },
  {
    icon: "logo-twitter",
    title: "Twitter",
    description: "@MoviesHubSupport",
    color: "#1DA1F2",
  },
];

// FAQ Item Component
const FAQItemComponent = ({
  item,
  index,
  isExpanded,
  onToggle,
}: {
  item: FAQItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInRight.delay(index * 50).springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onToggle();
        }}
        style={{
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text
            style={{
              flex: 1,
              color: theme.text,
              fontSize: 16,
              fontWeight: "600",
              paddingRight: 12,
            }}
          >
            {item.question}
          </Text>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={theme.textSecondary}
          />
        </View>
        {isExpanded && (
          <Animated.View entering={FadeIn.duration(200)}>
            <Text
              style={{
                color: theme.textSecondary,
                fontSize: 14,
                lineHeight: 22,
                marginTop: 12,
              }}
            >
              {item.answer}
            </Text>
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Contact Option Component
const ContactOption = ({
  option,
  index,
}: {
  option: (typeof CONTACT_OPTIONS)[0];
  index: number;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInRight.delay(index * 50).springify()}>
      <TouchableOpacity
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderBottomWidth: index < CONTACT_OPTIONS.length - 1 ? 1 : 0,
          borderBottomColor: theme.border,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: `${option.color}20`,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
        >
          <Ionicons name={option.icon as keyof typeof Ionicons.glyphMap} size={22} color={option.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "600" }}>{option.title}</Text>
          <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
            {option.description}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function HelpScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredFAQ = FAQ_ITEMS.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>Help & Support</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
              Get the help you need
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginTop: 20,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}
        >
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for help..."
            placeholderTextColor={theme.textMuted}
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 15,
              color: theme.text,
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              gap: 12,
            }}
          >
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{
                flex: 1,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                borderRadius: 16,
                padding: 16,
                alignItems: "center",
                borderWidth: isDark ? 0 : 1,
                borderColor: theme.border,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: `${Colors.primary}20`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <Ionicons name="book" size={24} color={theme.primary} />
              </View>
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: "600" }}>User Guide</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{
                flex: 1,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                borderRadius: 16,
                padding: 16,
                alignItems: "center",
                borderWidth: isDark ? 0 : 1,
                borderColor: theme.border,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: `${Colors.secondary}20`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <Ionicons name="videocam" size={24} color={theme.secondary} />
              </View>
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: "600" }}>Video Tutorials</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{
                flex: 1,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                borderRadius: 16,
                padding: 16,
                alignItems: "center",
                borderWidth: isDark ? 0 : 1,
                borderColor: theme.border,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: `${Colors.success}20`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <Ionicons name="bug" size={24} color={Colors.success} />
              </View>
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: "600" }}>Report Bug</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* FAQ Section */}
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
            Frequently Asked Questions
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
            {filteredFAQ.length > 0 ? (
              filteredFAQ.map((item, index) => (
                <FAQItemComponent
                  key={index}
                  item={item}
                  index={index}
                  isExpanded={expandedIndex === index}
                  onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
                />
              ))
            ) : (
              <View style={{ padding: 40, alignItems: "center" }}>
                <Ionicons name="search-outline" size={48} color={theme.textMuted} />
                <Text
                  style={{
                    color: theme.text,
                    fontSize: 16,
                    fontWeight: "600",
                    marginTop: 16,
                  }}
                >
                  No results found
                </Text>
                <Text
                  style={{
                    color: theme.textSecondary,
                    fontSize: 14,
                    marginTop: 4,
                    textAlign: "center",
                  }}
                >
                  Try a different search term
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Contact Section */}
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
            Contact Us
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
            {CONTACT_OPTIONS.map((option, index) => (
              <ContactOption key={option.title} option={option} index={index} />
            ))}
          </View>
        </Animated.View>

        {/* Feedback Banner */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={{ marginHorizontal: 20 }}
        >
          <TouchableOpacity activeOpacity={0.9}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 20,
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: "white", fontSize: 18, fontWeight: "800" }}>
                  Share Your Feedback
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 4 }}>
                  Help us improve MoviesHub
                </Text>
              </View>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="arrow-forward" size={22} color="white" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
