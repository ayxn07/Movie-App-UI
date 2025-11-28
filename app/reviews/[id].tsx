import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import {
  ALL_MOVIES,
  Colors,
  DEFAULT_REVIEWS,
  MOVIE_REVIEWS,
} from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";
import { Review } from "@/types";

const { width } = Dimensions.get("window");

// Star Rating Component
const StarRating = ({ rating, size = 16, theme }: { rating: number; size?: number; theme: ThemeColors }) => {
  const fullStars = Math.floor(rating / 2);
  const hasHalfStar = (rating / 2) % 1 >= 0.5;
  
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      {[...Array(5)].map((_, i) => (
        <Ionicons
          key={i}
          name={i < fullStars ? "star" : i === fullStars && hasHalfStar ? "star-half" : "star-outline"}
          size={size}
          color={i < fullStars || (i === fullStars && hasHalfStar) ? Colors.star : theme.textMuted}
        />
      ))}
    </View>
  );
};

// Review Card Component
const ReviewCard = ({
  review,
  index,
  theme,
  isDark,
}: {
  review: Review;
  index: number;
  theme: ThemeColors;
  isDark: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);
  const [isHelpful, setIsHelpful] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleHelpful = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isHelpful) {
      setHelpfulCount(helpfulCount - 1);
    } else {
      setHelpfulCount(helpfulCount + 1);
    }
    setIsHelpful(!isHelpful);
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).springify()}
      style={[animatedStyle, { marginBottom: 16, paddingHorizontal: 20 }]}
    >
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => setIsExpanded(!isExpanded)}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
      >
        <View style={{
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          borderRadius: 20,
          padding: 16,
          borderWidth: isDark ? 0 : 1,
          borderColor: theme.border,
        }}>
          {/* User Info */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <Image
              source={{ uri: review.userAvatar }}
              style={{ width: 44, height: 44, borderRadius: 22 }}
              contentFit="cover"
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ color: theme.text, fontWeight: "700", fontSize: 15 }}>
                  {review.userName}
                </Text>
                {review.verified && (
                  <View style={{
                    backgroundColor: Colors.success + "20",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}>
                    <Ionicons name="checkmark-circle" size={12} color={Colors.success} />
                    <Text style={{ color: Colors.success, fontSize: 10, fontWeight: "600" }}>Verified</Text>
                  </View>
                )}
              </View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>
                {new Date(review.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </Text>
            </View>
            <View style={{
              backgroundColor: Colors.star + "30",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}>
              <Ionicons name="star" size={14} color={Colors.star} />
              <Text style={{ color: Colors.star, fontWeight: "700" }}>{review.rating}/10</Text>
            </View>
          </View>

          {/* Review Title */}
          <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16, marginBottom: 8 }}>
            {review.title}
          </Text>

          {/* Review Content */}
          <Text
            style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 22 }}
            numberOfLines={isExpanded ? undefined : 3}
          >
            {review.content}
          </Text>

          {/* Read More */}
          {review.content.length > 150 && (
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={{ marginTop: 8 }}>
              <Text style={{ color: theme.primary, fontWeight: "600", fontSize: 13 }}>
                {isExpanded ? "Show Less" : "Read More"}
              </Text>
            </TouchableOpacity>
          )}

          {/* Actions */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: theme.border }}>
            <TouchableOpacity
              onPress={handleHelpful}
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons
                name={isHelpful ? "thumbs-up" : "thumbs-up-outline"}
                size={18}
                color={isHelpful ? theme.primary : theme.textSecondary}
              />
              <Text style={{ color: isHelpful ? theme.primary : theme.textSecondary, fontWeight: "500", fontSize: 13 }}>
                Helpful ({helpfulCount})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons name="flag-outline" size={18} color={theme.textSecondary} />
              <Text style={{ color: theme.textSecondary, fontWeight: "500", fontSize: 13 }}>Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Filter Button Component
