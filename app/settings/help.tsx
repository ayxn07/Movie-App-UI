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
import Animated, { FadeIn, FadeInDown, FadeInRight, FadeInUp } from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useTheme } from "@/context";

// FAQ Item type
interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

// FAQ data
const FAQS: FAQItem[] = [
  {
    id: "1",
    question: "How do I download movies for offline viewing?",
    answer: "Navigate to the movie details page and tap the download button. Select your preferred quality and the download will begin. Downloaded movies can be found in your Downloads section.",
  },
  {
    id: "2",
    question: "How many devices can I use simultaneously?",
    answer: "The number of devices depends on your subscription plan. Free users can use 1 device, Basic allows 2 devices, Premium allows 4 devices, and Family plan allows up to 6 devices.",
  },
  {
    id: "3",
    question: "How do I cancel my subscription?",
    answer: "Go to Profile > Subscription and tap on Manage Subscription. From there you can cancel your subscription. Your access will continue until the end of your billing period.",
  },
  {
    id: "4",
    question: "Why is a movie not available in my region?",
    answer: "Content availability varies by region due to licensing agreements. We are constantly working to expand our library in all regions.",
  },
  {
    id: "5",
    question: "How do I change video quality?",
    answer: "You can adjust video quality in Settings > Playback. You can also change quality during playback by tapping the settings icon in the player.",
  },
];

// Support options
const SUPPORT_OPTIONS = [
  { id: "chat", icon: "chatbubbles", title: "Live Chat", subtitle: "Chat with our support team", color: Colors.primary },
  { id: "email", icon: "mail", title: "Email Support", subtitle: "support@movieshub.com", color: Colors.secondary },
  { id: "phone", icon: "call", title: "Phone Support", subtitle: "1-800-MOVIES", color: Colors.accent },
  { id: "feedback", icon: "create", title: "Send Feedback", subtitle: "Help us improve", color: Colors.success },
];

// FAQ Accordion Component
const FAQAccordion = ({
  faq,
  isExpanded,
  onToggle,
  index,
}: {
  faq: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInRight.delay(index * 80).springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onToggle();
        }}
        style={{
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          borderRadius: 16,
          marginBottom: 12,
          overflow: "hidden",
          borderWidth: isDark ? 0 : 1,
          borderColor: theme.border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
          }}
        >
          <Text style={{ color: theme.text, fontSize: 15, fontWeight: "600", flex: 1, paddingRight: 16 }}>
            {faq.question}
          </Text>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={theme.textSecondary}
          />
        </View>
        {isExpanded && (
          <Animated.View entering={FadeIn.duration(200)}>
            <View
              style={{
                paddingHorizontal: 16,
                paddingBottom: 16,
                borderTopWidth: 1,
                borderTopColor: theme.border,
                paddingTop: 12,
              }}
            >
              <Text style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 22 }}>
                {faq.answer}
              </Text>
            </View>
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Support Option Card
const SupportOptionCard = ({
  option,
  index,
}: {
  option: typeof SUPPORT_OPTIONS[0];
  index: number;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeInUp.delay(100 + index * 80).springify()}
      style={{ width: "48%" }}
    >
      <TouchableOpacity
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        style={{
          padding: 16,
          borderRadius: 20,
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          alignItems: "center",
          borderWidth: isDark ? 0 : 1,
          borderColor: theme.border,
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: `${option.color}20`,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Ionicons name={option.icon as keyof typeof Ionicons.glyphMap} size={28} color={option.color} />
        </View>
        <Text style={{ color: theme.text, fontSize: 15, fontWeight: "700", marginBottom: 4 }}>
          {option.title}
        </Text>
        <Text style={{ color: theme.textSecondary, fontSize: 11, textAlign: "center" }}>
          {option.subtitle}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function HelpScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
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
          paddingTop: 56,
          paddingHorizontal: 20,
          paddingBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
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
              How can we help you?
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
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}
        >
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search help articles..."
            placeholderTextColor={theme.textMuted}
            style={{ flex: 1, marginLeft: 12, fontSize: 15, color: theme.text }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Contact Options */}
        <Animated.View entering={FadeIn.delay(100)}>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700", marginBottom: 16 }}>
            Contact Us
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 32 }}>
            {SUPPORT_OPTIONS.map((option, index) => (
              <SupportOptionCard key={option.id} option={option} index={index} />
            ))}
          </View>
        </Animated.View>

        {/* FAQs */}
        <Animated.View entering={FadeIn.delay(200)}>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700", marginBottom: 16 }}>
            Frequently Asked Questions
          </Text>
          {filteredFAQs.map((faq, index) => (
            <FAQAccordion
              key={faq.id}
              faq={faq}
              isExpanded={expandedFAQ === faq.id}
              onToggle={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
              index={index}
            />
          ))}
        </Animated.View>

        {/* Still need help */}
        <Animated.View entering={FadeInUp.delay(400).springify()}>
          <TouchableOpacity
            style={{
              marginTop: 20,
              padding: 20,
              borderRadius: 20,
              backgroundColor: isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.1)",
              alignItems: "center",
            }}
          >
            <Ionicons name="help-buoy" size={40} color={theme.primary} />
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700", marginTop: 12 }}>
              Still need help?
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 4, textAlign: "center" }}>
              Our support team is available 24/7
            </Text>
            <View
              style={{
                marginTop: 16,
                backgroundColor: theme.primary,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Contact Support</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
