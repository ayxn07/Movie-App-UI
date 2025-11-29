import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useTheme } from "@/context";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  color: string[];
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "Limited content access",
      "480p video quality",
      "Watch on 1 device",
      "Ads supported",
    ],
    color: ["#64748b", "#475569"],
  },
  {
    id: "basic",
    name: "Basic",
    price: "$4.99",
    period: "/month",
    features: [
      "Full content library",
      "720p HD quality",
      "Watch on 2 devices",
      "Limited downloads",
      "No ads",
    ],
    color: ["#8b5cf6", "#7c3aed"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$9.99",
    period: "/month",
    features: [
      "Full content library",
      "4K Ultra HD quality",
      "Watch on 4 devices",
      "Unlimited downloads",
      "No ads",
      "Early access to new releases",
      "Exclusive content",
    ],
    isPopular: true,
    color: ["#f59e0b", "#d97706"],
  },
  {
    id: "family",
    name: "Family",
    price: "$14.99",
    period: "/month",
    features: [
      "Everything in Premium",
      "Up to 6 profiles",
      "Watch on 6 devices",
      "Parental controls",
      "Kids mode",
      "Family sharing",
    ],
    color: ["#ec4899", "#db2777"],
  },
];

// Plan Card Component
const PlanCard = ({
  plan,
  isSelected,
  onSelect,
  index,
}: {
  plan: Plan;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInUp.delay(index * 100).springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onSelect();
        }}
        style={{
          marginBottom: 16,
          borderRadius: 24,
          overflow: "hidden",
          borderWidth: isSelected ? 2 : 0,
          borderColor: plan.color[0],
        }}
      >
        <LinearGradient
          colors={isSelected ? (plan.color as [string, string]) : (isDark ? ["#1e293b", "#0f172a"] : ["#f1f5f9", "#e2e8f0"]) as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 20 }}
        >
          {/* Popular Badge */}
          {plan.isPopular && (
            <View
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                backgroundColor: "rgba(255,255,255,0.2)",
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "white", fontSize: 10, fontWeight: "800" }}>POPULAR</Text>
            </View>
          )}

          {/* Plan Header */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                color: isSelected ? "white" : theme.text,
                fontSize: 24,
                fontWeight: "900",
              }}
            >
              {plan.name}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "baseline", marginTop: 8 }}>
              <Text
                style={{
                  color: isSelected ? "white" : theme.text,
                  fontSize: 36,
                  fontWeight: "900",
                }}
              >
                {plan.price}
              </Text>
              <Text
                style={{
                  color: isSelected ? "rgba(255,255,255,0.7)" : theme.textSecondary,
                  fontSize: 14,
                  marginLeft: 4,
                }}
              >
                {plan.period}
              </Text>
            </View>
          </View>

          {/* Features */}
          <View style={{ gap: 10 }}>
            {plan.features.map((feature, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={isSelected ? "white" : theme.primary}
                />
                <Text
                  style={{
                    color: isSelected ? "rgba(255,255,255,0.9)" : theme.textSecondary,
                    fontSize: 14,
                    marginLeft: 10,
                  }}
                >
                  {feature}
                </Text>
              </View>
            ))}
          </View>

          {/* Selection Indicator */}
          <View
            style={{
              marginTop: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 12,
              backgroundColor: isSelected ? "rgba(255,255,255,0.2)" : theme.card,
              borderRadius: 12,
            }}
          >
            <Ionicons
              name={isSelected ? "checkmark-circle" : "ellipse-outline"}
              size={20}
              color={isSelected ? "white" : theme.textSecondary}
            />
            <Text
              style={{
                color: isSelected ? "white" : theme.textSecondary,
                fontSize: 14,
                fontWeight: "600",
                marginLeft: 8,
              }}
            >
              {isSelected ? "Selected" : "Select Plan"}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function SubscriptionScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("free");

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
            <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>Subscription</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
              Choose the perfect plan for you
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Current Plan Badge */}
      <Animated.View
        entering={FadeIn.delay(100)}
        style={{
          marginHorizontal: 20,
          marginBottom: 20,
          padding: 16,
          borderRadius: 16,
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          flexDirection: "row",
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
            backgroundColor: `${theme.primary}20`,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
        >
          <Ionicons name="diamond" size={24} color={theme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Current Plan</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700" }}>Free Plan</Text>
        </View>
        <View
          style={{
            backgroundColor: Colors.success,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>Active</Text>
        </View>
      </Animated.View>

      {/* Plans List */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {PLANS.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan === plan.id}
            onSelect={() => setSelectedPlan(plan.id)}
            index={index}
          />
        ))}

        {/* Money Back Guarantee */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 8,
          }}
        >
          <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
          <Text style={{ color: theme.textSecondary, fontSize: 14, marginLeft: 8 }}>
            30-day money-back guarantee
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Subscribe Button */}
      {selectedPlan !== "free" && (
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
              // Handle subscription
            }}
          >
            <LinearGradient
              colors={(PLANS.find((p) => p.id === selectedPlan)?.color || [Colors.primary, Colors.primaryDark]) as [string, string]}
              style={{
                paddingVertical: 16,
                borderRadius: 16,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Ionicons name="diamond" size={20} color="white" />
              <Text style={{ color: "white", fontSize: 16, fontWeight: "700", marginLeft: 8 }}>
                Subscribe to {PLANS.find((p) => p.id === selectedPlan)?.name}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}
