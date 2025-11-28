import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useTheme } from "@/context";

// Mock user data
const USERS: Record<string, { name: string; avatar: string; isOnline: boolean }> = {
  "1": {
    name: "Emma Wilson",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    isOnline: true,
  },
  "2": {
    name: "James Rodriguez",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    isOnline: true,
  },
  "3": {
    name: "Sophia Chen",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    isOnline: false,
  },
  "4": {
    name: "Michael Brown",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    isOnline: true,
  },
  "5": {
    name: "Olivia Taylor",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    isOnline: false,
  },
};

// Message type
interface Message {
  id: string;
  text?: string;
  image?: string;
  isMe: boolean;
  timestamp: string;
  type: "text" | "image" | "movie";
  movieData?: {
    title: string;
    image: string;
    rating: number;
  };
}

// Initial messages
const getInitialMessages = (userId: string): Message[] => [
  {
    id: "1",
    text: "Hey! Have you watched Dune Part Two yet? 🎬",
    isMe: false,
    timestamp: "10:30 AM",
    type: "text",
  },
  {
    id: "2",
    text: "Not yet! Is it good?",
    isMe: true,
    timestamp: "10:32 AM",
    type: "text",
  },
  {
    id: "3",
    text: "It's amazing! The visuals are incredible. You should definitely watch it.",
    isMe: false,
    timestamp: "10:33 AM",
    type: "text",
  },
  {
    id: "4",
    type: "movie",
    isMe: false,
    timestamp: "10:34 AM",
    movieData: {
      title: "Dune: Part Two",
      image: "https://m.media-amazon.com/images/I/81Rrx-Bv+6L.jpg",
      rating: 8.8,
    },
  },
  {
    id: "5",
    text: "Wow, the rating is really high! I'll add it to my list 📋",
    isMe: true,
    timestamp: "10:35 AM",
    type: "text",
  },
];

// Message Bubble Component
const MessageBubble = ({
  message,
  theme,
  isDark,
  onMoviePress,
}: {
  message: Message;
  theme: ReturnType<typeof useTheme>["theme"];
  isDark: boolean;
  onMoviePress?: () => void;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (message.type === "movie" && message.movieData) {
    return (
      <Animated.View
        entering={FadeInUp.springify()}
        style={{
          alignSelf: message.isMe ? "flex-end" : "flex-start",
          maxWidth: "75%",
          marginBottom: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onMoviePress?.();
          }}
          activeOpacity={0.9}
        >
          <View
            style={{
              backgroundColor: message.isMe
                ? theme.primary
                : isDark
                ? "rgba(30, 41, 59, 0.9)"
                : theme.card,
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: message.movieData.image }}
              style={{ width: 200, height: 120 }}
              contentFit="cover"
            />
            <View style={{ padding: 12 }}>
              <Text
                style={{
                  color: message.isMe ? "white" : theme.text,
                  fontWeight: "700",
                  fontSize: 14,
                }}
                numberOfLines={1}
              >
                {message.movieData.title}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 6,
                }}
              >
                <Ionicons name="star" size={12} color={Colors.star} />
                <Text
                  style={{
                    color: Colors.star,
                    fontSize: 12,
                    fontWeight: "600",
                    marginLeft: 4,
                  }}
                >
                  {message.movieData.rating}
                </Text>
                <Text
                  style={{
                    color: message.isMe ? "rgba(255,255,255,0.7)" : theme.textSecondary,
                    fontSize: 12,
                    marginLeft: 8,
                  }}
                >
                  Tap to view
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <Text
          style={{
            color: theme.textMuted,
            fontSize: 11,
            marginTop: 4,
            alignSelf: message.isMe ? "flex-end" : "flex-start",
          }}
        >
          {message.timestamp}
        </Text>
      </Animated.View>
    );
  }

  if (message.type === "image" && message.image) {
    return (
      <Animated.View
        entering={FadeInUp.springify()}
        style={{
          alignSelf: message.isMe ? "flex-end" : "flex-start",
          maxWidth: "75%",
          marginBottom: 12,
        }}
      >
        <View
          style={{
            backgroundColor: message.isMe
              ? theme.primary
              : isDark
              ? "rgba(30, 41, 59, 0.9)"
              : theme.card,
            borderRadius: 20,
            padding: 4,
          }}
        >
          <Image
            source={{ uri: message.image }}
            style={{ width: 200, height: 200, borderRadius: 16 }}
            contentFit="cover"
          />
        </View>
        <Text
          style={{
            color: theme.textMuted,
            fontSize: 11,
            marginTop: 4,
            alignSelf: message.isMe ? "flex-end" : "flex-start",
          }}
        >
          {message.timestamp}
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInUp.springify()}
      style={[
        animatedStyle,
        {
          alignSelf: message.isMe ? "flex-end" : "flex-start",
          maxWidth: "75%",
          marginBottom: 12,
        },
      ]}
    >
      <View
        style={{
          backgroundColor: message.isMe
            ? theme.primary
            : isDark
            ? "rgba(30, 41, 59, 0.9)"
            : theme.card,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 20,
          borderTopRightRadius: message.isMe ? 4 : 20,
          borderTopLeftRadius: message.isMe ? 20 : 4,
        }}
      >
        <Text
          style={{
            color: message.isMe ? "white" : theme.text,
            fontSize: 15,
            lineHeight: 22,
          }}
        >
          {message.text}
        </Text>
      </View>
      <Text
        style={{
          color: theme.textMuted,
          fontSize: 11,
          marginTop: 4,
          alignSelf: message.isMe ? "flex-end" : "flex-start",
        }}
      >
        {message.timestamp}
      </Text>
    </Animated.View>
  );
};

