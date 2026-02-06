import * as Location from "expo-location";

export type DrinkResult = {
  name: string;
  category: string;
  confidence: number;
};

export type NearbyPlace = {
  id: string;
  name: string;
  address: string;
  distance: string;
  latitude: number;
  longitude: number;
  rating?: number;
};

// Common drink patterns mapped to search terms for Google Places
const DRINK_DATABASE: Record<string, { searchTerms: string[]; category: string }> = {
  coffee: { searchTerms: ["coffee shop", "cafe"], category: "Coffee" },
  latte: { searchTerms: ["coffee shop", "cafe"], category: "Coffee" },
  espresso: { searchTerms: ["coffee shop", "cafe", "espresso bar"], category: "Coffee" },
  cappuccino: { searchTerms: ["coffee shop", "cafe"], category: "Coffee" },
  americano: { searchTerms: ["coffee shop", "cafe"], category: "Coffee" },
  macchiato: { searchTerms: ["coffee shop", "cafe"], category: "Coffee" },
  mocha: { searchTerms: ["coffee shop", "cafe"], category: "Coffee" },
  "iced coffee": { searchTerms: ["coffee shop", "cafe"], category: "Coffee" },
  "cold brew": { searchTerms: ["coffee shop", "cafe"], category: "Coffee" },
  tea: { searchTerms: ["tea house", "cafe", "bubble tea"], category: "Tea" },
  "bubble tea": { searchTerms: ["bubble tea", "boba tea"], category: "Tea" },
  boba: { searchTerms: ["bubble tea", "boba tea"], category: "Tea" },
  matcha: { searchTerms: ["cafe", "tea house", "matcha"], category: "Tea" },
  smoothie: { searchTerms: ["smoothie", "juice bar"], category: "Smoothie" },
  juice: { searchTerms: ["juice bar", "smoothie"], category: "Juice" },
  beer: { searchTerms: ["bar", "brewery", "pub"], category: "Beer" },
  "craft beer": { searchTerms: ["brewery", "craft beer bar"], category: "Beer" },
  wine: { searchTerms: ["wine bar", "winery"], category: "Wine" },
  cocktail: { searchTerms: ["cocktail bar", "bar"], category: "Cocktail" },
  margarita: { searchTerms: ["bar", "mexican restaurant"], category: "Cocktail" },
  soda: { searchTerms: ["restaurant", "convenience store"], category: "Soda" },
  milkshake: { searchTerms: ["diner", "ice cream shop", "burger restaurant"], category: "Milkshake" },
  "energy drink": { searchTerms: ["convenience store", "gas station"], category: "Energy Drink" },
  water: { searchTerms: ["convenience store", "grocery store"], category: "Water" },
  lemonade: { searchTerms: ["cafe", "restaurant", "juice bar"], category: "Lemonade" },
  "hot chocolate": { searchTerms: ["coffee shop", "cafe"], category: "Hot Chocolate" },
  kombucha: { searchTerms: ["health food store", "juice bar"], category: "Kombucha" },
};

/**
 * Simulated drink identification from an image.
 * In a real app, this would call an AI vision API (e.g., Google Vision, OpenAI).
 */
export function identifyDrink(imageUri: string): DrinkResult {
  // Simulate identification - in production, send image to a vision API
  const drinks = Object.keys(DRINK_DATABASE);
  const randomIndex = Math.floor(Math.random() * 8); // Bias towards common drinks
  const drinkNames = [
    "Iced Latte",
    "Cappuccino",
    "Matcha Latte",
    "Bubble Tea",
    "Cold Brew Coffee",
    "Smoothie",
    "Espresso",
    "Craft Beer",
  ];
  const drinkKeys = [
    "latte",
    "cappuccino",
    "matcha",
    "bubble tea",
    "cold brew",
    "smoothie",
    "espresso",
    "craft beer",
  ];

  const key = drinkKeys[randomIndex];
  const info = DRINK_DATABASE[key];

  return {
    name: drinkNames[randomIndex],
    category: info.category,
    confidence: 0.75 + Math.random() * 0.2,
  };
}

