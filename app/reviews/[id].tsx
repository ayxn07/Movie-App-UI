import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
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
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ALL_MOVIES, Colors } from "@/constants/data";
import { Review, useApp, useTheme } from "@/context";

const { height } = Dimensions.get("window");

// Review Card Component
const ReviewCard = ({
  review,
  index,
  onLike,
}: {
  review: Review;
  index: number;
  onLike: () => void;
}) => {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 80).springify()}
      style={[
        animatedStyle,
        {
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          borderRadius: 20,
          padding: 16,
          marginBottom: 16,
          borderWidth: isDark ? 0 : 1,
          borderColor: theme.border,
        },
      ]}
    >
      {/* User Info */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Image
          source={{ uri: review.userAvatar }}
          style={{ width: 48, height: 48, borderRadius: 24 }}
          contentFit="cover"
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ color: theme.text, fontWeight: "700", fontSize: 15 }}>{review.userName}</Text>
          <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>
            {formatDate(review.createdAt)}
          </Text>
        </View>
        {/* Rating */}
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: `${Colors.star}20`,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 12,
        }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Ionicons
              key={i}
              name={i < review.rating ? "star" : "star-outline"}
              size={14}
              color={Colors.star}
              style={{ marginRight: 2 }}
            />
          ))}
        </View>
      </View>

      {/* Review Title */}
      <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16, marginBottom: 8 }}>
        {review.title}
      </Text>

      {/* Review Content */}
      <Text style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 22, marginBottom: 12 }}>
        {review.content}
      </Text>

      {/* Actions */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onLike();
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 8,
            paddingHorizontal: 12,
            backgroundColor: review.isLiked ? `${theme.danger}20` : "transparent",
            borderRadius: 12,
          }}
        >
          <Ionicons
            name={review.isLiked ? "heart" : "heart-outline"}
            size={18}
            color={review.isLiked ? theme.danger : theme.textSecondary}
          />
          <Text style={{
            color: review.isLiked ? theme.danger : theme.textSecondary,
            fontSize: 13,
            fontWeight: "600",
            marginLeft: 6,
          }}>
            {review.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", padding: 8 }}>
          <Ionicons name="share-outline" size={18} color={theme.textSecondary} />
          <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "500", marginLeft: 6 }}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// Write Review Modal
const WriteReviewModal = ({
  visible,
  onClose,
  movieId,
}: {
  visible: boolean;
  onClose: () => void;
  movieId: number;
}) => {
  const { theme, isDark } = useTheme();
  const { addReview, showToast } = useApp();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      showToast("Please fill in all fields", "error");
      return;
    }

    addReview({
      movieId,
      userId: "me",
      userName: "You",
      userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating,
      title,
      content,
      likes: 0,
      isLiked: false,
    });

    showToast("Review submitted successfully!", "success");
    setTitle("");
    setContent("");
    setRating(5);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          entering={FadeInDown.springify()}
          style={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: 40,
            maxHeight: height * 0.7,
          }}
        >
          {/* Header */}
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
          }}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text }}>Write a Review</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ padding: 20 }}>
            {/* Rating */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: theme.text, fontWeight: "600", fontSize: 15, marginBottom: 12 }}>
                Your Rating
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "center", gap: 8 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setRating(i + 1);
                    }}
                  >
                    <Ionicons
                      name={i < rating ? "star" : "star-outline"}
                      size={36}
                      color={Colors.star}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Title */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: theme.text, fontWeight: "600", fontSize: 15, marginBottom: 8 }}>
                Review Title
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Summarize your review..."
                placeholderTextColor={theme.textMuted}
                style={{
                  backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(241, 245, 249, 0.9)",
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 15,
                  color: theme.text,
                }}
              />
            </View>

            {/* Content */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: theme.text, fontWeight: "600", fontSize: 15, marginBottom: 8 }}>
                Your Review
              </Text>
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Share your thoughts about this movie..."
                placeholderTextColor={theme.textMuted}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                style={{
                  backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(241, 245, 249, 0.9)",
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 15,
                  color: theme.text,
                  minHeight: 120,
                }}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity activeOpacity={0.9} onPress={handleSubmit}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={{
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>Submit Review</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default function ReviewsScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const movieId = Number(params.id);
  const { getReviewsForMovie, toggleReviewLike } = useApp();
  const [showWriteModal, setShowWriteModal] = useState(false);

  const movie = ALL_MOVIES.find((m) => m.id === movieId);
  const reviews = getReviewsForMovie(movieId);

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "N/A";

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background Gradient */}
      <LinearGradient
        colors={isDark ? ["#1e1b4b", "#0f172a", "#020617"] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Header */}
      <Animated.View entering={FadeInDown.springify()} style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20 }}>
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
            {movie && (
              <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }} numberOfLines={1}>
                {movie.title}
              </Text>
            )}
          </View>
        </View>

        {/* Stats */}
        <View style={{
          flexDirection: "row",
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          borderRadius: 20,
          padding: 16,
          borderWidth: isDark ? 0 : 1,
          borderColor: theme.border,
        }}>
          <View style={{ flex: 1, alignItems: "center", borderRightWidth: 1, borderRightColor: theme.border }}>
            <Text style={{ color: theme.text, fontSize: 32, fontWeight: "900" }}>{avgRating}</Text>
            <View style={{ flexDirection: "row", marginTop: 4 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < Math.round(Number(avgRating)) ? "star" : "star-outline"}
                  size={14}
                  color={Colors.star}
                />
              ))}
            </View>
            <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>Average Rating</Text>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ color: theme.text, fontSize: 32, fontWeight: "900" }}>{reviews.length}</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>Total Reviews</Text>
          </View>
        </View>
      </Animated.View>

      {/* Reviews List */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <ReviewCard
              key={review.id}
              review={review}
              index={index}
              onLike={() => toggleReviewLike(review.id)}
            />
          ))
        ) : (
          <Animated.View
            entering={FadeIn.delay(200)}
            style={{ alignItems: "center", paddingTop: 60 }}
          >
            <View style={{
              width: 100, height: 100, borderRadius: 50,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              alignItems: "center", justifyContent: "center", marginBottom: 20,
            }}>
              <Ionicons name="chatbubble-outline" size={48} color={theme.textMuted} />
            </View>
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "700", marginBottom: 8 }}>
              No reviews yet
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, textAlign: "center", paddingHorizontal: 40 }}>
              Be the first to share your thoughts about this movie!
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      {/* Write Review Button */}
      <Animated.View
        entering={FadeInDown.delay(300)}
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
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setShowWriteModal(true);
          }}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 16,
              borderRadius: 16,
            }}
          >
            <Ionicons name="create-outline" size={22} color="white" />
            <Text style={{ color: "white", fontWeight: "700", fontSize: 16, marginLeft: 8 }}>
              Write a Review
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Write Review Modal */}
      <WriteReviewModal
        visible={showWriteModal}
        onClose={() => setShowWriteModal(false)}
        movieId={movieId}
      />
    </View>
  );
}
