const HF_TOKEN = process.env.EXPO_PUBLIC_HF_API_TOKEN;
const GENERAL_MODEL_URL = 'https://router.huggingface.co/hf-inference/models/google/vit-base-patch16-224';

// Sprout's jokes organized by object category
const JOKES = {
  // Animals
  dog: [
    "That's a good boy, not a good leaf. Try scanning something that doesn't fetch.",
    "Woof! That's a dog, partner. They eat plants, they're not plants.",
  ],
  cat: [
    "Ah, a cat. Known destroyer of houseplants, not actually one themselves.",
    "That's a cat, partner. They knock plants off shelves — very different thing.",
  ],
  bird: [
    "That's a bird! They sit IN trees, but they are not trees.",
    "Chirp chirp — that's a feathered friend, not a leafy one.",
  ],
  fish: [
    "That's a fish. The only green thing about them is when they go bad.",
    "Fish are friends, not plants. Try scanning some seaweed instead!",
  ],
  insect: [
    "A bug! Some bugs eat plants, but scanning them won't unlock any codex entries.",
    "That's a creepy-crawly, not a leafy-green. Close though — they both like soil.",
  ],

  // People
  person: [
    "That's a human! Fun fact: humans are about 60% water. Plants relate.",
    "I appreciate the confidence, but I can only identify plants, not people!",
    "Scanning humans is above my pay grade, partner. Try a leaf instead.",
  ],

  // Tech
  phone: [
    "You just scanned your phone with your phone. We've reached peak technology.",
    "That's a phone, not a fern. Though they both die without charging... wait.",
  ],
  laptop: [
    "That's a laptop! The only thing it grows is your browser tab count.",
    "A computer! It has a lot of bugs, but none of the garden variety.",
  ],
  keyboard: [
    "A keyboard! The only seeds here are the crumbs between the keys.",
    "That's a keyboard, partner. No roots, but plenty of shortcuts.",
  ],
  screen: [
    "That's a screen. The closest it gets to nature is your wallpaper.",
    "A monitor! It displays plants beautifully but photosynthesizes terribly.",
  ],

  // Food
  food: [
    "That looks like food! It probably CAME from a plant, but it's not one anymore.",
    "Mmm, looks tasty. But my job is pre-kitchen identification, partner.",
  ],
  drink: [
    "That's a beverage! Many drinks come from plants — tea, coffee, juice — but this is the finished product.",
    "A drink! I identify the plant, you identify the recipe. Teamwork.",
  ],

  // Vehicles
  vehicle: [
    "That's a vehicle! It runs on dead plants (fossil fuel). Circle of life, I guess.",
    "Vroom vroom! That's not a plant, but it does need gas... which used to be plants. Deep.",
  ],

  // Clothing
  clothing: [
    "That's clothing! Cotton comes from plants, so you're... close?",
    "Nice threads! Some fabrics come from plants, but scanning your outfit won't work.",
  ],

  // Furniture
  furniture: [
    "That's furniture! It used to be a tree. Moment of silence.",
    "Wood furniture — technically a plant's final form. Respects.",
  ],

  // Default fallback
  default: [
    "Hmm, that's definitely not a plant. I'm good, but I'm not THAT good.",
    "Partner, I'm a plant scanner, not a... whatever-that-is scanner.",
    "Not a plant! Try pointing me at something green and leafy.",
    "I've scanned thousands of plants and that ain't one of them, partner.",
    "My plant database is coming up empty. Probably because that's not a plant.",
    "404: Plant not found. But hey, nice object you've got there.",
    "I'm trained on plants, not... this. But I respect the creativity.",
    "That's an interesting thing! But my expertise stops at the kingdom Plantae.",
  ],
};

