// web/src/services/OutfitService.js

/**
 * Returns a simple outfit suggestion based on temperature (°C)
 * and weather description.
 */
export function getSuggestedOutfit(temp, desc) {
    // Guard if desc is missing
    const lowerDesc = (desc || '').toLowerCase();
  
    // Base on precipitation keywords
    if (
      lowerDesc.includes('rain') || lowerDesc.includes('drizzle') || lowerDesc.includes('thunderstorm')
    ) {
      return 'Light rain jacket or umbrella + waterproof shoes';
    }
  
    if (lowerDesc.includes('snow')) {
      return 'Warm coat, scarf, gloves, waterproof boots';
    }
  
    // Base on temperature ranges
    if (temp >= 25) {
      return 'T-shirt + shorts + sunglasses';
    }
  
    if (temp >= 18) {
      return 'Long-sleeve shirt + light pants';
    }
  
    if (temp >= 10) {
      return 'Sweater + jeans + light jacket';
    }
  
    // below 10°C
    return 'Warm coat + scarf + gloves';
  }
  