export default function ChatScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = (params.id as string) || "1";

  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>(getInitialMessages(userId));
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const user = USERS[userId] || USERS["1"];

  const handleSend = () => {
    if (!inputText.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isMe: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate typing response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "That sounds great! Let me know what you think after watching it 🍿",
        isMe: false,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
      };
      setMessages((prev) => [...prev, responseMessage]);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 2000);
  };

  const handlePickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Please allow access to your photo library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newMessage: Message = {
        id: Date.now().toString(),
        image: result.assets[0].uri,
        isMe: true,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "image",
      };
      setMessages((prev) => [...prev, newMessage]);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleCamera = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Please allow access to your camera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newMessage: Message = {
        id: Date.now().toString(),
        image: result.assets[0].uri,
        isMe: true,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "image",
      };
      setMessages((prev) => [...prev, newMessage]);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
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
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 16,
          backgroundColor: isDark ? "rgba(2, 6, 23, 0.8)" : "rgba(255, 255, 255, 0.9)",
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
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
              marginRight: 12,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>

          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: user.avatar }}
              style={{ width: 44, height: 44, borderRadius: 22 }}
              contentFit="cover"
            />
            {user.isOnline && (
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: Colors.success,
                  borderWidth: 2,
                  borderColor: isDark ? theme.background : "white",
                }}
              />
            )}
          </View>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16 }}>{user.name}</Text>
            <Text style={{ color: user.isOnline ? Colors.success : theme.textSecondary, fontSize: 12 }}>
              {user.isOnline ? "Online" : "Offline"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="videocam" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1, paddingHorizontal: 20 }}
          contentContainerStyle={{ paddingVertical: 20 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              theme={theme}
              isDark={isDark}
              onMoviePress={() => router.push("/movie/1")}
            />
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <Animated.View
              entering={FadeIn}
              style={{
                alignSelf: "flex-start",
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.9)" : theme.card,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 20,
                borderTopLeftRadius: 4,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.textMuted,
                  }}
                />
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.textMuted,
                  }}
                />
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.textMuted,
                  }}
                />
              </View>
            </Animated.View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 16,
            paddingBottom: 32,
            backgroundColor: isDark ? "rgba(2, 6, 23, 0.95)" : "rgba(255, 255, 255, 0.95)",
            borderTopWidth: 1,
            borderTopColor: theme.border,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <TouchableOpacity
              onPress={handleCamera}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDark ? theme.backgroundTertiary : theme.backgroundSecondary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="camera" size={22} color={theme.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePickImage}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDark ? theme.backgroundTertiary : theme.backgroundSecondary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="image" size={22} color={theme.primary} />
            </TouchableOpacity>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(241, 245, 249, 0.9)",
                borderRadius: 24,
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor={theme.textMuted}
                style={{ flex: 1, fontSize: 15, color: theme.text }}
                multiline
                maxLength={500}
              />
            </View>

            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <LinearGradient
                colors={
                  inputText.trim()
                    ? [Colors.primary, Colors.primaryDark]
                    : [theme.backgroundTertiary, theme.backgroundTertiary]
                }
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={inputText.trim() ? "white" : theme.textMuted}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