function getSearchTermForDrink(drinkName: string): string {
  const lower = drinkName.toLowerCase();
  for (const [key, value] of Object.entries(DRINK_DATABASE)) {
    if (lower.includes(key)) {
      return value.searchTerms[0];
    }
  }
  return "cafe";
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Generate realistic nearby places based on drink type and current location.
 */
export function findNearbyPlaces(
  drinkName: string,
  userLat: number,
  userLon: number
): NearbyPlace[] {
  const searchTerm = getSearchTermForDrink(drinkName);

  const placeNames: Record<string, string[]> = {
    "coffee shop": [
      "Blue Bottle Coffee",
      "Stumptown Coffee Roasters",
      "Verve Coffee",
      "Ritual Coffee",
      "Sightglass Coffee",
      "Philz Coffee",
    ],
    cafe: [
      "The Daily Grind",
      "Sunrise Cafe",
      "The Bean Counter",
      "Meadow Cafe",
      "Golden Hour Cafe",
      "The Roastery",
    ],
    "bubble tea": [
      "Tiger Sugar",
      "Kung Fu Tea",
      "ShareTea",
      "Gong Cha",
      "TP Tea",
      "CoCo Fresh Tea",
    ],
    "juice bar": [
      "Jamba Juice",
      "Pressed Juicery",
      "Juice Generation",
      "The Juice Shop",
      "Raw Juce",
    ],
    bar: [
      "The Tipsy Crow",
      "Lucky Strike",
      "The Broken Shaker",
      "Death & Co",
      "Attaboy",
      "Please Don't Tell",
    ],
    brewery: [
      "Stone Brewing",
      "Sierra Nevada",
      "Lagunitas Taproom",
      "Modern Times",
      "Ballast Point",
    ],
    "wine bar": [
      "The Wine Cellar",
      "Cork & Bottle",
      "Vinoteca",
      "The Wine Room",
      "Terroir",
    ],
    "tea house": [
      "Samovar Tea Lounge",
      "The Tea Spot",
      "Cha Cha Tea",
      "Zen Tea House",
    ],
    smoothie: [
      "Jamba Juice",
      "Smoothie King",
      "Tropical Smoothie",
      "Nekter Juice Bar",
    ],
    "convenience store": [
      "7-Eleven",
      "Circle K",
      "Wawa",
      "QuickStop",
    ],
    default: [
      "The Corner Spot",
      "Main Street Drinks",
      "Central Beverage Co",
      "The Thirsty Traveler",
    ],
  };

  const names = placeNames[searchTerm] || placeNames["default"];
  const streets = [
    "Main St",
    "Oak Ave",
    "Market St",
    "Broadway",
    "1st Ave",
    "Park Blvd",
    "Mission St",
    "Valencia St",
  ];

  const places: NearbyPlace[] = names.slice(0, 5).map((name, i) => {
    // Generate nearby coordinates (within ~2 miles)
    const latOffset = (Math.random() - 0.5) * 0.03 * (i + 1);
    const lonOffset = (Math.random() - 0.5) * 0.03 * (i + 1);
    const placeLat = userLat + latOffset;
    const placeLon = userLon + lonOffset;

    const dist = calculateDistance(userLat, userLon, placeLat, placeLon);
    const streetNum = Math.floor(Math.random() * 900) + 100;
    const street = streets[Math.floor(Math.random() * streets.length)];

    return {
      id: `place-${i}`,
      name,
      address: `${streetNum} ${street}`,
      distance: dist < 0.1 ? `${Math.round(dist * 5280)} ft` : `${dist.toFixed(1)} mi`,
      latitude: placeLat,
      longitude: placeLon,
      rating: 3.5 + Math.random() * 1.5,
    };
  });

  // Sort by distance
  places.sort((a, b) => {
    const distA = calculateDistance(userLat, userLon, a.latitude, a.longitude);
    const distB = calculateDistance(userLat, userLon, b.latitude, b.longitude);
    return distA - distB;
  });

  return places;
}

export async function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return null;
    }
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch {
    // Return a default location (San Francisco) if location fails
    return { latitude: 37.7749, longitude: -122.4194 };
  }
}
