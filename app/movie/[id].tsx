import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Dimensions,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    SlideInRight,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

import { ALL_MOVIES, Colors } from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";

const { height } = Dimensions.get("window");

// Type definitions for selection options
interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

interface SubtitleOption {
  code: string;
  name: string;
}

interface QualityOption {
  value: string;
  label: string;
  badge: string | null;
}

type SelectionOption = LanguageOption | SubtitleOption | QualityOption;

// Cast member type
interface CastMember {
  name: string;
  role: string;
  image: string;
}

// Language options
const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
];

// Subtitle options
const SUBTITLES: SubtitleOption[] = [
  { code: "off", name: "Off" },
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
];

// Quality options
const QUALITY_OPTIONS: QualityOption[] = [
  { value: "4k", label: "4K Ultra HD", badge: "BEST" },
  { value: "1080p", label: "Full HD 1080p", badge: null },
  { value: "720p", label: "HD 720p", badge: null },
  { value: "480p", label: "SD 480p", badge: null },
];

// Generic placeholder cast data
const DEFAULT_CAST: CastMember[] = [
  { name: "Lead Actor", role: "Main Character", image: "https://randomuser.me/api/portraits/men/1.jpg" },
  { name: "Supporting Actor", role: "Supporting Role", image: "https://randomuser.me/api/portraits/women/1.jpg" },
  { name: "Actor 3", role: "Character 3", image: "https://randomuser.me/api/portraits/women/2.jpg" },
  { name: "Actor 4", role: "Character 4", image: "https://randomuser.me/api/portraits/men/2.jpg" },
  { name: "Actor 5", role: "Character 5", image: "https://randomuser.me/api/portraits/men/3.jpg" },
];

// Selection Modal Component
const SelectionModal = ({
  visible,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
  theme,
  isDark,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: SelectionOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  theme: ThemeColors;
  isDark: boolean;
}) => (
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
          maxHeight: height * 0.6,
        }}
      >
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}>
          <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text }}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
        <ScrollView style={{ maxHeight: height * 0.5 }}>
          {options.map((option) => {
            // Handle different option types
            const value = "code" in option ? option.code : "value" in option ? option.value : "";
            const label = "name" in option ? option.name : "label" in option ? option.label : "";
            const flag = "flag" in option ? option.flag : undefined;
            const badge = "badge" in option ? option.badge : undefined;
            const isSelected = selectedValue === value;

            return (
              <TouchableOpacity
                key={value}
                onPress={() => {
                  onSelect(value);
                  onClose();
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  backgroundColor: isSelected
                    ? isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.1)"
                    : "transparent",
                }}
              >
                {flag && (
                  <Text style={{ fontSize: 24, marginRight: 12 }}>{flag}</Text>
                )}
                <Text style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: isSelected ? "700" : "500",
                  color: isSelected ? theme.primary : theme.text,
                }}>
                  {label}
                </Text>
                {badge && (
                  <View style={{
                    backgroundColor: theme.primary,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                    marginRight: 12,
                  }}>
                    <Text style={{ color: "white", fontSize: 10, fontWeight: "800" }}>{badge}</Text>
                  </View>
                )}
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>
    </View>
  </Modal>
);

// Cast Card Component
const CastCard = ({ cast, index, theme }: { cast: CastMember; index: number; theme: ThemeColors }) => (
  <Animated.View
    entering={SlideInRight.delay(index * 80).springify()}
    style={{ marginRight: 16, alignItems: "center" }}
  >
    <View style={{
      width: 80,
      height: 80,
      borderRadius: 40,
      overflow: "hidden",
      borderWidth: 2,
      borderColor: theme.primary,
      marginBottom: 8,
    }}>
      <Image
        source={{ uri: cast.image }}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
      />
    </View>
    <Text style={{ color: theme.text, fontWeight: "600", fontSize: 12, textAlign: "center" }} numberOfLines={1}>
      {cast.name}
    </Text>
    <Text style={{ color: theme.textSecondary, fontSize: 11, textAlign: "center" }} numberOfLines={1}>
      {cast.role}
    </Text>
  </Animated.View>
);

