import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useApp, useTheme } from "@/context";

const SUBSCRIPTION_PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "Access to limited content",
      "Ads supported",
      "SD quality streaming",
      "1 device at a time",
    ],
    color: "#64748b",
  },
  {
    id: "basic",
    name: "Basic",
    price: "$4.99",
    period: "/month",
    features: [
      "Access to all movies & series",
      "No ads",
      "HD quality streaming",
      "2 devices at a time",
      "Download up to 10 titles",
    ],
    color: Colors.secondary,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$9.99",
    period: "/month",
    features: [
      "Access to all movies & series",
      "No ads",
      "4K Ultra HD streaming",
      "4 devices at a time",
      "Unlimited downloads",
      "Early access to new releases",
      "Exclusive content",
    ],
    color: Colors.primary,
    popular: true,
  },
  {
    id: "family",
    name: "Family",
    price: "$14.99",
    period: "/month",
    features: [
      "Everything in Premium",
      "6 user profiles",
      "6 devices at a time",
      "Kids mode with parental controls",
      "Separate watch history",
    ],
    color: Colors.success,
  },
];

export default function SubscriptionScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { showToast } = useApp();
  const [currentPlan] = useState("free");
  const [selectedPlan, setSelectedPlan] = useState("premium");

  const handleSubscribe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    showToast(`Subscribed to ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} plan!`, "success");
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
            <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>Subscription</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
              Choose your plan
            </Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Current Plan Banner */}
        <Animated.View entering={FadeIn.delay(100)}>
          <View style={{
            backgroundColor: `${theme.primary}15`,
            borderRadius: 16,
            padding: 16,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: `${theme.primary}30`,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{
                width: 48, height: 48, borderRadius: 12,
                backgroundColor: `${theme.primary}20`,
                alignItems: "center", justifyContent: "center",
              }}>
                <Ionicons name="card" size={24} color={theme.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>Current Plan</Text>
                <Text style={{ color: theme.text, fontWeight: "700", fontSize: 18 }}>
                  {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
                </Text>
              </View>
              <View style={{
                backgroundColor: currentPlan === "free" ? "#64748b" : Colors.success,
                paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
              }}>
                <Text style={{ color: "white", fontWeight: "600", fontSize: 12 }}>Active</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Subscription Plans */}
        {SUBSCRIPTION_PLANS.map((plan, index) => (
          <Animated.View
            key={plan.id}
            entering={FadeInUp.delay(150 + index * 100).springify()}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedPlan(plan.id);
              }}
              style={{
                borderRadius: 20,
                marginBottom: 16,
                borderWidth: 2,
                borderColor: selectedPlan === plan.id ? plan.color : "transparent",
                overflow: "hidden",
              }}
            >
              <View style={{
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                padding: 20,
              }}>
                {/* Popular Badge */}
                {plan.popular && (
                  <View style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    backgroundColor: plan.color,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}>
                    <Text style={{ color: "white", fontWeight: "700", fontSize: 11 }}>POPULAR</Text>
                  </View>
                )}

                {/* Plan Header */}
                <View style={{ flexDirection: "row", alignItems: "flex-end", marginBottom: 16 }}>
                  <View style={{
                    width: 48, height: 48, borderRadius: 12,
                    backgroundColor: `${plan.color}20`,
                    alignItems: "center", justifyContent: "center", marginRight: 12,
                  }}>
                    <Ionicons
                      name={plan.id === "free" ? "gift" : plan.id === "family" ? "people" : "diamond"}
                      size={24}
                      color={plan.color}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontWeight: "800", fontSize: 20 }}>{plan.name}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ color: plan.color, fontWeight: "900", fontSize: 28 }}>{plan.price}</Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 13 }}>{plan.period}</Text>
                  </View>
                </View>

                {/* Features */}
                <View style={{ gap: 10 }}>
                  {plan.features.map((feature, i) => (
                    <View key={i} style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons name="checkmark-circle" size={18} color={plan.color} />
                      <Text style={{ color: theme.textSecondary, marginLeft: 10, fontSize: 14 }}>
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Selection Indicator */}
                {selectedPlan === plan.id && (
                  <View style={{
                    position: "absolute",
                    top: 0, left: 0, bottom: 0, width: 4,
                    backgroundColor: plan.color,
                  }} />
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Bottom CTA */}
      <Animated.View
        entering={FadeInUp.delay(600)}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 20,
          paddingBottom: 34,
          backgroundColor: isDark ? "rgba(2, 6, 23, 0.95)" : "rgba(255, 255, 255, 0.95)",
          borderTopWidth: 1,
          borderTopColor: theme.border,
        }}
      >
        <TouchableOpacity
          onPress={handleSubscribe}
          disabled={selectedPlan === currentPlan}
          style={{ opacity: selectedPlan === currentPlan ? 0.5 : 1 }}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 18,
              borderRadius: 16,
              gap: 8,
            }}
          >
            <Ionicons name="diamond" size={20} color="white" />
            <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
              {selectedPlan === currentPlan ? "Current Plan" : "Upgrade Now"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
