import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Dimensions, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ALL_MOVIES, Colors } from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";

const { width } = Dimensions.get("window");

// Generate reviews based on movie ID
const generateReviews = (movieId: number) => {
  const baseReviews = [
    {
      id: 1,
      user: "MovieCritic2024",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      rating: 9.5,
      date: "2 days ago",
      title: "A Masterpiece of Cinema",
      content: "This film exceeded all my expectations. The cinematography is breathtaking, the performances are outstanding, and the story keeps you engaged from start to finish. A must-watch for any movie enthusiast!",
      likes: 245,
      isVerified: true,
    },
    {
      id: 2,
      user: "FilmBuff",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      rating: 8.0,
      date: "1 week ago",
      title: "Impressive but not perfect",
      content: "While the film has many strong points - excellent acting, stunning visuals, and a compelling narrative - it does drag a bit in the middle. Still, it's definitely worth watching on the big screen.",
      likes: 128,
      isVerified: false,
    },
    {
      id: 3,
      user: "CinemaLover",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      rating: 9.0,
      date: "2 weeks ago",
      title: "Simply Stunning",
      content: "The director has outdone themselves with this one. Every frame is meticulously crafted, and the emotional depth of the characters is truly remarkable. This is what cinema should be!",
      likes: 312,
      isVerified: true,
    },
    {
      id: 4,
      user: "PopcornFanatic",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      rating: 7.5,
      date: "3 weeks ago",
      title: "Great Entertainment",
      content: "If you're looking for an entertaining movie that doesn't require too much thinking, this is perfect. Great action sequences and some genuinely funny moments. A solid popcorn flick!",
      likes: 89,
      isVerified: false,
    },
    {
      id: 5,
      user: "OscarWatcher",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      rating: 9.2,
      date: "1 month ago",
      title: "Award-Worthy Performance",
      content: "The lead actor delivers what might be the performance of their career. The supporting cast is equally impressive. I wouldn't be surprised to see multiple Oscar nominations for this film.",
      likes: 456,
      isVerified: true,
    },
  ];

  // Modify reviews slightly based on movieId for variety
  return baseReviews.map((review) => ({
    ...review,
    id: review.id + movieId * 10,
    likes: review.likes + (movieId * 17) % 100,
    rating: Math.min(10, Math.max(5, review.rating + ((movieId % 3) - 1) * 0.5)),
  }));
};