// Action Button Component
const ActionButton = ({
  icon,
  label,
  onPress,
  theme,
  isDark,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  theme: ThemeColors;
  isDark: boolean;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.9); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={{
          alignItems: "center",
          padding: 12,
        }}
      >
        <View style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.15)",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}>
          <Ionicons name={icon as any} size={24} color={theme.primary} />
        </View>
        <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "500" }}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function MovieDetailScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const movieId = Number(params.id);

  // Find the movie from our data
  const movie = ALL_MOVIES.find((m) => m.id === movieId);

  // State for selections
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedSubtitle, setSelectedSubtitle] = useState("en");
  const [selectedQuality, setSelectedQuality] = useState("1080p");
  const [liked, setLiked] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showSubtitleModal, setShowSubtitleModal] = useState(false);
  const [showQualityModal, setShowQualityModal] = useState(false);

  const selectedLanguageData = LANGUAGES.find((l) => l.code === selectedLanguage);
  const selectedSubtitleData = SUBTITLES.find((s) => s.code === selectedSubtitle);
  const selectedQualityData = QUALITY_OPTIONS.find((q) => q.value === selectedQuality);

  // Handle movie not found
  if (!movie) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, alignItems: "center", justifyContent: "center" }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Ionicons name="film-outline" size={64} color={theme.textMuted} />
        <Text style={{ color: theme.text, fontSize: 20, fontWeight: "700", marginTop: 16 }}>Movie Not Found</Text>
        <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 8 }}>The requested movie could not be found.</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginTop: 24,
            backgroundColor: theme.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Image Section */}
        <View style={{ height: height * 0.55, position: "relative" }}>
          <Image
            source={{ uri: movie.image }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.3)", theme.background]}
            locations={[0, 0.5, 1]}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Header Buttons */}
          <View style={{
            position: "absolute",
            top: 50,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(0,0,0,0.5)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setLiked(!liked)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={24}
                  color={liked ? Colors.danger : "white"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="share-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Play Button Overlay */}
          <Animated.View
            entering={FadeIn.delay(300)}
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              marginLeft: -40,
              marginTop: -40,
            }}
          >
            <TouchableOpacity
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "rgba(139, 92, 246, 0.9)",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#8b5cf6",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <Ionicons name="play" size={36} color="white" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Movie Info Section */}
        <View style={{ paddingHorizontal: 20, marginTop: -40 }}>
          {/* Title and Rating */}
          <Animated.View entering={FadeInUp.delay(100).springify()}>
            <Text style={{ fontSize: 32, fontWeight: "900", color: theme.text, marginBottom: 12 }}>
              {movie.title}
            </Text>

            {/* Badges Row */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(251, 191, 36, 0.2)",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}>
                <Ionicons name="star" size={16} color={Colors.star} />
                <Text style={{ color: Colors.star, fontWeight: "700", marginLeft: 6 }}>{movie.rating}</Text>
              </View>
              <View style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}>
                <Text style={{ color: theme.text, fontWeight: "600" }}>{movie.year}</Text>
              </View>
              <View style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}>
                <Text style={{ color: theme.text, fontWeight: "600" }}>{movie.duration}</Text>
              </View>
              <View style={{
                backgroundColor: theme.primary,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}>
                <Text style={{ color: "white", fontWeight: "700" }}>{movie.genre}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View
            entering={FadeInUp.delay(150).springify()}
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginBottom: 24,
              paddingVertical: 16,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : "rgba(241, 245, 249, 0.9)",
              borderRadius: 20,
            }}
          >
            <ActionButton icon="download-outline" label="Download" onPress={() => {}} theme={theme} isDark={isDark} />
            <ActionButton icon="add" label="My List" onPress={() => {}} theme={theme} isDark={isDark} />
            <ActionButton icon="share-social-outline" label="Share" onPress={() => {}} theme={theme} isDark={isDark} />
            <ActionButton icon="chatbubble-outline" label="Reviews" onPress={() => {}} theme={theme} isDark={isDark} />
          </Animated.View>

          {/* Playback Settings */}
          <Animated.View entering={FadeInUp.delay(200).springify()}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text, marginBottom: 16 }}>
              Playback Settings
            </Text>

            {/* Language Selection */}
            <TouchableOpacity
              onPress={() => setShowLanguageModal(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
                padding: 16,
                borderRadius: 16,
                marginBottom: 12,
                borderWidth: isDark ? 0 : 1,
                borderColor: theme.border,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 14,
                }}>
                  <Ionicons name="language" size={22} color={theme.primary} />
                </View>
                <View>
                  <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 2 }}>Audio Language</Text>
                  <Text style={{ color: theme.text, fontSize: 16, fontWeight: "600" }}>
                    {selectedLanguageData?.flag} {selectedLanguageData?.name}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </TouchableOpacity>

            {/* Subtitle Selection */}
            <TouchableOpacity
              onPress={() => setShowSubtitleModal(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
                padding: 16,
                borderRadius: 16,
                marginBottom: 12,
                borderWidth: isDark ? 0 : 1,
                borderColor: theme.border,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: isDark ? "rgba(236, 72, 153, 0.2)" : "rgba(236, 72, 153, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 14,
                }}>
                  <Ionicons name="text" size={22} color={theme.secondary} />
                </View>
                <View>
                  <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 2 }}>Subtitles</Text>
                  <Text style={{ color: theme.text, fontSize: 16, fontWeight: "600" }}>
                    {selectedSubtitleData?.name}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </TouchableOpacity>

            {/* Quality Selection */}
            <TouchableOpacity
              onPress={() => setShowQualityModal(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
                padding: 16,
                borderRadius: 16,
                marginBottom: 24,
                borderWidth: isDark ? 0 : 1,
                borderColor: theme.border,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: isDark ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 14,
                }}>
                  <Ionicons name="settings-outline" size={22} color={theme.success} />
                </View>
                <View>
                  <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 2 }}>Video Quality</Text>
                  <Text style={{ color: theme.text, fontSize: 16, fontWeight: "600" }}>
                    {selectedQualityData?.label}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInUp.delay(250).springify()}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text, marginBottom: 12 }}>
              Storyline
            </Text>
            <Text style={{
              color: theme.textSecondary,
              fontSize: 15,
              lineHeight: 24,
              marginBottom: 24,
            }}>
              {movie.description || "No description available."}
            </Text>
          </Animated.View>

          {/* Cast Section */}
          <Animated.View entering={FadeInUp.delay(300).springify()}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text }}>
                Cast & Crew
              </Text>
              <TouchableOpacity>
                <Text style={{ color: theme.primary, fontWeight: "600" }}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {DEFAULT_CAST.map((cast, index) => (
                <CastCard key={cast.name} cast={cast} index={index} theme={theme} />
              ))}
            </ScrollView>
          </Animated.View>

          {/* Movie Details Grid */}
          <Animated.View
            entering={FadeInUp.delay(350).springify()}
            style={{ marginTop: 32 }}
          >
            <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text, marginBottom: 16 }}>
              More Details
            </Text>
            <View style={{
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              borderRadius: 20,
              padding: 20,
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}>
              <View style={{ flexDirection: "row", marginBottom: 16 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 4 }}>Director</Text>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "600" }}>Denis Villeneuve</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 4 }}>Writers</Text>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "600" }}>Jon Spaihts</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", marginBottom: 16 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 4 }}>Studio</Text>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "600" }}>Warner Bros.</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 4 }}>Budget</Text>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "600" }}>$190 Million</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 4 }}>Release Date</Text>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "600" }}>March 1, {movie.year}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 4 }}>Box Office</Text>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "600" }}>$711 Million</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <Animated.View
        entering={FadeInUp.delay(400)}
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
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
              paddingVertical: 16,
              borderRadius: 16,
              borderWidth: isDark ? 0 : 1,
              borderColor: theme.border,
            }}
          >
            <Ionicons name="play-circle-outline" size={24} color={theme.primary} />
            <Text style={{ color: theme.primary, fontWeight: "700", fontSize: 16, marginLeft: 8 }}>
              Trailer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 2 }}
            activeOpacity={0.9}
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
              <Ionicons name="play" size={24} color="white" />
              <Text style={{ color: "white", fontWeight: "700", fontSize: 16, marginLeft: 8 }}>
                Watch Now
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Modals */}
      <SelectionModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        title="Audio Language"
        options={LANGUAGES}
        selectedValue={selectedLanguage}
        onSelect={setSelectedLanguage}
        theme={theme}
        isDark={isDark}
      />
      <SelectionModal
        visible={showSubtitleModal}
        onClose={() => setShowSubtitleModal(false)}
        title="Subtitles"
        options={SUBTITLES}
        selectedValue={selectedSubtitle}
        onSelect={setSelectedSubtitle}
        theme={theme}
        isDark={isDark}
      />
      <SelectionModal
        visible={showQualityModal}
        onClose={() => setShowQualityModal(false)}
        title="Video Quality"
        options={QUALITY_OPTIONS}
        selectedValue={selectedQuality}
        onSelect={setSelectedQuality}
        theme={theme}
        isDark={isDark}
      />
    </View>
  );
}
