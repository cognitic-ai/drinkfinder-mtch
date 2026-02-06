import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PlaceCard from "@/components/place-card";
import { NearbyPlace } from "@/lib/drink-finder";

export default function ResultRoute() {
  const params = useLocalSearchParams<{
    drinkName: string;
    drinkCategory: string;
    confidence: string;
    places: string;
    photoUri: string;
    userLat: string;
    userLon: string;
  }>();

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({
      title: params.drinkName ?? "Result",
    });
  }, [navigation, params.drinkName]);

  const places: NearbyPlace[] = useMemo(() => {
    try {
      return JSON.parse(params.places ?? "[]");
    } catch {
      return [];
    }
  }, [params.places]);

  const confidence = parseInt(params.confidence ?? "0", 10);

  const openInMaps = (place: NearbyPlace) => {
    const url =
      process.env.EXPO_OS === "ios"
        ? `maps:?q=${encodeURIComponent(place.name)}&ll=${place.latitude},${place.longitude}`
        : `geo:${place.latitude},${place.longitude}?q=${encodeURIComponent(place.name)}`;
    Linking.openURL(url).catch(() => {
      // Fallback to Google Maps URL
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}&query_place_id=${encodeURIComponent(place.name)}`
      );
    });
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: AC.systemGroupedBackground as any }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: insets.bottom + 20,
        gap: 20,
      }}
    >
      {/* Drink identification card */}
      <View
        style={{
          backgroundColor: AC.secondarySystemGroupedBackground as any,
          borderRadius: 20,
          borderCurve: "continuous",
          padding: 20,
          alignItems: "center",
          gap: 12,
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: AC.systemBlue as any,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source="sf:cup.and.saucer.fill"
            style={{ fontSize: 28, color: "white" }}
          />
        </View>

        <Text
          selectable
          style={{
            color: AC.label as any,
            fontSize: 24,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {params.drinkName}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <View
            style={{
              backgroundColor: AC.tertiarySystemFill as any,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
              borderCurve: "continuous",
            }}
          >
            <Text
              style={{
                color: AC.secondaryLabel as any,
                fontSize: 13,
                fontWeight: "500",
              }}
            >
              {params.drinkCategory}
            </Text>
          </View>

          <View
            style={{
              backgroundColor:
                confidence > 85
                  ? (AC.systemGreen as any)
                  : confidence > 70
                  ? (AC.systemOrange as any)
                  : (AC.systemRed as any),
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
              borderCurve: "continuous",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Image
              source="sf:sparkles"
              style={{ fontSize: 11, color: "white" }}
            />
            <Text
              style={{
                color: "white",
                fontSize: 13,
                fontWeight: "600",
                fontVariant: ["tabular-nums"],
              }}
            >
              {confidence}% match
            </Text>
          </View>
        </View>
      </View>

      {/* Nearby places header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: AC.label as any,
            fontSize: 20,
            fontWeight: "700",
          }}
        >
          Nearby Places
        </Text>
        <Text
          style={{
            color: AC.secondaryLabel as any,
            fontSize: 14,
          }}
        >
          {places.length} found
        </Text>
      </View>

      {/* Place list */}
      <View style={{ gap: 10 }}>
        {places.map((place, index) => (
          <PlaceCard
            key={place.id}
            place={place}
            index={index}
            onPress={() => openInMaps(place)}
          />
        ))}
      </View>

      {places.length === 0 && (
        <View
          style={{
            alignItems: "center",
            gap: 12,
            paddingVertical: 40,
          }}
        >
          <Image
            source="sf:mappin.slash"
            style={{ fontSize: 40, color: AC.tertiaryLabel as any }}
          />
          <Text
            style={{
              color: AC.secondaryLabel as any,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            No nearby places found for this drink.
          </Text>
        </View>
      )}

      {/* Directions button */}
      {places.length > 0 && (
        <Pressable
          onPress={() => openInMaps(places[0])}
          style={({ pressed }) => ({
            backgroundColor: AC.systemBlue as any,
            borderRadius: 14,
            borderCurve: "continuous",
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <Image
            source="sf:location.fill"
            style={{ fontSize: 18, color: "white" }}
          />
          <Text
            style={{
              color: "white",
              fontSize: 17,
              fontWeight: "600",
            }}
          >
            Directions to {places[0].name}
          </Text>
        </Pressable>
      )}

      {/* Disclaimer */}
      <Text
        style={{
          color: AC.tertiaryLabel as any,
          fontSize: 12,
          textAlign: "center",
          lineHeight: 16,
        }}
      >
        Results are simulated. In production, this would use AI vision and real
        map data to identify drinks and find actual nearby locations.
      </Text>
    </ScrollView>
  );
}