// Review Card Component
const ReviewCard = ({
  review,
  index,
  theme,
  isDark,
}: {
  review: ReturnType<typeof generateReviews>[0];
  index: number;
  theme: ThemeColors;
  isDark: boolean;
}) => {
  const [liked, setLiked] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLiked(!liked);
    scale.value = withSpring(1.2);
    setTimeout(() => {
      scale.value = withSpring(1);
    }, 100);
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      style={{
        backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: isDark ? 0 : 1,
        borderColor: theme.border,
      }}
    >
      {/* User Info */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Image
          source={{ uri: review.avatar }}
          style={{ width: 48, height: 48, borderRadius: 24 }}
          contentFit="cover"
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={{ color: theme.text, fontWeight: "700", fontSize: 15 }}>
              {review.user}
            </Text>
            {review.isVerified && (
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
            )}
          </View>
          <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>
            {review.date}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(251, 191, 36, 0.2)",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 12,
          }}
        >
          <Ionicons name="star" size={14} color={Colors.star} />
          <Text style={{ color: Colors.star, fontWeight: "700", marginLeft: 4, fontSize: 14 }}>
            {review.rating.toFixed(1)}
          </Text>
        </View>
      </View>

      {/* Review Content */}
      <Text
        style={{
          color: theme.text,
          fontWeight: "700",
          fontSize: 16,
          marginBottom: 8,
        }}
      >
        {review.title}
      </Text>
      <Text
        style={{
          color: theme.textSecondary,
          fontSize: 14,
          lineHeight: 22,
          marginBottom: 16,
        }}
      >
        {review.content}
      </Text>

      {/* Actions */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        <TouchableOpacity
          onPress={handleLike}
          style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
        >
          <Animated.View style={animatedStyle}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={20}
              color={liked ? Colors.danger : theme.textSecondary}
            />
          </Animated.View>
          <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
            {liked ? review.likes + 1 : review.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
        >
          <Ionicons name="chatbubble-outline" size={18} color={theme.textSecondary} />
          <Text style={{ color: theme.textSecondary, fontSize: 13 }}>Reply</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
        >
          <Ionicons name="share-outline" size={18} color={theme.textSecondary} />
          <Text style={{ color: theme.textSecondary, fontSize: 13 }}>Share</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// Rating Distribution Bar
const RatingBar = ({
  label,
  percentage,
  theme,
}: {
  label: string;
  percentage: number;
  theme: ThemeColors;
}) => (
  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
    <Text style={{ color: theme.textSecondary, fontSize: 12, width: 20 }}>{label}</Text>
    <View
      style={{
        flex: 1,
        height: 8,
        backgroundColor: theme.backgroundTertiary,
        borderRadius: 4,
        marginHorizontal: 8,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${percentage}%`,
          height: "100%",
          backgroundColor: Colors.star,
          borderRadius: 4,
        }}
      />
    </View>
    <Text style={{ color: theme.textSecondary, fontSize: 12, width: 35 }}>{percentage}%</Text>
  </View>
);

export default function ReviewsScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const movieId = Number(params.id) || 1;

  const [newReview, setNewReview] = useState("");

  // Get movie info
  const movie = ALL_MOVIES.find((m) => m.id === movieId) || ALL_MOVIES[0];
  const reviews = generateReviews(movieId);

  // Calculate average rating
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

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
        style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}
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
            <Text style={{ color: theme.text, fontSize: 24, fontWeight: "900" }}>Reviews</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }} numberOfLines={1}>
              {movie.title}
            </Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Rating Summary */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            marginHorizontal: 20,
            marginBottom: 24,
            padding: 20,
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
            borderRadius: 24,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            {/* Average Rating */}
            <View style={{ alignItems: "center", marginRight: 24 }}>
              <Text style={{ color: theme.text, fontSize: 48, fontWeight: "900" }}>
                {avgRating.toFixed(1)}
              </Text>
              <View style={{ flexDirection: "row", marginTop: 4, marginBottom: 4 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= Math.round(avgRating / 2) ? "star" : "star-outline"}
                    size={16}
                    color={Colors.star}
                    style={{ marginHorizontal: 1 }}
                  />
                ))}
              </View>
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                {reviews.length} reviews
              </Text>
            </View>

            {/* Rating Distribution */}
            <View style={{ flex: 1 }}>
              <RatingBar label="5" percentage={45} theme={theme} />
              <RatingBar label="4" percentage={30} theme={theme} />
              <RatingBar label="3" percentage={15} theme={theme} />
              <RatingBar label="2" percentage={7} theme={theme} />
              <RatingBar label="1" percentage={3} theme={theme} />
            </View>
          </View>
        </Animated.View>

        {/* Write Review */}
        <Animated.View
          entering={FadeInDown.delay(150).springify()}
          style={{
            marginHorizontal: 20,
            marginBottom: 24,
            padding: 16,
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
            borderRadius: 20,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
              contentFit="cover"
            />
            <Text style={{ color: theme.text, fontWeight: "600", marginLeft: 12 }}>
              Write a review
            </Text>
          </View>
          <TextInput
            value={newReview}
            onChangeText={setNewReview}
            placeholder="Share your thoughts about this movie..."
            placeholderTextColor={theme.textMuted}
            multiline
            numberOfLines={3}
            style={{
              backgroundColor: isDark ? theme.backgroundTertiary : theme.backgroundSecondary,
              borderRadius: 12,
              padding: 12,
              color: theme.text,
              fontSize: 14,
              minHeight: 80,
              textAlignVertical: "top",
            }}
          />
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setNewReview("");
            }}
            style={{ marginTop: 12 }}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={{
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>Submit Review</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Reviews List */}
        <View style={{ paddingHorizontal: 20 }}>
          <Animated.View
            entering={FadeIn.delay(200)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: "800" }}>
              All Reviews
            </Text>
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                backgroundColor: theme.card,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: theme.textSecondary, fontSize: 13 }}>Most Helpful</Text>
              <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          </Animated.View>

          {reviews.map((review, index) => (
            <ReviewCard
              key={review.id}
              review={review}
              index={index}
              theme={theme}
              isDark={isDark}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