const FilterButton = ({
  label,
  isActive,
  onPress,
  theme,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
  theme: ThemeColors;
}) => (
  <TouchableOpacity
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }}
    style={{ marginRight: 12 }}
  >
    <View style={{
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: isActive ? theme.primary : theme.card,
    }}>
      <Text style={{
        fontWeight: "700",
        fontSize: 13,
        color: isActive ? "#ffffff" : theme.textSecondary,
      }}>
        {label}
      </Text>
    </View>
  </TouchableOpacity>
);

type FilterType = "all" | "positive" | "critical";

export default function ReviewsScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const movieId = Number(params.id);

  const [filter, setFilter] = useState<FilterType>("all");

  const movie = ALL_MOVIES.find((m) => m.id === movieId);
  const reviews = MOVIE_REVIEWS[movieId] || DEFAULT_REVIEWS;

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    switch (filter) {
      case "positive":
        return reviews.filter((r) => r.rating >= 7);
      case "critical":
        return reviews.filter((r) => r.rating < 7);
      default:
        return reviews;
    }
  }, [reviews, filter]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background Gradient */}
      <LinearGradient
        colors={isDark ? ["#1e1b4b", "#0f172a", "#020617"] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Header */}
      <Animated.View entering={FadeInDown.springify()} style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}>
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
            <Text style={{ color: theme.text, fontSize: 24, fontWeight: "900" }}>Reviews</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }} numberOfLines={1}>
              {movie?.title || "Movie"}
            </Text>
          </View>
        </View>

        {/* Rating Summary */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 20,
            padding: 20,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ alignItems: "center", marginRight: 24 }}>
              <Text style={{ color: theme.text, fontSize: 48, fontWeight: "900" }}>{averageRating}</Text>
              <StarRating rating={Number(averageRating) * 2} size={16} theme={theme} />
              <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>
                {reviews.length} reviews
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => Math.floor(r.rating / 2) === star).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <View key={star} style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                    <Text style={{ color: theme.textSecondary, fontSize: 12, width: 20 }}>{star}</Text>
                    <Ionicons name="star" size={12} color={Colors.star} style={{ marginRight: 8 }} />
                    <View style={{ flex: 1, height: 6, backgroundColor: isDark ? "#334155" : "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                      <View style={{ height: "100%", width: `${percentage}%`, backgroundColor: Colors.star, borderRadius: 3 }} />
                    </View>
                    <Text style={{ color: theme.textMuted, fontSize: 10, width: 30, textAlign: "right" }}>{count}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Animated.View>

        {/* Filter Buttons */}
        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <FilterButton label="All Reviews" isActive={filter === "all"} onPress={() => setFilter("all")} theme={theme} />
            <FilterButton label="Positive" isActive={filter === "positive"} onPress={() => setFilter("positive")} theme={theme} />
            <FilterButton label="Critical" isActive={filter === "critical"} onPress={() => setFilter("critical")} theme={theme} />
          </Animated.ScrollView>
        </Animated.View>
      </Animated.View>

      {/* Reviews List */}
      <FlashList
        data={filteredReviews}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item, index }) => (
          <ReviewCard review={item} index={index} theme={theme} isDark={isDark} />
        )}
        keyExtractor={(item) => item.id}
        estimatedItemSize={200}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 80 }}>
            <Ionicons name="chatbubble-outline" size={48} color={theme.textMuted} />
            <Text style={{ color: theme.textSecondary, fontSize: 16, marginTop: 16 }}>No reviews yet</Text>
            <Text style={{ color: theme.textMuted, fontSize: 14, marginTop: 8, textAlign: "center", paddingHorizontal: 40 }}>
              Be the first to review this movie!
            </Text>
          </View>
        }
      />

      {/* Write Review Button */}
      <Animated.View
        entering={FadeIn.delay(400)}
        style={{
          position: "absolute",
          bottom: 40,
          left: 20,
          right: 20,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 16,
              borderRadius: 16,
            }}
          >
            <Ionicons name="create-outline" size={20} color="white" />
            <Text style={{ color: "white", fontWeight: "700", fontSize: 16, marginLeft: 8 }}>Write a Review</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