// Map ImageNet labels to our joke categories
function categorizeObject(label) {
  const l = label.toLowerCase();

  // Animals
  if (l.includes('dog') || l.includes('puppy') || l.includes('retriever') ||
      l.includes('terrier') || l.includes('poodle') || l.includes('shepherd') ||
      l.includes('bulldog') || l.includes('hound') || l.includes('collie') ||
      l.includes('corgi') || l.includes('husky') || l.includes('beagle')) return 'dog';
  if (l.includes('cat') || l.includes('kitten') || l.includes('tabby') ||
      l.includes('persian') || l.includes('siamese')) return 'cat';
  if (l.includes('bird') || l.includes('parrot') || l.includes('robin') ||
      l.includes('eagle') || l.includes('chicken') || l.includes('hen') ||
      l.includes('rooster') || l.includes('pigeon') || l.includes('sparrow')) return 'bird';
  if (l.includes('fish') || l.includes('goldfish') || l.includes('shark') ||
      l.includes('tuna')) return 'fish';
  if (l.includes('ant') || l.includes('bee') || l.includes('butterfly') ||
      l.includes('spider') || l.includes('beetle') || l.includes('fly') ||
      l.includes('cockroach') || l.includes('mosquito') || l.includes('moth') ||
      l.includes('dragonfly') || l.includes('grasshopper') || l.includes('cricket')) return 'insect';
  if (l.includes('snake') || l.includes('lizard') || l.includes('frog') ||
      l.includes('turtle') || l.includes('gecko') || l.includes('iguana') ||
      l.includes('chameleon') || l.includes('crocodile') || l.includes('alligator')) return 'insect'; // reuse bug jokes

  // People
  if (l.includes('person') || l.includes('man') || l.includes('woman') ||
      l.includes('boy') || l.includes('girl') || l.includes('face') ||
      l.includes('jersey') || l.includes('suit') || l.includes('groom') ||
      l.includes('wig')) return 'person';

  // Tech
  if (l.includes('phone') || l.includes('cellphone') || l.includes('iphone') ||
      l.includes('smartphone') || l.includes('dial') || l.includes('remote')) return 'phone';
  if (l.includes('laptop') || l.includes('notebook') || l.includes('computer')) return 'laptop';
  if (l.includes('keyboard') || l.includes('mouse') || l.includes('trackpad')) return 'keyboard';
  if (l.includes('screen') || l.includes('monitor') || l.includes('television') ||
      l.includes('tv') || l.includes('desktop')) return 'screen';

  // Food
  if (l.includes('pizza') || l.includes('burger') || l.includes('sandwich') ||
      l.includes('cake') || l.includes('bread') || l.includes('soup') ||
      l.includes('plate') || l.includes('bowl') || l.includes('food') ||
      l.includes('meat') || l.includes('egg') || l.includes('cheese') ||
      l.includes('ice cream') || l.includes('chocolate') || l.includes('pretzel') ||
      l.includes('bagel') || l.includes('dough') || l.includes('pasta') ||
      l.includes('noodle') || l.includes('rice') || l.includes('taco')) return 'food';
  if (l.includes('cup') || l.includes('mug') || l.includes('bottle') ||
      l.includes('wine') || l.includes('beer') || l.includes('coffee') ||
      l.includes('espresso') || l.includes('glass') || l.includes('goblet')) return 'drink';

  // Vehicles
  if (l.includes('car') || l.includes('truck') || l.includes('bus') ||
      l.includes('bicycle') || l.includes('motorcycle') || l.includes('boat') ||
      l.includes('airplane') || l.includes('taxi') || l.includes('van') ||
      l.includes('cab') || l.includes('convertible') || l.includes('limousine') ||
      l.includes('jeep') || l.includes('minivan') || l.includes('ambulance')) return 'vehicle';

  // Clothing
  if (l.includes('shirt') || l.includes('shoe') || l.includes('hat') ||
      l.includes('sock') || l.includes('dress') || l.includes('coat') ||
      l.includes('jacket') || l.includes('jean') || l.includes('sneaker') ||
      l.includes('sandal') || l.includes('boot') || l.includes('tie') ||
      l.includes('scarf') || l.includes('sunglasses') || l.includes('mask')) return 'clothing';

  // Furniture
  if (l.includes('chair') || l.includes('table') || l.includes('desk') ||
      l.includes('couch') || l.includes('sofa') || l.includes('bed') ||
      l.includes('bookcase') || l.includes('shelf') || l.includes('cabinet') ||
      l.includes('bench') || l.includes('stool')) return 'furniture';

  return 'default';
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Identify a non-plant object and generate a Sprout joke.
 */
export async function identifyAndJoke(imageUri) {
  let objectName = 'mystery object';
  let category = 'default';

  // Try to identify the object with a general classifier
  try {
    if (HF_TOKEN) {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const hfResponse = await fetch(GENERAL_MODEL_URL, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${HF_TOKEN}` },
        body: blob,
      });

      if (hfResponse.ok) {
        const results = await hfResponse.json();
        if (results && results.length > 0) {
          objectName = results[0].label.replace(/_/g, ' ');
          category = categorizeObject(results[0].label);
        }
      }
    }
  } catch (e) {
    // If object detection fails, just use default jokes
    console.log('Object detection failed, using default joke:', e.message);
  }

  const joke = pickRandom(JOKES[category] || JOKES.default);

  return {
    objectName,
    joke,
    category,
  };
}