import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
} from "react-native-reanimated";

import { ALL_MOVIES, Colors } from "@/constants/data";
import { useApp, useTheme } from "@/context";

// Quality options with file sizes
const QUALITY_OPTIONS = [
  { id: "4k", label: "4K Ultra HD", size: "8.5 GB", badge: "BEST", resolution: "3840x2160" },
  { id: "1080p", label: "Full HD", size: "4.2 GB", badge: null, resolution: "1920x1080" },
  { id: "720p", label: "HD", size: "2.1 GB", badge: "RECOMMENDED", resolution: "1280x720" },
  { id: "480p", label: "SD", size: "1.0 GB", badge: null, resolution: "854x480" },
];

// Language options
const LANGUAGE_OPTIONS = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
];

// Subtitle options
const SUBTITLE_OPTIONS = [
  { code: "none", name: "No Subtitles" },
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
];

export default function DownloadScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const movieId = Number(params.id);
  const { showToast } = useApp();

  const [selectedQuality, setSelectedQuality] = useState("720p");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedSubtitle, setSelectedSubtitle] = useState("en");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const downloadIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const movie = ALL_MOVIES.find((m) => m.id === movieId);
  const selectedQualityData = QUALITY_OPTIONS.find((q) => q.id === selectedQuality);
  const selectedLanguageData = LANGUAGE_OPTIONS.find((l) => l.code === selectedLanguage);
  const selectedSubtitleData = SUBTITLE_OPTIONS.find((s) => s.code === selectedSubtitle);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (downloadIntervalRef.current) {
        clearInterval(downloadIntervalRef.current);
      }
    };
  }, []);

  const handleDownload = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsDownloading(true);

    // Simulate download progress
    downloadIntervalRef.current = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          if (downloadIntervalRef.current) {
            clearInterval(downloadIntervalRef.current);
            downloadIntervalRef.current = null;
          }
          setIsDownloading(false);
          showToast("Download complete!", "success");
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  if (!movie) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, alignItems: "center", justifyContent: "center" }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Ionicons name="film-outline" size={64} color={theme.textMuted} />
        <Text style={{ color: theme.text, fontSize: 20, fontWeight: "700", marginTop: 16 }}>Movie Not Found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 24, backgroundColor: theme.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
            <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>Download</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
              Choose your preferences
            </Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Movie Preview Card */}
        <Animated.View entering={FadeIn.delay(100)}>
          <View style={{
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 20,
            padding: 16,
            marginBottom: 24,
            flexDirection: "row",
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}>
            <Image
              source={{ uri: movie.image }}
              style={{ width: 100, height: 150, borderRadius: 12 }}
              contentFit="cover"
            />
            <View style={{ flex: 1, marginLeft: 16, justifyContent: "center" }}>
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
                {movie.title}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="star" size={14} color={Colors.star} />
                  <Text style={{ color: Colors.star, fontWeight: "600", marginLeft: 4 }}>{movie.rating}</Text>
                </View>
                <Text style={{ color: theme.textSecondary }}>{movie.year}</Text>
                <Text style={{ color: theme.textSecondary }}>{movie.duration}</Text>
              </View>
              <View style={{
                backgroundColor: `${theme.primary}20`,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
                alignSelf: "flex-start",
              }}>
                <Text style={{ color: theme.primary, fontWeight: "600", fontSize: 12 }}>{movie.genre}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Quality Selection */}
        <Animated.View entering={FadeInUp.delay(200)}>
          <Text style={{ color: theme.textSecondary, fontWeight: "600", fontSize: 14, marginBottom: 12 }}>
            Video Quality
          </Text>
          <View style={{
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 24,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}>
            {QUALITY_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedQuality(option.id);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  borderBottomWidth: index < QUALITY_OPTIONS.length - 1 ? 1 : 0,
                  borderBottomColor: theme.border,
                  backgroundColor: selectedQuality === option.id ? `${theme.primary}10` : "transparent",
                }}
              >
                <View style={{
                  width: 24, height: 24, borderRadius: 12,
                  borderWidth: 2,
                  borderColor: selectedQuality === option.id ? theme.primary : theme.textMuted,
                  alignItems: "center", justifyContent: "center", marginRight: 14,
                }}>
                  {selectedQuality === option.id && (
                    <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: theme.primary }} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={{ color: theme.text, fontWeight: "600", fontSize: 16 }}>{option.label}</Text>
                    {option.badge && (
                      <View style={{
                        backgroundColor: option.badge === "BEST" ? Colors.success : theme.primary,
                        paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
                      }}>
                        <Text style={{ color: "white", fontSize: 10, fontWeight: "700" }}>{option.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                    {option.resolution} • {option.size}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Language Selection */}
        <Animated.View entering={FadeInUp.delay(300)}>
          <Text style={{ color: theme.textSecondary, fontWeight: "600", fontSize: 14, marginBottom: 12 }}>
            Audio Language
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 24 }}
            contentContainerStyle={{ gap: 12 }}
          >
            {LANGUAGE_OPTIONS.map((option, index) => (
              <Animated.View key={option.code} entering={FadeInRight.delay(index * 50)}>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedLanguage(option.code);
                  }}
                  style={{
                    backgroundColor: selectedLanguage === option.code
                      ? theme.primary
                      : isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                    borderRadius: 16,
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    borderWidth: selectedLanguage === option.code ? 0 : 1,
                    borderColor: theme.border,
                  }}
                >
                  <Text style={{ fontSize: 20 }}>{option.flag}</Text>
                  <Text style={{
                    color: selectedLanguage === option.code ? "white" : theme.text,
                    fontWeight: "600",
                  }}>
                    {option.name}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Subtitle Selection */}
        <Animated.View entering={FadeInUp.delay(400)}>
          <Text style={{ color: theme.textSecondary, fontWeight: "600", fontSize: 14, marginBottom: 12 }}>
            Subtitles
          </Text>
          <View style={{
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 24,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}>
            {SUBTITLE_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={option.code}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedSubtitle(option.code);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  borderBottomWidth: index < SUBTITLE_OPTIONS.length - 1 ? 1 : 0,
                  borderBottomColor: theme.border,
                  backgroundColor: selectedSubtitle === option.code ? `${theme.primary}10` : "transparent",
                }}
              >
                <Text style={{
                  flex: 1,
                  color: theme.text,
                  fontWeight: selectedSubtitle === option.code ? "600" : "400",
                  fontSize: 15,
                }}>
                  {option.name}
                </Text>
                {selectedSubtitle === option.code && (
                  <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Download Summary */}
        <Animated.View entering={FadeIn.delay(500)}>
          <View style={{
            backgroundColor: `${theme.primary}10`,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: `${theme.primary}30`,
          }}>
            <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16, marginBottom: 12 }}>
              Download Summary
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
              <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Quality</Text>
              <Text style={{ color: theme.text, fontWeight: "600", fontSize: 14 }}>{selectedQualityData?.label}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
              <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Audio</Text>
              <Text style={{ color: theme.text, fontWeight: "600", fontSize: 14 }}>
                {selectedLanguageData?.flag} {selectedLanguageData?.name}
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
              <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Subtitles</Text>
              <Text style={{ color: theme.text, fontWeight: "600", fontSize: 14 }}>{selectedSubtitleData?.name}</Text>
            </View>
            <View style={{
              height: 1,
              backgroundColor: theme.border,
              marginVertical: 12,
            }} />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16 }}>Total Size</Text>
              <Text style={{ color: theme.primary, fontWeight: "800", fontSize: 16 }}>{selectedQualityData?.size}</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Download Button */}
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
        {isDownloading ? (
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <Text style={{ color: theme.text, fontWeight: "600" }}>Downloading...</Text>
              <Text style={{ color: theme.primary, fontWeight: "700" }}>{downloadProgress}%</Text>
            </View>
            <View style={{
              height: 8,
              backgroundColor: isDark ? "#334155" : "#e2e8f0",
              borderRadius: 4,
              overflow: "hidden",
            }}>
              <View style={{
                height: "100%",
                width: `${downloadProgress}%`,
                backgroundColor: theme.primary,
                borderRadius: 4,
              }} />
            </View>
          </View>
        ) : (
          <TouchableOpacity onPress={handleDownload}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 18,
                borderRadius: 16,
                gap: 10,
              }}
            >
              <Ionicons name="download" size={24} color="white" />
              <Text style={{ color: "white", fontWeight: "700", fontSize: 18 }}>
                Download Movie
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}
