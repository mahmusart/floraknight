const API_KEY = process.env.EXPO_PUBLIC_PLANTNET_API_KEY;
const API_URL = 'https://my-api.plantnet.org/v2/identify/all';

export async function identifyPlant(imageUri) {
  if (!API_KEY) {
    throw new Error('PlantNet API key not found. Check your .env file.');
  }

  const formData = new FormData();
  formData.append('images', {
    uri: imageUri,
    name: 'plant.jpg',
    type: 'image/jpeg',
  });
  formData.append('organs', 'auto');

  const url = `${API_URL}?api-key=${API_KEY}&include-related-images=false&no-reject=false`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PlantNet error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error('No plant identified. Try a clearer photo of a leaf or flower.');
  }

  // Take the top match
  const top = data.results[0];
  return {
    commonName: top.species.commonNames?.[0] || top.species.scientificNameWithoutAuthor,
    scientificName: top.species.scientificNameWithoutAuthor,
    family: top.species.family?.scientificNameWithoutAuthor || 'Unknown',
    genus: top.species.genus?.scientificNameWithoutAuthor || 'Unknown',
    confidence: Math.round(top.score * 100),
    allMatches: data.results.slice(0, 3).map(r => ({
      commonName: r.species.commonNames?.[0] || r.species.scientificNameWithoutAuthor,
      scientificName: r.species.scientificNameWithoutAuthor,
      confidence: Math.round(r.score * 100),
    })),
  };
}