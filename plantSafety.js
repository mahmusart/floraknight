// plantSafety.js
// Safety classifications for common plants. Sources: USDA, NIH MedlinePlus,
// ASPCA, Royal Horticultural Society. Reviewed for accuracy but always
// defer to a poison control center in an emergency.
//
// Categories:
//   'edible'    — safe to eat, often nutritious
//   'medicinal' — used therapeutically; may have edible parts
//   'toxic'     — harmful if ingested, touched, or inhaled
//   'caution'   — edible/safe under conditions but risky raw or for some people

const PLANT_SAFETY = {
  // ===== EDIBLE =====
  'ocimum basilicum': {
    category: 'edible',
    summary: 'Sweet basil. Widely used culinary herb. Safe for children and pets in small quantities.',
    uses: ['Culinary herb', 'Mild antimicrobial', 'Aromatherapy'],
    warnings: [],
  },
  'mentha spicata': {
    category: 'edible',
    summary: 'Spearmint. Common culinary and tea herb. Safe in normal quantities.',
    uses: ['Culinary use', 'Digestive tea', 'Breath freshener'],
    warnings: ['Large doses may cause stomach upset'],
  },
  'mentha piperita': {
    category: 'edible',
    summary: 'Peppermint. Refreshing herb, common in teas and food.',
    uses: ['Culinary herb', 'Tea', 'Mild digestive aid'],
    warnings: ['Avoid in infants — can affect breathing'],
  },
  'rosmarinus officinalis': {
    category: 'edible',
    summary: 'Rosemary. Culinary and medicinal evergreen herb.',
    uses: ['Culinary herb', 'Antioxidant', 'Cognitive aroma'],
    warnings: ['High doses during pregnancy not advised'],
  },
  'allium sativum': {
    category: 'edible',
    summary: 'Garlic. Edible bulb with strong medicinal history.',
    uses: ['Culinary staple', 'Cardiovascular support', 'Antimicrobial'],
    warnings: ['Toxic to dogs and cats'],
  },
  'capsicum annuum': {
    category: 'edible',
    summary: 'Bell pepper / chili pepper species. Edible fruit.',
    uses: ['Culinary use', 'Vitamin C source', 'Capsaicin (in hot varieties)'],
    warnings: ['Hot varieties can irritate eyes and skin on contact'],
  },
  'lactuca sativa': {
    category: 'edible',
    summary: 'Garden lettuce. Common salad green, safe raw.',
    uses: ['Salad green', 'Low-calorie food'],
    warnings: [],
  },
  'solanum lycopersicum': {
    category: 'caution',
    summary: 'Tomato. The fruit is edible and nutritious, but leaves and stems are toxic.',
    uses: ['Edible fruit', 'Lycopene source'],
    warnings: ['Leaves, stems, and unripe green fruit contain solanine — do not eat', 'Toxic to dogs, cats, horses'],
  },
  'spinacia oleracea': {
    category: 'edible',
    summary: 'Spinach. Nutrient-dense leafy green, edible raw or cooked.',
    uses: ['Salad green', 'Iron and folate source'],
    warnings: ['High oxalate content — limit if prone to kidney stones'],
  },
  'citrus limon': {
    category: 'edible',
    summary: 'Lemon. Edible fruit and zest; leaves are not consumed.',
    uses: ['Culinary fruit', 'Vitamin C source'],
    warnings: ['Essential oil can irritate skin in sunlight'],
  },
  'musa paradisiaca': {
    category: 'edible',
    summary: 'Plantain / banana. Edible fruit, widely cultivated in tropical regions.',
    uses: ['Staple food (cooked or ripe)', 'Potassium source'],
    warnings: [],
  },
  'mangifera indica': {
    category: 'edible',
    summary: 'Mango. Edible fruit; sap and skin can cause skin reactions in sensitive people.',
    uses: ['Edible fruit', 'Vitamin A and C source'],
    warnings: ['Sap and skin contain urushiol — same compound in poison ivy. May cause rash in sensitive people'],
  },
  'carica papaya': {
    category: 'edible',
    summary: 'Papaya / pawpaw. Edible ripe fruit, traditional medicinal uses.',
    uses: ['Edible ripe fruit', 'Digestive enzyme (papain)', 'Vitamin C'],
    warnings: ['Unripe fruit and seeds can cause uterine contractions — avoid in pregnancy'],
  },
  'arachis hypogaea': {
    category: 'edible',
    summary: 'Peanut / groundnut. Edible legume seeds.',
    uses: ['Edible nut', 'Protein and oil source'],
    warnings: ['Common allergen — can cause severe reactions in sensitive people'],
  },
  'zea mays': {
    category: 'edible',
    summary: 'Maize / corn. Staple cereal grain.',
    uses: ['Staple food', 'Animal feed', 'Industrial uses'],
    warnings: [],
  },

  // ===== MEDICINAL =====
  'ocimum tenuiflorum': {
    category: 'medicinal',
    summary: 'Holy Basil / Tulsi. Sacred adaptogenic herb in Ayurvedic medicine.',
    uses: ['Stress / adaptogen', 'Respiratory aid', 'Antioxidant', 'Sacred plant in Hindu tradition'],
    warnings: ['May lower blood sugar — caution if diabetic', 'Avoid in pregnancy in large doses'],
  },
  'aloe vera': {
    category: 'medicinal',
    summary: 'Aloe. Gel from leaves used topically for burns and skin care.',
    uses: ['Topical burn relief', 'Skin moisturizer', 'Wound care'],
    warnings: ['Latex (yellow layer under skin) is a strong laxative — do not eat', 'Toxic to dogs and cats'],
  },
  'curcuma longa': {
    category: 'medicinal',
    summary: 'Turmeric. Rhizome with strong anti-inflammatory properties.',
    uses: ['Anti-inflammatory', 'Culinary spice', 'Digestive aid'],
    warnings: ['May increase bleeding risk — stop before surgery', 'Can interact with blood thinners'],
  },
  'zingiber officinale': {
    category: 'medicinal',
    summary: 'Ginger. Rhizome used widely for digestion and nausea.',
    uses: ['Anti-nausea', 'Digestive aid', 'Anti-inflammatory', 'Culinary'],
    warnings: ['May interact with blood thinners in large doses'],
  },
  'moringa oleifera': {
    category: 'medicinal',
    summary: 'Moringa / drumstick tree. Highly nutritious leaves, traditional medicine.',
    uses: ['Edible nutritious leaves', 'Traditional medicine', 'Water purification'],
    warnings: ['Root and bark contain alkaloids — avoid in pregnancy'],
  },
  'azadirachta indica': {
    category: 'medicinal',
    summary: 'Neem. Tropical tree with broad medicinal and pesticidal uses.',
    uses: ['Antibacterial', 'Pesticide', 'Skin conditions', 'Dental hygiene (twigs)'],
    warnings: ['Neem oil toxic if ingested by infants', 'Avoid in pregnancy'],
  },
  'matricaria chamomilla': {
    category: 'medicinal',
    summary: 'German chamomile. Calming herb used as tea.',
    uses: ['Calming tea', 'Sleep aid', 'Mild anti-inflammatory'],
    warnings: ['Allergy possible if sensitive to ragweed family'],
  },
  'lavandula angustifolia': {
    category: 'medicinal',
    summary: 'English lavender. Aromatic herb, calming and antimicrobial.',
    uses: ['Aromatherapy', 'Calming', 'Topical antiseptic'],
    warnings: ['Essential oil should not be ingested'],
  },
  'echinacea purpurea': {
    category: 'medicinal',
    summary: 'Purple coneflower. Used for immune support.',
    uses: ['Immune support', 'Cold remedy'],
    warnings: ['Avoid if autoimmune condition', 'Possible ragweed allergy crossover'],
  },
  'vernonia amygdalina': {
    category: 'medicinal',
    summary: 'Bitter leaf. Widely used in West African medicine and cooking.',
    uses: ['Traditional medicine', 'Soup ingredient', 'Blood sugar support'],
    warnings: ['May lower blood sugar significantly'],
  },
  'hibiscus sabdariffa': {
    category: 'medicinal',
    summary: 'Roselle / zobo. Calyces used to make a popular West African tea.',
    uses: ['Tea (zobo)', 'Vitamin C source', 'Mild blood pressure support'],
    warnings: ['May lower blood pressure — caution if on BP medication'],
  },
  'aframomum melegueta': {
    category: 'medicinal',
    summary: 'Grains of paradise / alligator pepper. West African spice with medicinal use.',
    uses: ['Spice', 'Traditional medicine', 'Digestive aid'],
    warnings: [],
  },

  // ===== TOXIC =====
  'nerium oleander': {
    category: 'toxic',
    summary: 'Oleander. EXTREMELY TOXIC. All parts can be lethal even in small amounts.',
    uses: ['Ornamental only — never consume any part'],
    warnings: ['Ingestion can cause cardiac arrest', 'Even smoke from burning plant is toxic', 'Keep away from children and pets', 'Contact poison control if ingested'],
  },
  'ricinus communis': {
    category: 'toxic',
    summary: 'Castor bean. Seeds contain ricin, one of the most toxic substances known.',
    uses: ['Castor oil (processed seeds, toxin removed)', 'Ornamental'],
    warnings: ['Two seeds can kill a child', 'Sap can cause severe skin reactions', 'Highly toxic to pets'],
  },
  'datura stramonium': {
    category: 'toxic',
    summary: 'Jimsonweed / thorn apple. All parts highly toxic and hallucinogenic.',
    uses: ['No safe consumption use'],
    warnings: ['Can cause delirium, seizures, death', 'Extremely dangerous — keep children away', 'Often fatal if ingested'],
  },
  'dieffenbachia seguine': {
    category: 'toxic',
    summary: 'Dumb cane. Common houseplant with toxic sap.',
    uses: ['Ornamental only'],
    warnings: ['Sap causes severe mouth and throat swelling', 'Can temporarily paralyze vocal cords', 'Keep away from children and pets'],
  },
  'philodendron hederaceum': {
    category: 'toxic',
    summary: 'Heart-leaf philodendron. Common houseplant, mildly toxic.',
    uses: ['Ornamental only'],
    warnings: ['Sap causes mouth and throat irritation', 'Toxic to cats and dogs'],
  },
  'epipremnum aureum': {
    category: 'toxic',
    summary: "Pothos / devil's ivy. Common houseplant, toxic if chewed.",
    uses: ['Ornamental only'],
    warnings: ['Causes oral irritation and swelling', 'Toxic to cats and dogs'],
  },
  'spathiphyllum wallisii': {
    category: 'toxic',
    summary: 'Peace lily. Popular houseplant, toxic to people and pets.',
    uses: ['Ornamental only'],
    warnings: ['Sap causes burning sensation in mouth', 'Toxic to cats, dogs, children'],
  },
  'rhododendron': {
    category: 'toxic',
    summary: 'Rhododendron / azalea. All parts toxic to humans and animals.',
    uses: ['Ornamental only'],
    warnings: ['Causes vomiting, weakness, cardiac problems', 'Honey from flowers can be toxic ("mad honey")', 'Highly toxic to pets and livestock'],
  },
  'taxus baccata': {
    category: 'toxic',
    summary: 'English yew. Ancient ornamental tree — needles and seeds highly toxic.',
    uses: ['Ornamental', 'Source of taxol (chemotherapy drug, processed)'],
    warnings: ['Seeds and needles can cause sudden cardiac death', 'Red flesh of berry is non-toxic but seed inside is lethal'],
  },
  'convallaria majalis': {
    category: 'toxic',
    summary: 'Lily of the valley. Beautiful but all parts toxic, including the water in the vase.',
    uses: ['Ornamental only'],
    warnings: ['Affects heart rhythm', 'Even vase water is toxic', 'Highly toxic to pets'],
  },
  'digitalis purpurea': {
    category: 'toxic',
    summary: 'Foxglove. Source of digitalis heart medication, but plant itself is highly toxic.',
    uses: ['Pharmaceutical source (processed)', 'Ornamental'],
    warnings: ['All parts toxic — affects heart', 'Even small amounts dangerous to children', 'Toxic to pets'],
  },
  'jatropha curcas': {
    category: 'toxic',
    summary: 'Physic nut / barbados nut. Common in West African gardens, seeds highly toxic.',
    uses: ['Biofuel (processed oil)', 'Ornamental hedge'],
    warnings: ['Seeds taste sweet — major child poisoning risk', '3 seeds can be lethal to a child', 'All parts toxic'],
  },

  // ===== CAUTION =====
  'manihot esculenta': {
    category: 'caution',
    summary: 'Cassava / yuca. Major food staple — but raw or improperly prepared roots are toxic.',
    uses: ['Staple food (properly processed)', 'Garri, fufu, tapioca'],
    warnings: ['Raw roots contain cyanide compounds', 'Must be peeled, soaked, and cooked thoroughly', 'Bitter varieties more toxic'],
  },
  'phaseolus vulgaris': {
    category: 'caution',
    summary: 'Common bean. Edible but raw/undercooked beans contain toxins.',
    uses: ['Cooked beans (safe)', 'Protein source'],
    warnings: ['Raw or undercooked beans cause vomiting and diarrhea', 'Always cook thoroughly'],
  },
  'solanum tuberosum': {
    category: 'caution',
    summary: 'Potato. Tubers safe; green parts and sprouts toxic.',
    uses: ['Cooked tuber (safe)'],
    warnings: ['Green or sprouted potatoes contain solanine — discard', 'Leaves and stems toxic'],
  },

  // ===== GENUS-LEVEL FALLBACKS =====
  // Used when an exact species match isn't found.
  'mentha': {
    category: 'edible',
    summary: 'Mint species. Most mints are safe culinary herbs used in food and tea.',
    uses: ['Culinary herb', 'Tea', 'Aromatic'],
    warnings: ['Avoid concentrated essential oils in infants'],
  },
  'ocimum': {
    category: 'edible',
    summary: 'Basil species. Most basils are safe culinary or medicinal herbs.',
    uses: ['Culinary herb', 'Aromatherapy'],
    warnings: [],
  },
  'allium': {
    category: 'edible',
    summary: 'Onion family (garlic, onion, leek, chive). Edible bulbs and leaves.',
    uses: ['Culinary use', 'Antimicrobial properties'],
    warnings: ['Toxic to dogs, cats, and some livestock'],
  },
  'citrus': {
    category: 'edible',
    summary: 'Citrus family. Fruits are edible; leaves, peels, and oils are aromatic.',
    uses: ['Edible fruit', 'Vitamin C source'],
    warnings: ['Essential oils can irritate skin in sunlight'],
  },
  'capsicum': {
    category: 'edible',
    summary: 'Pepper family. Sweet and hot peppers, all edible.',
    uses: ['Culinary fruit', 'Vitamin C source'],
    warnings: ['Hot varieties irritate eyes and skin on contact'],
  },
  'solanum': {
    category: 'caution',
    summary: 'Nightshade family. Includes tomato, potato, eggplant — fruits often edible, but leaves and stems often toxic.',
    uses: ['Some species edible (cooked)'],
    warnings: ['Many parts contain solanine — verify species before consuming', 'Several wild species are highly toxic'],
  },
  'philodendron': {
    category: 'toxic',
    summary: 'Philodendron family. Common houseplants, all parts mildly toxic.',
    uses: ['Ornamental only'],
    warnings: ['Sap causes mouth and throat irritation', 'Toxic to cats and dogs'],
  },
  'lavandula': {
    category: 'medicinal',
    summary: 'Lavender species. Aromatic herbs used in tea, oil, and aromatherapy.',
    uses: ['Aromatherapy', 'Calming tea', 'Topical antiseptic'],
    warnings: ['Essential oil should not be ingested'],
  },
  'hibiscus': {
    category: 'edible',
    summary: 'Hibiscus species. Many species have edible flowers and leaves; some used for tea.',
    uses: ['Tea (zobo)', 'Edible flowers', 'Vitamin C'],
    warnings: ['May lower blood pressure'],
  },
  'ocimum_genus': {
    // (not used — kept here as a placeholder pattern reminder; safe to delete)
    category: 'edible', summary: '', uses: [], warnings: [],
  },
};

