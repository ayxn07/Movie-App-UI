import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
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

const FAQ_ITEMS = [
  {
    id: "1",
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription anytime from the Subscription page in your profile settings. Your access will continue until the end of your billing period.",
  },
  {
    id: "2",
    question: "Can I download movies for offline viewing?",
    answer: "Yes! Premium and Family plan subscribers can download movies and shows for offline viewing. Go to any movie and tap the download button to save it to your device.",
  },
  {
    id: "3",
    question: "How many devices can I use?",
    answer: "The number of devices depends on your plan. Free: 1 device, Basic: 2 devices, Premium: 4 devices, Family: 6 devices.",
  },
  {
    id: "4",
    question: "Why is a movie not available in my region?",
    answer: "Content availability varies by region due to licensing agreements. We're constantly working to expand our library globally.",
  },
  {
    id: "5",
    question: "How do I report a problem with playback?",
    answer: "If you're experiencing playback issues, try restarting the app, checking your internet connection, or clearing the app cache. If problems persist, contact our support team.",
  },
];

const CONTACT_OPTIONS = [
  {
    id: "email",
    icon: "mail",
    title: "Email Support",
    description: "support@movieshub.com",
    color: Colors.primary,
  },
  {
    id: "chat",
    icon: "chatbubbles",
    title: "Live Chat",
    description: "Chat with our support team",
    color: Colors.secondary,
  },
  {
    id: "phone",
    icon: "call",
    title: "Phone Support",
    description: "1-800-MOVIES",
    color: Colors.success,
  },
  {
    id: "twitter",
    icon: "logo-twitter",
    title: "Twitter",
    description: "@MovieHubSupport",
    color: "#1DA1F2",
  },
];

export default function HelpScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const filteredFaqs = FAQ_ITEMS.filter(
    item => item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactOption = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    showToast("Opening support channel...", "info");
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
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
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
            <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>Help & Support</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
              We&apos;re here to help
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(241, 245, 249, 0.9)",
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderWidth: isDark ? 0 : 1,
          borderColor: theme.border,
        }}>
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for help..."
            placeholderTextColor={theme.textMuted}
            style={{ flex: 1, marginLeft: 12, fontSize: 15, color: theme.text }}
          />
        </View>
      </Animated.View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Quick Help Banner */}
        <Animated.View entering={FadeIn.delay(100)}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              showToast("Starting live chat...", "info");
            }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 20,
                padding: 20,
                marginBottom: 24,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{
                width: 56, height: 56, borderRadius: 28,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                alignItems: "center", justifyContent: "center",
              }}>
                <Ionicons name="headset" size={28} color="white" />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={{ color: "white", fontSize: 18, fontWeight: "700", marginBottom: 4 }}>
                  Need quick help?
                </Text>
                <Text style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 14 }}>
                  Chat with us now - Available 24/7
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Contact Options */}
        <Animated.View entering={FadeIn.delay(200)}>
          <Text style={{ color: theme.textSecondary, fontWeight: "600", fontSize: 14, marginBottom: 12 }}>
            Contact Us
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
            {CONTACT_OPTIONS.map((option, index) => (
              <Animated.View
                key={option.id}
                entering={FadeInRight.delay(index * 50)}
                style={{ width: "48%" }}
              >
                <TouchableOpacity
                  onPress={() => handleContactOption(option.id)}
                  style={{
                    backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: isDark ? 0 : 1,
                    borderColor: theme.border,
                  }}
                >
                  <View style={{
                    width: 44, height: 44, borderRadius: 12,
                    backgroundColor: `${option.color}20`,
                    alignItems: "center", justifyContent: "center", marginBottom: 12,
                  }}>
                    <Ionicons name={option.icon as keyof typeof Ionicons.glyphMap} size={22} color={option.color} />
                  </View>
                  <Text style={{ color: theme.text, fontWeight: "600", fontSize: 14, marginBottom: 4 }}>
                    {option.title}
                  </Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 12 }} numberOfLines={1}>
                    {option.description}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* FAQ Section */}
        <Animated.View entering={FadeIn.delay(400)}>
          <Text style={{ color: theme.textSecondary, fontWeight: "600", fontSize: 14, marginBottom: 12 }}>
            Frequently Asked Questions
          </Text>
          <View style={{
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 20,
            overflow: "hidden",
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}>
            {filteredFaqs.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInRight.delay(300 + index * 50)}
              >
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setExpandedFaq(expandedFaq === item.id ? null : item.id);
                  }}
                  style={{
                    padding: 16,
                    borderBottomWidth: index < filteredFaqs.length - 1 ? 1 : 0,
                    borderBottomColor: theme.border,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ flex: 1, color: theme.text, fontWeight: "600", fontSize: 15 }}>
                      {item.question}
                    </Text>
                    <Ionicons
                      name={expandedFaq === item.id ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={theme.textMuted}
                    />
                  </View>
                  {expandedFaq === item.id && (
                    <Animated.View entering={FadeIn.duration(200)}>
                      <Text style={{
                        color: theme.textSecondary,
                        fontSize: 14,
                        lineHeight: 22,
                        marginTop: 12,
                      }}>
                        {item.answer}
                      </Text>
                    </Animated.View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Additional Resources */}
        <Animated.View entering={FadeIn.delay(600)} style={{ marginTop: 24 }}>
          <View style={{
            backgroundColor: `${theme.primary}10`,
            borderRadius: 16,
            padding: 20,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <Ionicons name="book" size={24} color={theme.primary} />
              <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16, marginLeft: 12 }}>
                Help Center
              </Text>
            </View>
            <Text style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 22, marginBottom: 16 }}>
              Visit our comprehensive Help Center for detailed guides, tutorials, and troubleshooting tips.
            </Text>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                showToast("Opening Help Center...", "info");
              }}
              style={{
                backgroundColor: theme.primary,
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Visit Help Center</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
