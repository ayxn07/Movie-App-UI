import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Dimensions,
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
} from "react-native-reanimated";

import { Colors } from "@/constants/data";
import { useApp, useTheme } from "@/context";

const { width, height } = Dimensions.get("window");

// Social Login Button
const SocialButton = ({
  icon,
  name,
  color,
  onPress,
}: {
  icon: string;
  name: string;
  color: string;
  onPress: () => void;
}) => {
  const { theme, isDark } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
        paddingVertical: 14,
        borderRadius: 16,
        gap: 8,
      }}
    >
      <Ionicons name={icon as any} size={22} color={color} />
      <Text style={{ color: theme.text, fontWeight: "600", fontSize: 14 }}>{name}</Text>
    </TouchableOpacity>
  );
};

// Input Field Component
const InputField = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = "default",
}: {
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
}) => {
  const { theme, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: isFocused ? theme.primary : "transparent",
        paddingHorizontal: 16,
        marginBottom: 16,
      }}
    >
      <Ionicons name={icon as any} size={22} color={isFocused ? theme.primary : theme.textSecondary} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !showPassword}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          flex: 1,
          paddingVertical: 16,
          paddingHorizontal: 12,
          color: theme.text,
          fontSize: 16,
        }}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function AuthScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { showToast } = useApp();
  const [mode, setMode] = useState<"welcome" | "login" | "signup" | "forgot">("welcome");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      showToast("Please fill in all fields", "error");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    showToast("Login successful!", "success");
    router.replace("/(tabs)");
  };

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword) {
      showToast("Please fill in all fields", "error");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    showToast("Account created successfully!", "success");
    router.replace("/(tabs)");
  };

  const handleForgotPassword = () => {
    if (!email) {
      showToast("Please enter your email", "error");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    showToast("Password reset link sent!", "success");
    setMode("login");
  };

  const handleSocialLogin = (provider: string) => {
    showToast(`${provider} login coming soon`, "info");
  };

  // Welcome Screen
  if (mode === "welcome") {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar style="light" />

        {/* Background Image */}
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          contentFit="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.95)"]}
          locations={[0, 0.5, 1]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        {/* Content */}
        <View style={{ flex: 1, justifyContent: "flex-end", paddingHorizontal: 24, paddingBottom: 40 }}>
          {/* Logo */}
          <Animated.View entering={FadeInDown.delay(100).springify()} style={{ alignItems: "center", marginBottom: 32 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                backgroundColor: Colors.primary,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Ionicons name="play" size={40} color="white" style={{ marginLeft: 4 }} />
            </View>
            <Text style={{ color: "white", fontSize: 32, fontWeight: "900" }}>MoviesHub</Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, marginTop: 8, textAlign: "center" }}>
              Movies, Music & More
            </Text>
          </Animated.View>

          {/* Features */}
          <Animated.View entering={FadeIn.delay(200)} style={{ marginBottom: 40 }}>
            {[
              { icon: "film", text: "Stream movies & shows" },
              { icon: "musical-notes", text: "Listen to music with lyrics" },
              { icon: "people", text: "Watch parties with friends" },
            ].map((feature, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: "rgba(139, 92, 246, 0.3)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={feature.icon as any} size={22} color={Colors.primary} />
                </View>
                <Text style={{ color: "white", fontSize: 16, marginLeft: 16 }}>{feature.text}</Text>
              </View>
            ))}
          </Animated.View>

          {/* Buttons */}
          <Animated.View entering={FadeInUp.delay(300).springify()}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setMode("signup");
              }}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingVertical: 18,
                  borderRadius: 16,
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
                  Get Started
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setMode("login");
              }}
              style={{
                paddingVertical: 18,
                borderRadius: 16,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
                I already have an account
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }

  // Login/Signup/Forgot Password Screen
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <LinearGradient
        colors={isDark ? ["#1e1b4b", "#0f172a", "#020617"] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ paddingTop: 56, marginBottom: 32 }}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              if (mode === "forgot") {
                setMode("login");
              } else {
                setMode("welcome");
              }
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>

          <Animated.View entering={FadeInDown.springify()}>
            <Text style={{ color: theme.text, fontSize: 32, fontWeight: "900" }}>
              {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Forgot Password"}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 16, marginTop: 8 }}>
              {mode === "login"
                ? "Sign in to continue"
                : mode === "signup"
                ? "Sign up to get started"
                : "Enter your email to reset password"}
            </Text>
          </Animated.View>
        </View>

        {/* Form */}
        <Animated.View entering={FadeIn.delay(100)}>
          {mode === "signup" && (
            <InputField
              icon="person-outline"
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
          )}
          <InputField
            icon="mail-outline"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          {mode !== "forgot" && (
            <InputField
              icon="lock-closed-outline"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          )}
          {mode === "signup" && (
            <InputField
              icon="lock-closed-outline"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          )}

          {mode === "login" && (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setMode("forgot");
              }}
              style={{ alignSelf: "flex-end", marginBottom: 24 }}
            >
              <Text style={{ color: theme.primary, fontWeight: "600" }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          )}

          {/* Action Button */}
          <TouchableOpacity
            onPress={mode === "login" ? handleLogin : mode === "signup" ? handleSignup : handleForgotPassword}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 18,
                borderRadius: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
                {mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Reset Password"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Social Login */}
        {mode !== "forgot" && (
          <Animated.View entering={FadeInUp.delay(200).springify()} style={{ marginTop: 32 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
              <Text style={{ color: theme.textSecondary, marginHorizontal: 16, fontSize: 14 }}>
                Or continue with
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <SocialButton icon="logo-google" name="Google" color="#EA4335" onPress={() => handleSocialLogin("Google")} />
              <SocialButton icon="logo-apple" name="Apple" color={theme.text} onPress={() => handleSocialLogin("Apple")} />
            </View>
          </Animated.View>
        )}

        {/* Switch Mode */}
        {mode !== "forgot" && (
          <Animated.View entering={FadeIn.delay(300)} style={{ alignItems: "center", marginTop: 32, marginBottom: 40 }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: theme.textSecondary }}>
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setMode(mode === "login" ? "signup" : "login");
                }}
              >
                <Text style={{ color: theme.primary, fontWeight: "700" }}>
                  {mode === "login" ? "Sign Up" : "Sign In"}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