/**
 * Look up safety info for a plant by scientific name.
 * Handles hybrid names (× or x), case variations, and falls back to genus level
 * when the exact species isn't in the database.
 */
export function getSafetyInfo(scientificName) {
  if (!scientificName) return null;

  // Normalize: lowercase, trim, strip hybrid symbols, collapse whitespace
  const normalized = scientificName
    .toLowerCase()
    .trim()
    .replace(/\s+×\s+/g, ' ')
    .replace(/\s+x\s+/g, ' ')
    .replace(/\s+/g, ' ');

  // Exact match first
  if (PLANT_SAFETY[normalized]) {
    return PLANT_SAFETY[normalized];
  }

  // Genus-level fallback
  const genus = normalized.split(' ')[0];
  if (PLANT_SAFETY[genus]) {
    return {
      ...PLANT_SAFETY[genus],
      summary: PLANT_SAFETY[genus].summary + ' (Genus-level info — specific species may vary.)',
    };
  }

  return null;
}

/**
 * UI properties for each category — color, icon, label.
 */
export function getCategoryStyle(category) {
  const styles = {
    edible:    { color: '#6cd9a3', label: 'EDIBLE',    icon: '✓' },
    medicinal: { color: '#4fe5d4', label: 'MEDICINAL', icon: '✦' },
    toxic:     { color: '#ff7b8a', label: 'TOXIC',     icon: '⚠' },
    caution:   { color: '#ffb454', label: 'CAUTION',   icon: '!' },
    unknown:   { color: '#8fb4b0', label: 'UNKNOWN',   icon: '?' },
  };
  return styles[category] || styles.unknown;
}