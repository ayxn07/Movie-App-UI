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
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useTheme } from "@/context";

// Subscription plan type
interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  savings?: string;
}

// Subscription plans
const PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "Access to limited content",
      "Standard quality streaming",
      "Watch on 1 device",
      "Ads supported",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    price: "$4.99",
    period: "per month",
    features: [
      "Access to all movies",
      "HD quality streaming",
      "Watch on 2 devices",
      "Ad-free experience",
      "Download 5 movies",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$9.99",
    period: "per month",
    popular: true,
    features: [
      "Access to all content",
      "4K Ultra HD streaming",
      "Watch on 4 devices",
      "Ad-free experience",
      "Unlimited downloads",
      "Exclusive premieres",
      "Dolby Atmos audio",
    ],
  },
  {
    id: "family",
    name: "Family",
    price: "$14.99",
    period: "per month",
    savings: "Save 40%",
    features: [
      "Everything in Premium",
      "Watch on 6 devices",
      "6 profile accounts",
      "Kids profiles",
      "Parental controls",
      "Profile lock PIN",
    ],
  },
];

// Plan Card Component
const PlanCard = ({
  plan,
  isSelected,
  onSelect,
  index,
}: {
  plan: SubscriptionPlan;
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
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? theme.primary : theme.border,
        }}
      >
        {plan.popular && (
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={{
              paddingVertical: 6,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>
              MOST POPULAR
            </Text>
          </LinearGradient>
        )}
        
        <View
          style={{
            padding: 20,
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <View>
              <Text style={{ color: theme.text, fontSize: 22, fontWeight: "800" }}>
                {plan.name}
              </Text>
              {plan.savings && (
                <View
                  style={{
                    backgroundColor: Colors.success,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                    marginTop: 4,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 10, fontWeight: "700" }}>
                    {plan.savings}
                  </Text>
                </View>
              )}
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: theme.primary, fontSize: 28, fontWeight: "900" }}>
                {plan.price}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                {plan.period}
              </Text>
            </View>
          </View>

          <View style={{ borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
            {plan.features.map((feature, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
                <Text style={{ color: theme.textSecondary, fontSize: 14, marginLeft: 10 }}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>

          {isSelected && (
            <View
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: theme.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="checkmark" size={18} color="white" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function SubscriptionScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("free");

  const handleSubscribe = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
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
          paddingTop: 56,
          paddingHorizontal: 20,
          paddingBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
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

        {/* Current Plan Badge */}
        <Animated.View
          entering={FadeIn.delay(200)}
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 16,
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: "rgba(139, 92, 246, 0.2)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name="diamond" size={24} color={theme.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Current Plan</Text>
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700" }}>Free</Text>
            </View>
            <View
              style={{
                backgroundColor: isDark ? "rgba(34, 197, 94, 0.2)" : "rgba(34, 197, 94, 0.1)",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: Colors.success, fontSize: 12, fontWeight: "600" }}>Active</Text>
            </View>
          </View>
        </Animated.View>
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

        {/* Payment Methods */}
        <Animated.View entering={FadeInUp.delay(400).springify()}>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700", marginBottom: 16 }}>
            Payment Methods
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginBottom: 20,
            }}
          >
            {["Apple Pay", "Google Pay", "Credit Card"].map((method, i) => (
              <TouchableOpacity
                key={method}
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  borderRadius: 12,
                  backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                  alignItems: "center",
                  borderWidth: isDark ? 0 : 1,
                  borderColor: theme.border,
                }}
              >
                <Ionicons
                  name={i === 0 ? "logo-apple" : i === 1 ? "logo-google" : "card"}
                  size={24}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Subscribe Button */}
      <Animated.View
        entering={FadeInDown.delay(500).springify()}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          paddingVertical: 16,
          paddingBottom: 32,
          backgroundColor: isDark ? "rgba(2, 6, 23, 0.95)" : "rgba(255, 255, 255, 0.95)",
          borderTopWidth: 1,
          borderTopColor: theme.border,
        }}
      >
        <TouchableOpacity onPress={handleSubscribe} disabled={selectedPlan === "free"}>
          <LinearGradient
            colors={selectedPlan === "free" ? [theme.textMuted, theme.textMuted] : [Colors.primary, Colors.primaryDark]}
            style={{
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>
              {selectedPlan === "free" ? "Current Plan" : `Subscribe to ${PLANS.find(p => p.id === selectedPlan)?.name}`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={{ color: theme.textMuted, fontSize: 12, textAlign: "center", marginTop: 8 }}>
          Cancel anytime. Terms apply.
        </Text>
      </Animated.View>
    </View>
  );
}
