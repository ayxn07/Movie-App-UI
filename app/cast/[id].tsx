import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Dimensions,
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
} from "react-native-reanimated";

import { ALL_MOVIES, Colors, MOVIE_CAST_DATA, type CastMember } from "@/constants/data";
import { ThemeColors, useTheme } from "@/context";

const { width } = Dimensions.get("window");

// Tab types
type TabType = "cast" | "crew";

// Crew member interface
interface CrewMember {
  name: string;
  role: string;
  image?: string;
}

// Cast Card Component (Grid Style)
const CastGridCard = ({
  cast,
  index,
  theme,
  isDark,
  onPress,
}: {
  cast: CastMember;
  index: number;
  theme: ThemeColors;
  isDark: boolean;
  onPress: () => void;
}) => (
  <Animated.View
    entering={FadeInUp.delay(index * 50).springify()}
    style={{
      width: (width - 60) / 2,
      marginBottom: 16,
      marginRight: index % 2 === 0 ? 20 : 0,
    }}
  >
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      activeOpacity={0.9}
      style={{
        backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: isDark ? 0 : 1,
        borderColor: theme.border,
      }}
    >
      <Image
        source={{ uri: cast.image }}
        style={{ width: "100%", height: 180 }}
        contentFit="cover"
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.6)"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 180 }}
      />
      <View style={{ padding: 14 }}>
        <Text style={{
          color: theme.text,
          fontSize: 15,
          fontWeight: "700",
          marginBottom: 4,
        }} numberOfLines={1}>
          {cast.name}
        </Text>
        <Text style={{
          color: theme.textSecondary,
          fontSize: 12,
        }} numberOfLines={1}>
          as {cast.role}
        </Text>
      </View>
    </TouchableOpacity>
  </Animated.View>
);

// Crew Card Component
const CrewCard = ({
  crew,
  index,
  theme,
  isDark,
}: {
  crew: CrewMember;
  index: number;
  theme: ThemeColors;
  isDark: boolean;
}) => (
  <Animated.View
    entering={SlideInRight.delay(index * 60).springify()}
    style={{ marginBottom: 12 }}
  >
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
      borderRadius: 16,
      padding: 14,
      borderWidth: isDark ? 0 : 1,
      borderColor: theme.border,
    }}>
      <View style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.1)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
      }}>
        <Ionicons name="person" size={24} color={theme.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{
          color: theme.text,
          fontSize: 15,
          fontWeight: "700",
          marginBottom: 2,
        }}>
          {crew.name}
        </Text>
        <Text style={{
          color: theme.textSecondary,
          fontSize: 13,
        }}>
          {crew.role}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.1)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="chevron-forward" size={18} color={theme.primary} />
      </TouchableOpacity>
    </View>
  </Animated.View>
);

// Tab Button Component
const TabButton = ({
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
    style={{
      flex: 1,
      paddingVertical: 14,
      alignItems: "center",
      borderBottomWidth: 2,
      borderBottomColor: isActive ? theme.primary : "transparent",
    }}
  >
    <Text style={{
      color: isActive ? theme.primary : theme.textSecondary,
      fontSize: 15,
      fontWeight: isActive ? "700" : "600",
    }}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function CastScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const movieId = Number(params.id);

  const movie = ALL_MOVIES.find((m) => m.id === movieId);
  const movieData = MOVIE_CAST_DATA[movieId];

  const [activeTab, setActiveTab] = useState<TabType>("cast");

  // Generate crew data from movie data
  const crewMembers: CrewMember[] = movieData
    ? [
        { name: movieData.director, role: "Director" },
        ...movieData.writers.split(", ").map((writer) => ({
          name: writer,
          role: "Writer",
        })),
        { name: "John Williams", role: "Composer" },
        { name: "Roger Deakins", role: "Cinematographer" },
        { name: "Joe Walker", role: "Editor" },
        { name: "Patrice Vermette", role: "Production Designer" },
      ]
    : [];

  if (!movie || !movieData) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, alignItems: "center", justifyContent: "center" }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Ionicons name="people-outline" size={64} color={theme.textMuted} />
        <Text style={{ color: theme.text, fontSize: 20, fontWeight: "700", marginTop: 16 }}>
          Cast Not Found
        </Text>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
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
          paddingBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
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
            <Text style={{ color: theme.text, fontSize: 24, fontWeight: "900" }}>
              Cast & Crew
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }} numberOfLines={1}>
              {movie.title}
            </Text>
          </View>
        </View>

        {/* Movie Info Card */}
        <Animated.View
          entering={FadeIn.delay(100)}
          style={{
            flexDirection: "row",
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 16,
            padding: 12,
            marginBottom: 16,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}
        >
          <Image
            source={{ uri: movie.image }}
            style={{ width: 60, height: 90, borderRadius: 12 }}
            contentFit="cover"
          />
          <View style={{ flex: 1, marginLeft: 14, justifyContent: "center" }}>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: "700", marginBottom: 4 }}>
              {movie.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(251, 191, 36, 0.2)",
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 6,
              }}>
                <Ionicons name="star" size={12} color={Colors.star} />
                <Text style={{ color: Colors.star, fontSize: 12, fontWeight: "700", marginLeft: 4 }}>
                  {movie.rating}
                </Text>
              </View>
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{movie.year}</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{movie.duration}</Text>
            </View>
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>
              Directed by {movieData.director}
            </Text>
          </View>
        </Animated.View>

        {/* Tabs */}
        <View style={{
          flexDirection: "row",
          backgroundColor: isDark ? "rgba(30, 41, 59, 0.4)" : "rgba(241, 245, 249, 0.6)",
          borderRadius: 12,
          marginBottom: 8,
        }}>
          <TabButton
            label={`Cast (${movieData.cast.length})`}
            isActive={activeTab === "cast"}
            onPress={() => setActiveTab("cast")}
            theme={theme}
          />
          <TabButton
            label={`Crew (${crewMembers.length})`}
            isActive={activeTab === "crew"}
            onPress={() => setActiveTab("crew")}
            theme={theme}
          />
        </View>
      </Animated.View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {activeTab === "cast" ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {movieData.cast.map((cast, index) => (
              <CastGridCard
                key={cast.name}
                cast={cast}
                index={index}
                theme={theme}
                isDark={isDark}
                onPress={() => {
                  // Could navigate to actor detail screen
                }}
              />
            ))}
          </View>
        ) : (
          <View>
            {crewMembers.map((crew, index) => (
              <CrewCard
                key={crew.name + crew.role}
                crew={crew}
                index={index}
                theme={theme}
                isDark={isDark}
              />
            ))}
          </View>
        )}

        {/* Additional Info */}
        <Animated.View
          entering={FadeInUp.delay(300)}
          style={{
            marginTop: 24,
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 20,
            padding: 20,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}
        >
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "800", marginBottom: 16 }}>
            Production Info
          </Text>
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Studio</Text>
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: "600" }}>{movieData.studio}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Budget</Text>
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: "600" }}>{movieData.budget}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Box Office</Text>
              <Text style={{ color: theme.success, fontSize: 14, fontWeight: "600" }}>{movieData.boxOffice}</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
