import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Dimensions,
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
  FadeInUp,
} from "react-native-reanimated";

import { Colors, MOVIES, ALL_MOVIES } from "@/constants/data";
import { useApp, useTheme } from "@/context";

const { width } = Dimensions.get("window");

// Friend Avatar Component
const FriendAvatar = ({
  image,
  name,
  index,
  isSelected,
  onSelect,
}: {
  image: string;
  name: string;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <Animated.View entering={FadeInRight.delay(index * 50).springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onSelect();
        }}
        style={{ alignItems: "center", marginRight: 16 }}
      >
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: image }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              borderWidth: isSelected ? 3 : 0,
              borderColor: Colors.primary,
            }}
            contentFit="cover"
          />
          {isSelected && (
            <View
              style={{
                position: "absolute",
                bottom: -4,
                right: -4,
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: Colors.success,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
          )}
        </View>
        <Text style={{ color: isSelected ? Colors.primary : "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 6 }}>
          {name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Movie Selection Card
const MovieSelectCard = ({
  movie,
  index,
  isSelected,
  onSelect,
}: {
  movie: typeof MOVIES[0];
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInUp.delay(index * 60).springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onSelect();
        }}
        style={{
          flexDirection: "row",
          backgroundColor: isSelected ? `${Colors.primary}20` : isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 12,
          borderWidth: isSelected ? 2 : 0,
          borderColor: Colors.primary,
        }}
      >
        <Image
          source={{ uri: movie.image }}
          style={{ width: 80, height: 110 }}
          contentFit="cover"
        />
        <View style={{ flex: 1, padding: 12 }}>
          <Text style={{ color: theme.text, fontSize: 15, fontWeight: "700" }} numberOfLines={1}>
            {movie.title}
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>
            {movie.genre} • {movie.duration}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
            <Ionicons name="star" size={12} color={Colors.star} />
            <Text style={{ color: Colors.star, fontSize: 12, fontWeight: "600", marginLeft: 4 }}>
              {movie.rating}
            </Text>
          </View>
        </View>
        {isSelected && (
          <View
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: Colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="checkmark" size={18} color="white" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Active Watch Party Card
const ActivePartyCard = ({
  host,
  hostImage,
  movie,
  viewers,
  onJoin,
}: {
  host: string;
  hostImage: string;
  movie: typeof MOVIES[0];
  viewers: number;
  onJoin: () => void;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInDown.springify()}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onJoin();
        }}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 24,
            overflow: "hidden",
          }}
        >
          <View style={{ flexDirection: "row", padding: 16 }}>
            <Image
              source={{ uri: movie.image }}
              style={{ width: 80, height: 110, borderRadius: 12 }}
              contentFit="cover"
            />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: Colors.success,
                    marginRight: 8,
                  }}
                />
                <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>LIVE NOW</Text>
              </View>
              <Text style={{ color: "white", fontSize: 16, fontWeight: "800" }} numberOfLines={1}>
                {movie.title}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                <Image
                  source={{ uri: hostImage }}
                  style={{ width: 24, height: 24, borderRadius: 12 }}
                  contentFit="cover"
                />
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginLeft: 8 }}>
                  Hosted by {host}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                <Ionicons name="people" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginLeft: 6 }}>
                  {viewers} watching
                </Text>
              </View>
            </View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="play" size={24} color="white" />
              </View>
              <Text style={{ color: "white", fontSize: 11, marginTop: 6, fontWeight: "600" }}>Join</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function WatchPartyScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { showToast } = useApp();
  const [step, setStep] = useState(1); // 1: Select friends, 2: Select movie, 3: Ready
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [partyName, setPartyName] = useState("");

  // Sample friends data
  const friends = [
    { id: "1", name: "John", image: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: "2", name: "Sarah", image: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: "3", name: "Mike", image: "https://randomuser.me/api/portraits/men/22.jpg" },
    { id: "4", name: "Emma", image: "https://randomuser.me/api/portraits/women/33.jpg" },
    { id: "5", name: "Alex", image: "https://randomuser.me/api/portraits/men/55.jpg" },
    { id: "6", name: "Lisa", image: "https://randomuser.me/api/portraits/women/66.jpg" },
  ];

  // Active watch parties
  const activeParties = [
    {
      id: "1",
      host: "Sarah",
      hostImage: "https://randomuser.me/api/portraits/women/44.jpg",
      movie: MOVIES[0],
      viewers: 5,
    },
    {
      id: "2",
      host: "Mike",
      hostImage: "https://randomuser.me/api/portraits/men/22.jpg",
      movie: MOVIES[2],
      viewers: 3,
    },
  ];

  const toggleFriend = (id: string) => {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleCreateParty = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    showToast("Watch Party created! Invites sent.", "success");
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <LinearGradient
        colors={isDark ? ["#1e1b4b", "#0f172a", "#020617"] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.springify()}
          style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}
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
              <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>Watch Party</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
                Watch together with friends
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Active Parties */}
        {activeParties.length > 0 && (
          <Animated.View entering={FadeIn.delay(100)} style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800", marginBottom: 16 }}>
              Active Parties
            </Text>
            {activeParties.map((party) => (
              <View key={party.id} style={{ marginBottom: 12 }}>
                <ActivePartyCard
                  host={party.host}
                  hostImage={party.hostImage}
                  movie={party.movie}
                  viewers={party.viewers}
                  onJoin={() => {
                    showToast(`Joining ${party.host}'s party...`, "info");
                    router.push(`/player/${party.movie.id}`);
                  }}
                />
              </View>
            ))}
          </Animated.View>
        )}

        {/* Create New Party */}
        <Animated.View entering={FadeIn.delay(200)} style={{ paddingHorizontal: 20 }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800", marginBottom: 16 }}>
            Create New Party
          </Text>

          {/* Step Indicator */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: step >= s ? Colors.primary : isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: step >= s ? "white" : theme.textMuted, fontWeight: "700" }}>
                    {s}
                  </Text>
                </View>
                {s < 3 && (
                  <View
                    style={{
                      width: 40,
                      height: 3,
                      backgroundColor: step > s ? Colors.primary : isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
                      marginHorizontal: 8,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </View>

          {/* Step 1: Select Friends */}
          {step === 1 && (
            <Animated.View entering={FadeIn}>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: "600", marginBottom: 16 }}>
                Select friends to invite
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {friends.map((friend, index) => (
                  <FriendAvatar
                    key={friend.id}
                    image={friend.image}
                    name={friend.name}
                    index={index}
                    isSelected={selectedFriends.includes(friend.id)}
                    onSelect={() => toggleFriend(friend.id)}
                  />
                ))}
              </ScrollView>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 20 }}>
                {selectedFriends.length} friends selected
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (selectedFriends.length > 0) {
                    setStep(2);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  } else {
                    showToast("Select at least one friend", "error");
                  }
                }}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={{
                    paddingVertical: 16,
                    borderRadius: 16,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
                    Continue
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Step 2: Select Movie */}
          {step === 2 && (
            <Animated.View entering={FadeIn}>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: "600", marginBottom: 16 }}>
                Choose a movie to watch
              </Text>
              {ALL_MOVIES.slice(0, 6).map((movie, index) => (
                <MovieSelectCard
                  key={movie.id}
                  movie={movie}
                  index={index}
                  isSelected={selectedMovie === movie.id}
                  onSelect={() => setSelectedMovie(movie.id)}
                />
              ))}
              <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
                <TouchableOpacity
                  onPress={() => {
                    setStep(1);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    borderRadius: 16,
                    alignItems: "center",
                    backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
                  }}
                >
                  <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16 }}>
                    Back
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (selectedMovie) {
                      setStep(3);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } else {
                      showToast("Select a movie", "error");
                    }
                  }}
                  style={{ flex: 2 }}
                >
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={{
                      paddingVertical: 16,
                      borderRadius: 16,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
                      Continue
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* Step 3: Party Settings */}
          {step === 3 && (
            <Animated.View entering={FadeIn}>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: "600", marginBottom: 16 }}>
                Party Settings
              </Text>
              <View
                style={{
                  backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <Text style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 8 }}>
                  Party Name (optional)
                </Text>
                <TextInput
                  placeholder="Movie Night with Friends"
                  placeholderTextColor={theme.textMuted}
                  value={partyName}
                  onChangeText={setPartyName}
                  style={{
                    backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)",
                    borderRadius: 12,
                    padding: 14,
                    color: theme.text,
                    fontSize: 15,
                  }}
                />
              </View>

              {/* Summary */}
              <View
                style={{
                  backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 24,
                }}
              >
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: "700", marginBottom: 12 }}>
                  Summary
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                  <Ionicons name="people" size={18} color={theme.primary} />
                  <Text style={{ color: theme.textSecondary, marginLeft: 10, fontSize: 14 }}>
                    {selectedFriends.length} friends invited
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="film" size={18} color={theme.primary} />
                  <Text style={{ color: theme.textSecondary, marginLeft: 10, fontSize: 14 }}>
                    {ALL_MOVIES.find((m) => m.id === selectedMovie)?.title}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  onPress={() => {
                    setStep(2);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    borderRadius: 16,
                    alignItems: "center",
                    backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
                  }}
                >
                  <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16 }}>
                    Back
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCreateParty} style={{ flex: 2 }}>
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={{
                      paddingVertical: 16,
                      borderRadius: 16,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <Ionicons name="rocket" size={20} color="white" />
                    <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
                      Start Party
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
