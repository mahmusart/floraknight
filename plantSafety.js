// plantSafety.js
// Safety classifications for common plants.
// Sources: USDA, NIH MedlinePlus, ASPCA, RHS, WHO monographs.
// Always defer to a poison control center in an emergency.
//
// Categories:
//   'edible'    — safe to eat, often nutritious
//   'medicinal' — used therapeutically; may have edible parts
//   'toxic'     — harmful if ingested, touched, or inhaled
//   'caution'   — edible/safe under conditions but risky raw or for some people

const PLANT_SAFETY = {

  // ===================================================================
  //  EDIBLE — safe to consume
  // ===================================================================

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
  'salvia rosmarinus': {
    category: 'edible',
    summary: 'Rosemary (updated botanical name). Same as Rosmarinus officinalis.',
    uses: ['Culinary herb', 'Antioxidant', 'Cognitive aroma'],
    warnings: ['High doses during pregnancy not advised'],
  },
  'allium sativum': {
    category: 'edible',
    summary: 'Garlic. Edible bulb with strong medicinal history.',
    uses: ['Culinary staple', 'Cardiovascular support', 'Antimicrobial'],
    warnings: ['Toxic to dogs and cats'],
  },
  'allium cepa': {
    category: 'edible',
    summary: 'Onion. Edible bulb used worldwide.',
    uses: ['Culinary staple', 'Quercetin source'],
    warnings: ['Toxic to dogs and cats', 'Raw juice can irritate eyes and skin'],
  },
  'allium schoenoprasum': {
    category: 'edible',
    summary: 'Chives. Mild onion-flavored herb, safe raw or cooked.',
    uses: ['Culinary herb', 'Garnish'],
    warnings: ['Toxic to dogs and cats in large quantities'],
  },
  'allium porrum': {
    category: 'edible',
    summary: 'Leek. Mild onion-family vegetable.',
    uses: ['Culinary vegetable', 'Soups and stews'],
    warnings: ['Toxic to dogs and cats'],
  },
  'capsicum annuum': {
    category: 'edible',
    summary: 'Bell pepper / chili pepper. Edible fruit.',
    uses: ['Culinary use', 'Vitamin C source', 'Capsaicin (in hot varieties)'],
    warnings: ['Hot varieties can irritate eyes and skin on contact'],
  },
  'capsicum chinense': {
    category: 'edible',
    summary: 'Habanero / scotch bonnet pepper. Extremely hot but edible.',
    uses: ['Culinary spice', 'Capsaicin source'],
    warnings: ['Extremely hot — handle with gloves', 'Keep away from eyes and children'],
  },
  'capsicum frutescens': {
    category: 'edible',
    summary: 'Tabasco / bird pepper. Small hot peppers, edible.',
    uses: ['Hot sauce', 'Culinary spice'],
    warnings: ['Very hot — handle with care'],
  },
  'lactuca sativa': {
    category: 'edible',
    summary: 'Garden lettuce. Common salad green, safe raw.',
    uses: ['Salad green', 'Low-calorie food'],
    warnings: [],
  },
  'solanum lycopersicum': {
    category: 'caution',
    summary: 'Tomato. Fruit is edible and nutritious, but leaves and stems are toxic.',
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
    summary: 'Lemon. Edible fruit and zest.',
    uses: ['Culinary fruit', 'Vitamin C source'],
    warnings: ['Essential oil can irritate skin in sunlight'],
  },
  'citrus sinensis': {
    category: 'edible',
    summary: 'Sweet orange. Edible fruit rich in vitamin C.',
    uses: ['Edible fruit', 'Juice', 'Vitamin C source'],
    warnings: [],
  },
  'citrus paradisi': {
    category: 'edible',
    summary: 'Grapefruit. Edible citrus fruit.',
    uses: ['Edible fruit', 'Vitamin C source'],
    warnings: ['Interacts with many medications — check with pharmacist'],
  },
  'citrus reticulata': {
    category: 'edible',
    summary: 'Mandarin / tangerine. Sweet edible citrus.',
    uses: ['Edible fruit', 'Vitamin C source'],
    warnings: [],
  },
  'citrus aurantiifolia': {
    category: 'edible',
    summary: 'Key lime. Edible citrus used in drinks and cooking.',
    uses: ['Culinary fruit', 'Juice', 'Vitamin C'],
    warnings: ['Juice on skin + sunlight can cause burns (phytophotodermatitis)'],
  },
  'musa paradisiaca': {
    category: 'edible',
    summary: 'Plantain / banana. Edible fruit, widely cultivated in tropical regions.',
    uses: ['Staple food (cooked or ripe)', 'Potassium source'],
    warnings: [],
  },
  'musa acuminata': {
    category: 'edible',
    summary: 'Dessert banana. Sweet edible fruit.',
    uses: ['Edible fruit', 'Potassium source', 'Energy food'],
    warnings: [],
  },
  'mangifera indica': {
    category: 'edible',
    summary: 'Mango. Edible fruit; sap and skin can cause reactions in sensitive people.',
    uses: ['Edible fruit', 'Vitamin A and C source'],
    warnings: ['Sap and skin contain urushiol — may cause rash in sensitive people'],
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
  'oryza sativa': {
    category: 'edible',
    summary: 'Rice. Global staple grain, safe when cooked.',
    uses: ['Staple food', 'Carbohydrate source'],
    warnings: ['Raw rice is indigestible', 'Wash before cooking to reduce arsenic content'],
  },
  'triticum aestivum': {
    category: 'edible',
    summary: 'Wheat. Major cereal crop.',
    uses: ['Flour', 'Bread', 'Staple food'],
    warnings: ['Contains gluten — unsafe for celiac disease'],
  },
  'sorghum bicolor': {
    category: 'edible',
    summary: 'Sorghum / guinea corn. Important cereal in West Africa.',
    uses: ['Staple food', 'Porridge', 'Beer brewing', 'Animal feed'],
    warnings: ['Young plants can accumulate cyanide — only eat mature grain'],
  },
  'pennisetum glaucum': {
    category: 'edible',
    summary: 'Pearl millet. Drought-tolerant staple grain in West Africa.',
    uses: ['Staple food', 'Porridge', 'Flour'],
    warnings: [],
  },
  'vigna unguiculata': {
    category: 'edible',
    summary: 'Cowpea / black-eyed pea. Major protein source in West Africa.',
    uses: ['Edible beans', 'Protein source', 'Akara / moi moi ingredient'],
    warnings: ['Must be cooked thoroughly'],
  },
  'glycine max': {
    category: 'edible',
    summary: 'Soybean. Protein-rich legume.',
    uses: ['Protein source', 'Tofu', 'Soy milk', 'Oil'],
    warnings: ['Common allergen', 'Contains phytoestrogens'],
  },
  'citrullus lanatus': {
    category: 'edible',
    summary: 'Watermelon. Sweet edible fruit.',
    uses: ['Edible fruit', 'Hydration', 'Lycopene source'],
    warnings: ['Seeds are edible but can be a choking hazard for young children'],
  },
  'cucumis sativus': {
    category: 'edible',
    summary: 'Cucumber. Mild edible fruit, eaten raw or pickled.',
    uses: ['Salad vegetable', 'Hydration', 'Skin care'],
    warnings: [],
  },
  'cucurbita pepo': {
    category: 'edible',
    summary: 'Pumpkin / squash / zucchini. Edible fruit and seeds.',
    uses: ['Edible vegetable', 'Seeds are nutritious', 'Vitamin A source'],
    warnings: ['Bitter-tasting pumpkins may contain toxic cucurbitacins — discard if bitter'],
  },
  'cucurbita maxima': {
    category: 'edible',
    summary: 'Giant pumpkin / winter squash. Edible when cooked.',
    uses: ['Cooked vegetable', 'Soup', 'Vitamin A source'],
    warnings: [],
  },
  'daucus carota': {
    category: 'edible',
    summary: 'Carrot. Root vegetable, safe raw or cooked.',
    uses: ['Edible root', 'Vitamin A / beta-carotene source'],
    warnings: ['Excessive consumption can cause carotenemia (harmless skin yellowing)'],
  },
  'beta vulgaris': {
    category: 'edible',
    summary: 'Beetroot / chard. Edible root and leaves.',
    uses: ['Edible root and greens', 'Nitrate source', 'Natural food coloring'],
    warnings: ['High oxalate content in leaves — limit if prone to kidney stones'],
  },
  'brassica oleracea': {
    category: 'edible',
    summary: 'Cabbage / broccoli / kale / cauliflower (depending on cultivar). All edible.',
    uses: ['Edible vegetable', 'Vitamin C and K source', 'Fiber'],
    warnings: ['Can cause gas', 'Goitrogenic — very high intake may affect thyroid'],
  },
  'brassica rapa': {
    category: 'edible',
    summary: 'Turnip / bok choy / napa cabbage. Edible roots and leaves.',
    uses: ['Edible root and greens', 'Soups and stir-fry'],
    warnings: [],
  },
  'raphanus sativus': {
    category: 'edible',
    summary: 'Radish. Peppery root vegetable, safe raw.',
    uses: ['Salad vegetable', 'Digestive aid'],
    warnings: [],
  },
  'ipomoea batatas': {
    category: 'edible',
    summary: 'Sweet potato. Nutritious starchy tuber.',
    uses: ['Staple food', 'Vitamin A source (orange varieties)', 'Leaves also edible'],
    warnings: [],
  },
  'dioscorea rotundata': {
    category: 'edible',
    summary: 'White yam. Major West African staple.',
    uses: ['Staple food', 'Pounded yam', 'Amala'],
    warnings: ['Must be cooked — raw yam contains oxalates and dioscorine'],
  },
  'dioscorea alata': {
    category: 'edible',
    summary: 'Water yam / purple yam. Edible tuber.',
    uses: ['Staple food', 'Boiled or pounded'],
    warnings: ['Must be cooked thoroughly'],
  },
  'colocasia esculenta': {
    category: 'caution',
    summary: 'Taro / cocoyam. Edible when thoroughly cooked, toxic raw.',
    uses: ['Cooked tuber', 'Leaves edible when cooked'],
    warnings: ['Contains calcium oxalate crystals — causes severe mouth burning if eaten raw', 'Always cook thoroughly', 'Sap can irritate skin'],
  },
  'xanthosoma sagittifolium': {
    category: 'caution',
    summary: 'Cocoyam / tannia. West African staple, must be cooked.',
    uses: ['Cooked tuber', 'Fufu'],
    warnings: ['Raw corms and leaves contain oxalates — always cook', 'Sap irritates skin'],
  },
  'persea americana': {
    category: 'edible',
    summary: 'Avocado. Nutrient-dense edible fruit.',
    uses: ['Edible fruit', 'Healthy fats', 'Potassium source'],
    warnings: ['Pit, skin, and leaves toxic to birds, rabbits, and some pets', 'Fruit is safe for humans'],
  },
  'ananas comosus': {
    category: 'edible',
    summary: 'Pineapple. Sweet tropical fruit.',
    uses: ['Edible fruit', 'Bromelain enzyme', 'Vitamin C'],
    warnings: ['Unripe fruit and juice can irritate mouth', 'Bromelain may cause mouth tingling'],
  },
  'psidium guajava': {
    category: 'edible',
    summary: 'Guava. Tropical fruit rich in vitamin C.',
    uses: ['Edible fruit', 'Extremely high vitamin C', 'Traditional medicine'],
    warnings: [],
  },
  'cocos nucifera': {
    category: 'edible',
    summary: 'Coconut palm. Coconut water, meat, and oil all edible.',
    uses: ['Edible fruit', 'Coconut water', 'Cooking oil', 'Coconut milk'],
    warnings: [],
  },
  'elaeis guineensis': {
    category: 'edible',
    summary: 'Oil palm. Source of palm oil, major crop in West Africa.',
    uses: ['Palm oil', 'Palm wine', 'Palm kernel oil'],
    warnings: ['High in saturated fat — consume in moderation'],
  },
  'theobroma cacao': {
    category: 'edible',
    summary: 'Cacao tree. Source of cocoa and chocolate.',
    uses: ['Cocoa beans', 'Chocolate', 'Antioxidants'],
    warnings: ['Contains theobromine — toxic to dogs and cats', 'Caffeine content'],
  },
  'coffea arabica': {
    category: 'edible',
    summary: 'Coffee plant. Beans produce coffee.',
    uses: ['Coffee beans', 'Caffeine source'],
    warnings: ['Excessive caffeine can cause anxiety and insomnia', 'Not for children'],
  },
  'coffea canephora': {
    category: 'edible',
    summary: 'Robusta coffee. Higher caffeine than arabica.',
    uses: ['Coffee beans', 'Instant coffee'],
    warnings: ['Higher caffeine content than arabica'],
  },
  'camellia sinensis': {
    category: 'edible',
    summary: 'Tea plant. Leaves produce green, black, and white tea.',
    uses: ['Tea', 'Antioxidants', 'Caffeine source'],
    warnings: ['Contains caffeine', 'Very high intake may affect iron absorption'],
  },
  'petroselinum crispum': {
    category: 'edible',
    summary: 'Parsley. Common culinary herb.',
    uses: ['Culinary herb', 'Garnish', 'Vitamin K source'],
    warnings: ['Very large medicinal doses during pregnancy not advised'],
  },
  'anethum graveolens': {
    category: 'edible',
    summary: 'Dill. Culinary herb with feathery leaves.',
    uses: ['Culinary herb', 'Pickling', 'Digestive aid'],
    warnings: [],
  },
  'coriandrum sativum': {
    category: 'edible',
    summary: 'Coriander / cilantro. Leaves and seeds used in cooking.',
    uses: ['Culinary herb', 'Spice (seeds)', 'Digestive aid'],
    warnings: [],
  },
  'thymus vulgaris': {
    category: 'edible',
    summary: 'Thyme. Aromatic culinary and medicinal herb.',
    uses: ['Culinary herb', 'Antimicrobial', 'Cough remedy'],
    warnings: ['Thyme oil should not be ingested undiluted'],
  },
  'salvia officinalis': {
    category: 'edible',
    summary: 'Sage. Culinary herb with medicinal properties.',
    uses: ['Culinary herb', 'Traditional medicine', 'Sore throat gargle'],
    warnings: ['Avoid large medicinal doses during pregnancy'],
  },
  'origanum vulgare': {
    category: 'edible',
    summary: 'Oregano. Popular culinary herb.',
    uses: ['Culinary herb', 'Pizza/pasta seasoning', 'Antimicrobial'],
    warnings: [],
  },
  'laurus nobilis': {
    category: 'edible',
    summary: 'Bay laurel. Leaves used in cooking for flavoring.',
    uses: ['Culinary herb', 'Soups and stews'],
    warnings: ['Remove leaves before eating — tough and can be a choking hazard'],
  },
  'fragaria ananassa': {
    category: 'edible',
    summary: 'Strawberry. Sweet edible fruit.',
    uses: ['Edible fruit', 'Vitamin C source'],
    warnings: ['Common allergen for some people'],
  },
  'rubus idaeus': {
    category: 'edible',
    summary: 'Raspberry. Edible berry fruit.',
    uses: ['Edible fruit', 'Antioxidants', 'Fiber source'],
    warnings: [],
  },
  'vaccinium corymbosum': {
    category: 'edible',
    summary: 'Blueberry. Antioxidant-rich edible berry.',
    uses: ['Edible fruit', 'High antioxidants', 'Brain health'],
    warnings: [],
  },
  'vitis vinifera': {
    category: 'edible',
    summary: 'Grapevine. Edible fruit, also used for wine.',
    uses: ['Edible fruit', 'Wine production', 'Raisins'],
    warnings: ['Grapes and raisins are toxic to dogs'],
  },
  'prunus persica': {
    category: 'edible',
    summary: 'Peach. Sweet stone fruit.',
    uses: ['Edible fruit', 'Vitamin A and C'],
    warnings: ['Pit contains amygdalin (cyanide precursor) — do not eat the pit'],
  },
  'prunus avium': {
    category: 'edible',
    summary: 'Sweet cherry. Edible fruit.',
    uses: ['Edible fruit', 'Antioxidants'],
    warnings: ['Pits, leaves, and stems contain cyanide compounds — do not chew pits'],
  },
  'prunus domestica': {
    category: 'edible',
    summary: 'Plum. Sweet stone fruit.',
    uses: ['Edible fruit', 'Prunes (dried)'],
    warnings: ['Pit contains cyanide precursor — do not eat'],
  },
  'malus domestica': {
    category: 'edible',
    summary: 'Apple. Widely eaten fruit.',
    uses: ['Edible fruit', 'Fiber source', 'Vitamin C'],
    warnings: ['Seeds contain amygdalin — do not eat seeds in quantity'],
  },
  'pyrus communis': {
    category: 'edible',
    summary: 'Pear. Sweet edible fruit.',
    uses: ['Edible fruit', 'Fiber source'],
    warnings: [],
  },
  'ficus carica': {
    category: 'edible',
    summary: 'Common fig. Sweet edible fruit.',
    uses: ['Edible fruit', 'Fiber source', 'Traditional sweetener'],
    warnings: ['Milky sap from leaves and stems can irritate skin'],
  },
  'punica granatum': {
    category: 'edible',
    summary: 'Pomegranate. Edible seeds (arils) rich in antioxidants.',
    uses: ['Edible fruit', 'Juice', 'High antioxidants'],
    warnings: ['Bark and root are toxic — only eat the seeds'],
  },
  'phoenix dactylifera': {
    category: 'edible',
    summary: 'Date palm. Sweet edible fruit.',
    uses: ['Edible fruit', 'Natural sweetener', 'Energy food'],
    warnings: ['High sugar content'],
  },
  'solanum melongena': {
    category: 'edible',
    summary: 'Eggplant / aubergine / garden egg. Edible when cooked.',
    uses: ['Cooked vegetable', 'Stews and grilling'],
    warnings: ['Leaves are toxic', 'Contains solanine in small amounts — cook before eating'],
  },
  'abelmoschus esculentus': {
    category: 'edible',
    summary: 'Okra / ladies finger. Edible pod vegetable popular in West Africa.',
    uses: ['Culinary vegetable', 'Soup thickener', 'Fiber source'],
    warnings: [],
  },
  'amaranthus viridis': {
    category: 'edible',
    summary: 'Green amaranth / callaloo. Edible leafy vegetable.',
    uses: ['Edible leaves', 'Protein-rich grain (seeds)', 'Iron source'],
    warnings: ['High oxalate content — limit if prone to kidney stones'],
  },
  'celosia argentea': {
    category: 'edible',
    summary: 'Lagos spinach / soko yòkòtò. Popular leafy vegetable in West Africa.',
    uses: ['Edible leaves', 'Soups and stews'],
    warnings: [],
  },
  'corchorus olitorius': {
    category: 'edible',
    summary: 'Jute mallow / ewedu. Popular soup vegetable in West Africa.',
    uses: ['Edible leaves', 'Mucilaginous soup', 'Fiber source'],
    warnings: [],
  },
  'telfairia occidentalis': {
    category: 'edible',
    summary: 'Fluted pumpkin / ugu. Major leafy vegetable in Nigeria.',
    uses: ['Edible leaves', 'Seeds edible', 'Iron and protein source', 'Blood tonic (traditional)'],
    warnings: ['Seeds may be mildly toxic if eaten raw in large quantities'],
  },
  'talinum triangulare': {
    category: 'edible',
    summary: 'Waterleaf / gbure. Common leafy vegetable in West Africa.',
    uses: ['Edible leaves', 'Soups and stews', 'High water content'],
    warnings: ['High oxalate content — cook to reduce'],
  },
  'solanum macrocarpon': {
    category: 'edible',
    summary: 'African eggplant / garden egg leaf. Leaves and fruit edible.',
    uses: ['Edible leaves and fruit', 'Soups', 'Traditional snack'],
    warnings: ['Bitter varieties may cause stomach upset in excess'],
  },
  'lycopersicon esculentum': {
    category: 'caution',
    summary: 'Tomato (older botanical name). Fruit edible, leaves toxic.',
    uses: ['Edible fruit', 'Lycopene source'],
    warnings: ['Leaves and stems contain solanine — do not eat'],
  },
  'phaseolus vulgaris': {
    category: 'caution',
    summary: 'Common bean. Edible but raw/undercooked beans contain toxins.',
    uses: ['Cooked beans (safe)', 'Protein source'],
    warnings: ['Raw or undercooked beans cause vomiting and diarrhea', 'Always cook thoroughly'],
  },
  'lens culinaris': {
    category: 'edible',
    summary: 'Lentil. Protein-rich legume, safe when cooked.',
    uses: ['Protein source', 'Soups and stews', 'Iron source'],
    warnings: ['Cook before eating for best digestibility'],
  },
  'cicer arietinum': {
    category: 'edible',
    summary: 'Chickpea / garbanzo bean. Nutritious legume.',
    uses: ['Protein source', 'Hummus', 'Stews'],
    warnings: ['Cook before eating'],
  },
  'sesamum indicum': {
    category: 'edible',
    summary: 'Sesame. Seeds used in cooking and oil.',
    uses: ['Edible seeds', 'Sesame oil', 'Calcium source'],
    warnings: ['Common allergen — can cause severe reactions in sensitive people'],
  },
  'helianthus annuus': {
    category: 'edible',
    summary: 'Sunflower. Seeds are edible and nutritious.',
    uses: ['Edible seeds', 'Sunflower oil', 'Vitamin E source'],
    warnings: [],
  },
  'olea europaea': {
    category: 'edible',
    summary: 'Olive tree. Fruit and oil are edible.',
    uses: ['Edible fruit', 'Olive oil', 'Healthy fats'],
    warnings: ['Raw olives are extremely bitter — must be cured'],
  },
  'saccharum officinarum': {
    category: 'edible',
    summary: 'Sugarcane. Chewed or pressed for juice.',
    uses: ['Sugar production', 'Fresh juice', 'Energy food'],
    warnings: ['High sugar content — consume in moderation'],
  },
  'cola nitida': {
    category: 'edible',
    summary: 'Kola nut. Stimulant nut important in West African culture.',
    uses: ['Stimulant', 'Ceremonial use', 'Flavoring (original cola drinks)'],
    warnings: ['Contains caffeine — not for children', 'Can stain teeth'],
  },
  'garcinia kola': {
    category: 'medicinal',
    summary: 'Bitter kola. West African medicinal nut.',
    uses: ['Traditional medicine', 'Anti-inflammatory', 'Respiratory remedy'],
    warnings: ['May interact with medications', 'Bitter taste'],
  },
  'chrysophyllum albidum': {
    category: 'edible',
    summary: 'African star apple / agbalumo / udara. Seasonal fruit popular in Nigeria.',
    uses: ['Edible fruit', 'Vitamin C source', 'Snack'],
    warnings: ['Sticky latex from skin can stain'],
  },
  'dacryodes edulis': {
    category: 'edible',
    summary: 'African pear / ube / bush pear. Edible when roasted or boiled.',
    uses: ['Edible fruit (cooked)', 'Eaten with corn or bread'],
    warnings: ['Usually eaten cooked, not raw'],
  },
  'irvingia gabonensis': {
    category: 'edible',
    summary: 'African mango / bush mango / ogbono. Fruit and seeds edible.',
    uses: ['Edible fruit', 'Ogbono soup (from seeds)', 'Weight management supplement'],
    warnings: [],
  },
  'parkia biglobosa': {
    category: 'edible',
    summary: 'African locust bean / dawadawa / iru. Fermented seeds used as seasoning.',
    uses: ['Fermented condiment', 'Protein source', 'Traditional seasoning'],
    warnings: ['Strong smell when fermenting'],
  },
  'detarium microcarpum': {
    category: 'edible',
    summary: 'Sweet detar / tallow tree. Edible fruit pulp.',
    uses: ['Edible fruit', 'Snack', 'Traditional medicine'],
    warnings: ['Some Detarium species are toxic — only consume known edible varieties'],
  },
  'blighia sapida': {
    category: 'caution',
    summary: 'Ackee. National fruit of Jamaica, also found in West Africa. ONLY ripe arils are safe.',
    uses: ['Edible ripe arils', 'Cooked as vegetable'],
    warnings: ['Unripe fruit is extremely toxic — causes Jamaican vomiting sickness', 'Only eat fully ripe, naturally opened fruit', 'Seeds and pink membrane are always toxic'],
  },

  // ===================================================================
  //  MEDICINAL — therapeutic use, may have edible parts
  // ===================================================================

  'ocimum tenuiflorum': {
    category: 'medicinal',
    summary: 'Holy Basil / Tulsi. Sacred adaptogenic herb in Ayurvedic medicine.',
    uses: ['Stress / adaptogen', 'Respiratory aid', 'Antioxidant', 'Sacred plant in Hindu tradition'],
    warnings: ['May lower blood sugar — caution if diabetic', 'Avoid in pregnancy in large doses'],
  },
  'ocimum gratissimum': {
    category: 'medicinal',
    summary: 'Scent leaf / efirin / nchanwu. Major medicinal herb in West Africa.',
    uses: ['Culinary herb', 'Antimicrobial', 'Fever remedy', 'Insect repellent'],
    warnings: [],
  },
  'aloe vera': {
    category: 'medicinal',
    summary: 'Aloe. Gel from leaves used topically for burns and skin care.',
    uses: ['Topical burn relief', 'Skin moisturizer', 'Wound care'],
    warnings: ['Latex (yellow layer under skin) is a strong laxative — do not eat', 'Toxic to dogs and cats'],
  },
  'aloe barbadensis': {
    category: 'medicinal',
    summary: 'Aloe vera (synonym). Same as Aloe vera.',
    uses: ['Topical burn relief', 'Skin moisturizer', 'Wound care'],
    warnings: ['Latex layer is a strong laxative — do not eat', 'Toxic to dogs and cats'],
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
    summary: 'Roselle / zobo. Calyces used for popular West African tea.',
    uses: ['Tea (zobo)', 'Vitamin C source', 'Mild blood pressure support'],
    warnings: ['May lower blood pressure — caution if on BP medication'],
  },
  'aframomum melegueta': {
    category: 'medicinal',
    summary: 'Grains of paradise / alligator pepper. West African spice.',
    uses: ['Spice', 'Traditional medicine', 'Digestive aid'],
    warnings: [],
  },
  'cymbopogon citratus': {
    category: 'medicinal',
    summary: 'Lemongrass. Aromatic herb used in cooking and traditional medicine.',
    uses: ['Culinary herb', 'Tea', 'Insect repellent', 'Fever remedy'],
    warnings: ['May lower blood sugar', 'Essential oil can irritate skin'],
  },
  'carica papaya': {
    category: 'edible',
    summary: 'Papaya / pawpaw. Edible ripe fruit, traditional medicinal uses.',
    uses: ['Edible ripe fruit', 'Digestive enzyme (papain)', 'Vitamin C'],
    warnings: ['Unripe fruit and seeds can cause uterine contractions — avoid in pregnancy'],
  },
  'momordica charantia': {
    category: 'medicinal',
    summary: 'Bitter melon / bitter gourd. Used for blood sugar management.',
    uses: ['Traditional diabetes remedy', 'Cooked vegetable', 'Liver support'],
    warnings: ['Can cause hypoglycemia in combination with diabetes medication', 'Avoid in pregnancy', 'Seeds are toxic in large amounts'],
  },
  'centella asiatica': {
    category: 'medicinal',
    summary: 'Gotu kola. Traditional Asian herb for brain and skin.',
    uses: ['Cognitive support', 'Wound healing', 'Anxiety relief'],
    warnings: ['May cause liver problems in high doses', 'Avoid in pregnancy'],
  },
  'catharanthus roseus': {
    category: 'toxic',
    summary: 'Madagascar periwinkle. Contains anticancer alkaloids but plant is toxic.',
    uses: ['Pharmaceutical source (vincristine, vinblastine)', 'Ornamental'],
    warnings: ['All parts toxic if ingested', 'Do not consume', 'Used only in processed pharmaceutical form'],
  },
  'rauvolfia serpentina': {
    category: 'medicinal',
    summary: 'Indian snakeroot. Source of reserpine for hypertension.',
    uses: ['Traditional hypertension remedy', 'Pharmaceutical source'],
    warnings: ['Overdose can cause severe depression and low blood pressure', 'Only use under medical supervision'],
  },
  'artemisia annua': {
    category: 'medicinal',
    summary: 'Sweet wormwood. Source of artemisinin for malaria treatment.',
    uses: ['Malaria treatment (artemisinin)', 'Traditional fever remedy'],
    warnings: ['Do not self-medicate for malaria — see a doctor', 'Not safe in pregnancy'],
  },
  'calendula officinalis': {
    category: 'medicinal',
    summary: 'Pot marigold. Flowers used for skin healing.',
    uses: ['Wound healing', 'Anti-inflammatory skin treatment', 'Edible petals in salads'],
    warnings: ['Allergy possible if sensitive to daisy family'],
  },
  'sambucus nigra': {
    category: 'caution',
    summary: 'Elderberry. Cooked berries are medicinal; raw berries, bark, and leaves are toxic.',
    uses: ['Immune support (cooked/processed berries)', 'Cold and flu remedy'],
    warnings: ['Raw berries cause nausea and vomiting', 'Bark, leaves, and roots are toxic', 'Only consume cooked or commercially processed elderberry'],
  },
  'hypericum perforatum': {
    category: 'medicinal',
    summary: "St. John's wort. Used for mild depression.",
    uses: ['Mild depression remedy', 'Anti-inflammatory'],
    warnings: ['Interacts with MANY medications including birth control and antidepressants', 'Causes sun sensitivity'],
  },
  'valeriana officinalis': {
    category: 'medicinal',
    summary: 'Valerian. Root used as sleep aid.',
    uses: ['Sleep aid', 'Anxiety relief'],
    warnings: ['Can cause drowsiness', 'Do not combine with other sedatives or alcohol'],
  },
  'panax ginseng': {
    category: 'medicinal',
    summary: 'Asian ginseng. Traditional adaptogenic root.',
    uses: ['Energy', 'Cognitive support', 'Immune support'],
    warnings: ['Can raise blood pressure', 'May interact with blood thinners and diabetes medication'],
  },
  'vitex agnus-castus': {
    category: 'medicinal',
    summary: 'Chaste tree / vitex. Used for hormonal balance.',
    uses: ['PMS relief', 'Hormonal balance'],
    warnings: ['May interact with hormonal medications and birth control'],
  },
  'cassia fistula': {
    category: 'medicinal',
    summary: 'Golden shower tree. Fruit pulp used as mild laxative.',
    uses: ['Mild laxative', 'Traditional medicine', 'Ornamental'],
    warnings: ['Seeds are toxic', 'Only fruit pulp is used medicinally'],
  },
  'annona muricata': {
    category: 'caution',
    summary: 'Soursop / graviola. Edible fruit, but seeds and leaves have concerns.',
    uses: ['Edible fruit', 'Traditional cancer remedy (unproven)', 'Tea from leaves'],
    warnings: ['Seeds are toxic — do not eat', 'Long-term leaf tea consumption linked to neurological issues', 'Not a proven cancer treatment'],
  },
  'euphorbia hirta': {
    category: 'medicinal',
    summary: 'Asthma weed / tawa-tawa. Traditional remedy for dengue and asthma.',
    uses: ['Traditional asthma remedy', 'Dengue fever (traditional)', 'Anti-diarrheal'],
    warnings: ['Milky sap irritates skin and eyes', 'Not for prolonged use'],
  },
  'chromolaena odorata': {
    category: 'medicinal',
    summary: 'Siam weed / acheampong. Used topically for wound healing in West Africa.',
    uses: ['Wound healing (leaf juice)', 'Traditional medicine'],
    warnings: ['For external use only — do not ingest', 'Invasive weed'],
  },

  // ===================================================================
  //  TOXIC — harmful if ingested, touched, or inhaled
  // ===================================================================

  'nerium oleander': {
    category: 'toxic',
    summary: 'Oleander. EXTREMELY TOXIC. All parts lethal in small amounts.',
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
  'datura metel': {
    category: 'toxic',
    summary: "Devil's trumpet. All parts toxic. Common ornamental.",
    uses: ['Ornamental only'],
    warnings: ['All parts contain tropane alkaloids', 'Can cause hallucinations, seizures, death', 'Keep away from children'],
  },
  'brugmansia suaveolens': {
    category: 'toxic',
    summary: "Angel's trumpet. Beautiful hanging flowers, all parts extremely toxic.",
    uses: ['Ornamental only'],
    warnings: ['All parts toxic — especially seeds and leaves', 'Can cause hallucinations and death', 'Even touching then touching eyes is dangerous'],
  },
  'dieffenbachia seguine': {
    category: 'toxic',
    summary: 'Dumb cane. Common houseplant with toxic sap.',
    uses: ['Ornamental only'],
    warnings: ['Sap causes severe mouth and throat swelling', 'Can temporarily paralyze vocal cords', 'Keep away from children and pets'],
  },
  'dieffenbachia amoena': {
    category: 'toxic',
    summary: 'Giant dumb cane. Large houseplant, toxic sap.',
    uses: ['Ornamental only'],
    warnings: ['Same toxicity as other Dieffenbachia — mouth and throat swelling', 'Keep away from children and pets'],
  },
  'philodendron hederaceum': {
    category: 'toxic',
    summary: 'Heart-leaf philodendron. Common houseplant, mildly toxic.',
    uses: ['Ornamental only'],
    warnings: ['Sap causes mouth and throat irritation', 'Toxic to cats and dogs'],
  },
  'philodendron bipinnatifidum': {
    category: 'toxic',
    summary: 'Tree philodendron / split-leaf. Large houseplant, toxic.',
    uses: ['Ornamental only'],
    warnings: ['Contains calcium oxalate crystals', 'Toxic to people and pets'],
  },
  'monstera deliciosa': {
    category: 'caution',
    summary: 'Swiss cheese plant. Popular houseplant. Unripe fruit toxic, ripe fruit edible.',
    uses: ['Ornamental', 'Ripe fruit edible (rare in cultivation)'],
    warnings: ['Unripe fruit and leaves contain calcium oxalate — causes burning', 'Toxic to cats and dogs', 'Rarely fruits indoors'],
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
    summary: 'English yew. Needles and seeds highly toxic.',
    uses: ['Ornamental', 'Source of taxol (chemotherapy drug, processed)'],
    warnings: ['Seeds and needles can cause sudden cardiac death', 'Red flesh of berry is non-toxic but seed inside is lethal'],
  },
  'convallaria majalis': {
    category: 'toxic',
    summary: 'Lily of the valley. All parts toxic, including vase water.',
    uses: ['Ornamental only'],
    warnings: ['Affects heart rhythm', 'Even vase water is toxic', 'Highly toxic to pets'],
  },
  'digitalis purpurea': {
    category: 'toxic',
    summary: 'Foxglove. Source of digitalis heart medication, plant is highly toxic.',
    uses: ['Pharmaceutical source (processed)', 'Ornamental'],
    warnings: ['All parts toxic — affects heart', 'Even small amounts dangerous to children', 'Toxic to pets'],
  },
  'jatropha curcas': {
    category: 'toxic',
    summary: 'Physic nut. Common in West African gardens, seeds highly toxic.',
    uses: ['Biofuel (processed oil)', 'Ornamental hedge'],
    warnings: ['Seeds taste sweet — major child poisoning risk', '3 seeds can be lethal to a child', 'All parts toxic'],
  },
  'jatropha gossypiifolia': {
    category: 'toxic',
    summary: 'Bellyache bush. Ornamental shrub, all parts toxic.',
    uses: ['Ornamental only'],
    warnings: ['Seeds especially toxic', 'Sap irritates skin', 'Common in tropical gardens — keep children away'],
  },
  'thevetia peruviana': {
    category: 'toxic',
    summary: 'Yellow oleander. All parts extremely toxic.',
    uses: ['Ornamental only'],
    warnings: ['Single seed can kill a child', 'Contains cardiac glycosides', 'Common in tropical gardens'],
  },
  'aconitum napellus': {
    category: 'toxic',
    summary: 'Monkshood / wolfsbane. One of the most toxic garden plants.',
    uses: ['Ornamental only'],
    warnings: ['Toxin absorbs through skin — even handling can be dangerous', 'Ingestion is often fatal', 'Wear gloves when handling'],
  },
  'colchicum autumnale': {
    category: 'toxic',
    summary: 'Autumn crocus. Contains colchicine, highly toxic.',
    uses: ['Pharmaceutical source (colchicine for gout, processed)'],
    warnings: ['All parts toxic', 'Often confused with edible wild garlic — fatal mistake', 'No antidote for severe poisoning'],
  },
  'euphorbia pulcherrima': {
    category: 'toxic',
    summary: 'Poinsettia. Mildly toxic holiday plant.',
    uses: ['Ornamental / seasonal decoration'],
    warnings: ['Milky sap irritates skin and eyes', 'Ingestion causes nausea and vomiting', 'Less dangerous than commonly believed, but keep away from pets and children'],
  },
  'euphorbia tirucalli': {
    category: 'toxic',
    summary: 'Pencil cactus / firestick. Milky sap is caustic.',
    uses: ['Ornamental only'],
    warnings: ['Sap causes severe skin burns and eye damage', 'Can cause temporary blindness', 'Wear gloves and eye protection when pruning'],
  },
  'sanseviera trifasciata': {
    category: 'toxic',
    summary: 'Snake plant / mother-in-law\'s tongue. Common houseplant, mildly toxic.',
    uses: ['Ornamental', 'Air purifier'],
    warnings: ['Causes nausea, vomiting, diarrhea if eaten', 'Toxic to cats and dogs'],
  },
  'dracaena trifasciata': {
    category: 'toxic',
    summary: 'Snake plant (updated name). Same as Sansevieria.',
    uses: ['Ornamental', 'Air purifier'],
    warnings: ['Mildly toxic if eaten', 'Toxic to cats and dogs'],
  },
  'zamioculcas zamiifolia': {
    category: 'toxic',
    summary: 'ZZ plant. Popular low-maintenance houseplant, toxic.',
    uses: ['Ornamental only'],
    warnings: ['All parts contain calcium oxalate', 'Sap irritates skin', 'Toxic to people and pets if eaten'],
  },
  'caladium bicolor': {
    category: 'toxic',
    summary: 'Caladium / angel wings. Colorful foliage, toxic.',
    uses: ['Ornamental only'],
    warnings: ['All parts contain calcium oxalate', 'Causes burning in mouth and throat', 'Toxic to pets'],
  },
  'alocasia macrorrhizos': {
    category: 'toxic',
    summary: "Giant taro / elephant ear. Ornamental, not for eating.",
    uses: ['Ornamental only'],
    warnings: ['Contains calcium oxalate — causes severe mouth burning', 'Sap irritates skin', 'Not the same as edible taro (Colocasia)'],
  },
  'aglaonema commutatum': {
    category: 'toxic',
    summary: 'Chinese evergreen. Popular houseplant, mildly toxic.',
    uses: ['Ornamental', 'Air purifier'],
    warnings: ['Contains calcium oxalate', 'Irritates mouth if chewed', 'Toxic to cats and dogs'],
  },
  'ficus benjamina': {
    category: 'toxic',
    summary: 'Weeping fig. Common indoor tree, milky sap is irritating.',
    uses: ['Ornamental'],
    warnings: ['Milky sap causes skin irritation', 'Can cause allergic reactions', 'Mildly toxic to pets'],
  },
  'ficus elastica': {
    category: 'toxic',
    summary: 'Rubber plant. Popular houseplant, milky sap is irritating.',
    uses: ['Ornamental'],
    warnings: ['Milky sap irritates skin and eyes', 'Mildly toxic to cats and dogs'],
  },
  'cycas revoluta': {
    category: 'toxic',
    summary: 'Sago palm. All parts extremely toxic, especially seeds.',
    uses: ['Ornamental only'],
    warnings: ['Extremely toxic to dogs — even one seed can be fatal', 'Causes liver failure', 'All parts toxic to humans too'],
  },
  'lilium': {
    category: 'toxic',
    summary: 'True lily. Beautiful flowers, extremely toxic to cats.',
    uses: ['Ornamental only'],
    warnings: ['ALL parts extremely toxic to cats — can cause fatal kidney failure', 'Even pollen or vase water dangerous to cats', 'Less toxic to dogs and humans but still not safe to eat'],
  },
  'hedera helix': {
    category: 'toxic',
    summary: 'English ivy. Common climbing vine, toxic.',
    uses: ['Ornamental', 'Ground cover'],
    warnings: ['Berries and leaves toxic if eaten', 'Sap causes contact dermatitis', 'Toxic to pets'],
  },
  'narcissus': {
    category: 'toxic',
    summary: 'Daffodil / narcissus. All parts toxic, especially bulbs.',
    uses: ['Ornamental only'],
    warnings: ['Bulbs often mistaken for onions — causes severe vomiting', 'All parts toxic', 'Sap causes skin irritation (daffodil itch)'],
  },
  'tulipa': {
    category: 'toxic',
    summary: 'Tulip. Bulbs are the most toxic part.',
    uses: ['Ornamental only'],
    warnings: ['Bulbs cause nausea, dizziness, abdominal pain', 'Handling bulbs can cause skin rash', 'Toxic to cats and dogs'],
  },
  'wisteria': {
    category: 'toxic',
    summary: 'Wisteria. Beautiful vine, seeds and pods are toxic.',
    uses: ['Ornamental only'],
    warnings: ['Seeds and pods cause severe gastrointestinal distress', 'Attractive to children — keep them away from fallen pods'],
  },
  'lantana camara': {
    category: 'toxic',
    summary: 'Lantana. Colorful shrub, berries toxic. Very common in tropical areas.',
    uses: ['Ornamental'],
    warnings: ['Unripe berries are toxic — can be fatal to children', 'Causes liver damage', 'Common in Nigerian gardens — supervise children'],
  },
  'abrus precatorius': {
    category: 'toxic',
    summary: 'Rosary pea / jequirity bean. Seeds contain abrin, extremely toxic.',
    uses: ['Ornamental beads (dangerous)', 'No safe consumption use'],
    warnings: ['One chewed seed can kill an adult', 'Seeds are bright red with black spot — attractive to children', 'Intact swallowed seeds may pass harmlessly but CHEWED seeds are lethal'],
  },
  'gloriosa superba': {
    category: 'toxic',
    summary: 'Flame lily / glory lily. Beautiful flower, all parts highly toxic.',
    uses: ['Ornamental only'],
    warnings: ['Contains colchicine — all parts toxic', 'Tuber resembles sweet potato — fatal if eaten', 'Can cause death within hours'],
  },
  'hippeastrum': {
    category: 'toxic',
    summary: 'Amaryllis (common name). Bulbs and leaves toxic.',
    uses: ['Ornamental only'],
    warnings: ['Bulb is most toxic part', 'Causes vomiting, diarrhea, tremors', 'Toxic to cats and dogs'],
  },
  'solanum nigrum': {
    category: 'toxic',
    summary: 'Black nightshade. Found in gardens and waste ground, toxic unripe berries.',
    uses: ['Some cultures eat fully ripe berries and cooked leaves — risky'],
    warnings: ['Unripe green berries are toxic', 'Not safe for children', 'Easily confused with deadly nightshade'],
  },
  'nicotiana tabacum': {
    category: 'toxic',
    summary: 'Tobacco. Contains nicotine, toxic alkaloid.',
    uses: ['Smoked/chewed (harmful)', 'Traditional insecticide'],
    warnings: ['Nicotine is toxic — can poison children through skin contact with leaves', 'Ingestion of leaves or tobacco products dangerous', 'All forms harmful'],
  },
  'cannabis sativa': {
    category: 'caution',
    summary: 'Cannabis / hemp. Legal status varies by country.',
    uses: ['Fiber (hemp)', 'Medical use (where legal)', 'Seeds edible (hemp seeds)'],
    warnings: ['Illegal in many countries including Nigeria', 'Contains THC (psychoactive)', 'Not safe for children'],
  },

  // ===================================================================
  //  CAUTION — edible under conditions but risky otherwise
  // ===================================================================

  'manihot esculenta': {
    category: 'caution',
    summary: 'Cassava / yuca. Major food staple — raw roots are toxic.',
    uses: ['Staple food (properly processed)', 'Garri, fufu, tapioca'],
    warnings: ['Raw roots contain cyanide compounds', 'Must be peeled, soaked, and cooked thoroughly', 'Bitter varieties more toxic'],
  },
  'solanum tuberosum': {
    category: 'caution',
    summary: 'Potato. Tubers safe; green parts and sprouts toxic.',
    uses: ['Cooked tuber (safe)'],
    warnings: ['Green or sprouted potatoes contain solanine — discard', 'Leaves and stems toxic'],
  },
  'myristica fragrans': {
    category: 'caution',
    summary: 'Nutmeg. Safe in small culinary amounts, toxic in large doses.',
    uses: ['Culinary spice', 'Flavoring'],
    warnings: ['Large doses (2+ whole nutmegs) cause hallucinations, nausea, organ damage', 'Can be fatal in extreme doses', 'Normal cooking amounts are safe'],
  },
  'prunus armeniaca': {
    category: 'caution',
    summary: 'Apricot. Fruit is edible; pit kernels contain cyanide.',
    uses: ['Edible fruit', 'Dried apricots'],
    warnings: ['Pit kernels contain amygdalin (cyanide precursor)', 'Do not eat raw kernels', 'Marketed "apricot kernels" supplements are dangerous'],
  },

  // ===================================================================
  //  COMMON HOUSEPLANTS — frequently scanned, important to classify
  // ===================================================================

  'chlorophytum comosum': {
    category: 'edible',
    summary: 'Spider plant. One of the few truly non-toxic houseplants. Safe for pets.',
    uses: ['Ornamental', 'Air purifier', 'Safe around pets and children'],
    warnings: [],
  },
  'nephrolepis exaltata': {
    category: 'edible',
    summary: 'Boston fern. Non-toxic houseplant. Safe for cats and dogs.',
    uses: ['Ornamental', 'Air purifier'],
    warnings: [],
  },
  'pilea peperomioides': {
    category: 'edible',
    summary: 'Chinese money plant. Non-toxic houseplant.',
    uses: ['Ornamental'],
    warnings: [],
  },
  'tradescantia zebrina': {
    category: 'caution',
    summary: 'Wandering dude / inch plant. Mildly irritating sap.',
    uses: ['Ornamental'],
    warnings: ['Sap can irritate skin and cause dermatitis in sensitive people', 'Mildly toxic to cats and dogs — causes stomach upset'],
  },
  'crassula ovata': {
    category: 'toxic',
    summary: 'Jade plant / money tree. Mildly toxic.',
    uses: ['Ornamental'],
    warnings: ['Toxic to cats and dogs — causes vomiting and lethargy', 'Not safe for human consumption either'],
  },
  'asplenium nidus': {
    category: 'edible',
    summary: "Bird's nest fern. Non-toxic houseplant. Safe for pets.",
    uses: ['Ornamental'],
    warnings: [],
  },
  'calathea': {
    category: 'edible',
    summary: 'Calathea / prayer plant. Non-toxic houseplant. Safe for pets.',
    uses: ['Ornamental'],
    warnings: [],
  },
  'maranta leuconeura': {
    category: 'edible',
    summary: 'Prayer plant. Non-toxic, safe for households with pets.',
    uses: ['Ornamental'],
    warnings: [],
  },
  'peperomia': {
    category: 'edible',
    summary: 'Peperomia. Non-toxic houseplant safe for pets.',
    uses: ['Ornamental'],
    warnings: [],
  },
  'hoya carnosa': {
    category: 'edible',
    summary: 'Wax plant. Non-toxic houseplant.',
    uses: ['Ornamental'],
    warnings: [],
  },
  'schlumbergera': {
    category: 'edible',
    summary: 'Christmas cactus. Non-toxic to pets and people.',
    uses: ['Ornamental'],
    warnings: [],
  },
  'haworthia': {
    category: 'edible',
    summary: 'Haworthia. Non-toxic succulent, safe for pets.',
    uses: ['Ornamental'],
    warnings: [],
  },
  'echeveria': {
    category: 'edible',
    summary: 'Echeveria. Non-toxic succulent.',
    uses: ['Ornamental'],
    warnings: [],
  },
  'euphorbia milii': {
    category: 'toxic',
    summary: 'Crown of thorns. Thorny succulent with toxic milky sap.',
    uses: ['Ornamental only'],
    warnings: ['Milky sap causes skin irritation and blistering', 'Toxic if ingested', 'Sharp thorns — handle with gloves'],
  },
  'kalanchoe blossfeldiana': {
    category: 'toxic',
    summary: 'Kalanchoe / flaming Katy. Toxic to pets.',
    uses: ['Ornamental only'],
    warnings: ['Contains cardiac glycosides', 'Toxic to cats and dogs — can affect heart', 'Not dangerous to humans in normal contact'],
  },
  'aloe aristata': {
    category: 'medicinal',
    summary: 'Lace aloe. Similar to aloe vera but smaller.',
    uses: ['Ornamental', 'Topical skin care (minor)'],
    warnings: ['Latex is a laxative — do not eat'],
  },
  'dracaena marginata': {
    category: 'toxic',
    summary: 'Dragon tree. Common houseplant, toxic to pets.',
    uses: ['Ornamental'],
    warnings: ['Toxic to cats and dogs — causes vomiting and drooling', 'Not dangerous to humans in normal contact'],
  },
  'codiaeum variegatum': {
    category: 'toxic',
    summary: 'Croton. Colorful tropical houseplant.',
    uses: ['Ornamental only'],
    warnings: ['Sap irritates skin and eyes', 'Toxic if ingested', 'Toxic to pets'],
  },
  'schefflera actinophylla': {
    category: 'toxic',
    summary: 'Umbrella tree. Common houseplant, mildly toxic.',
    uses: ['Ornamental'],
    warnings: ['Contains calcium oxalate', 'Can irritate mouth and skin', 'Toxic to cats and dogs'],
  },
  'syngonium podophyllum': {
    category: 'toxic',
    summary: 'Arrowhead plant. Common houseplant, toxic.',
    uses: ['Ornamental only'],
    warnings: ['Contains calcium oxalate', 'Sap irritates skin', 'Toxic to people and pets if eaten'],
  },
  'anthurium andraeanum': {
    category: 'toxic',
    summary: 'Anthurium / flamingo flower. Toxic houseplant.',
    uses: ['Ornamental only'],
    warnings: ['Contains calcium oxalate', 'Causes mouth burning and swelling', 'Toxic to pets'],
  },

  // ===================================================================
  //  GENUS-LEVEL FALLBACKS
  // ===================================================================

  'mentha': {
    category: 'edible',
    summary: 'Mint species. Most mints are safe culinary herbs.',
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
    summary: 'Onion family. Edible bulbs and leaves.',
    uses: ['Culinary use', 'Antimicrobial properties'],
    warnings: ['Toxic to dogs, cats, and some livestock'],
  },
  'citrus': {
    category: 'edible',
    summary: 'Citrus family. Fruits are edible.',
    uses: ['Edible fruit', 'Vitamin C source'],
    warnings: ['Essential oils can irritate skin in sunlight'],
  },
  'capsicum': {
    category: 'edible',
    summary: 'Pepper family. All edible.',
    uses: ['Culinary fruit', 'Vitamin C source'],
    warnings: ['Hot varieties irritate eyes and skin on contact'],
  },
  'solanum': {
    category: 'caution',
    summary: 'Nightshade family. Fruits often edible but leaves and stems often toxic.',
    uses: ['Some species edible (cooked)'],
    warnings: ['Many parts contain solanine', 'Several wild species are highly toxic'],
  },
  'philodendron': {
    category: 'toxic',
    summary: 'Philodendron family. Common houseplants, all parts mildly toxic.',
    uses: ['Ornamental only'],
    warnings: ['Sap causes mouth and throat irritation', 'Toxic to cats and dogs'],
  },
  'lavandula': {
    category: 'medicinal',
    summary: 'Lavender species. Aromatic herbs.',
    uses: ['Aromatherapy', 'Calming tea', 'Topical antiseptic'],
    warnings: ['Essential oil should not be ingested'],
  },
  'hibiscus': {
    category: 'edible',
    summary: 'Hibiscus species. Many have edible flowers and leaves.',
    uses: ['Tea (zobo)', 'Edible flowers', 'Vitamin C'],
    warnings: ['May lower blood pressure'],
  },
  'musa': {
    category: 'edible',
    summary: 'Banana / plantain family. Fruit is edible.',
    uses: ['Edible fruit', 'Staple food'],
    warnings: [],
  },
  'prunus': {
    category: 'caution',
    summary: 'Stone fruit family. Fruit edible but pits contain cyanide compounds.',
    uses: ['Edible fruit'],
    warnings: ['Pits, seeds, and leaves contain amygdalin (cyanide precursor)', 'Do not eat pits'],
  },
  'euphorbia': {
    category: 'toxic',
    summary: 'Euphorbia family. Most have irritating milky sap.',
    uses: ['Ornamental only'],
    warnings: ['Milky sap causes skin and eye irritation', 'Many species toxic if ingested'],
  },
  'ficus': {
    category: 'caution',
    summary: 'Fig family. Some have edible fruit, but most have irritating milky sap.',
    uses: ['Ornamental', 'Some species have edible fruit'],
    warnings: ['Milky sap irritates skin', 'Most ornamental species mildly toxic to pets'],
  },
  'dracaena': {
    category: 'toxic',
    summary: 'Dracaena family. Common houseplants, toxic to pets.',
    uses: ['Ornamental only'],
    warnings: ['Toxic to cats and dogs'],
  },
  'dieffenbachia': {
    category: 'toxic',
    summary: 'Dumb cane family. Toxic sap causes mouth swelling.',
    uses: ['Ornamental only'],
    warnings: ['Severe mouth and throat irritation', 'Keep away from children and pets'],
  },
  'dioscorea': {
    category: 'caution',
    summary: 'Yam family. Edible when cooked, toxic raw.',
    uses: ['Staple food (cooked)'],
    warnings: ['Must be cooked — raw yams contain toxins'],
  },
  'cucurbita': {
    category: 'edible',
    summary: 'Squash / pumpkin family. Edible.',
    uses: ['Edible vegetable and seeds'],
    warnings: ['Discard if taste is unusually bitter — may contain toxic cucurbitacins'],
  },
  'brassica': {
    category: 'edible',
    summary: 'Cabbage family. Edible vegetables.',
    uses: ['Edible vegetable'],
    warnings: [],
  },
  'aloe': {
    category: 'medicinal',
    summary: 'Aloe family. Gel used for skin; latex is a laxative.',
    uses: ['Topical skin care', 'Burn relief'],
    warnings: ['Latex layer should not be eaten', 'Toxic to pets'],
  },
  'jatropha': {
    category: 'toxic',
    summary: 'Jatropha family. Most species toxic.',
    uses: ['Ornamental only'],
    warnings: ['Seeds especially toxic', 'Keep away from children'],
  },
  'datura': {
    category: 'toxic',
    summary: 'Datura family. All species highly toxic.',
    uses: ['No safe use'],
    warnings: ['All parts cause delirium, seizures, and death', 'Extremely dangerous'],
  },
  'kalanchoe': {
    category: 'toxic',
    summary: 'Kalanchoe family. Toxic to pets.',
    uses: ['Ornamental only'],
    warnings: ['Contains cardiac glycosides', 'Toxic to cats and dogs'],
  },
  'amaranthus': {
    category: 'edible',
    summary: 'Amaranth family. Edible leaves and grain.',
    uses: ['Edible vegetable', 'Grain'],
    warnings: ['High oxalate in some species'],
  },
};

export function getSafetyInfo(scientificName) {
  if (!scientificName) return null;

  const normalized = scientificName
    .toLowerCase()
    .trim()
    .replace(/\s+×\s+/g, ' ')
    .replace(/\s+x\s+/g, ' ')
    .replace(/\s+/g, ' ');

  if (PLANT_SAFETY[normalized]) {
    return PLANT_SAFETY[normalized];
  }

  const genus = normalized.split(' ')[0];
  if (PLANT_SAFETY[genus]) {
    return {
      ...PLANT_SAFETY[genus],
      summary: PLANT_SAFETY[genus].summary + ' (Genus-level match — specific species may vary.)',
    };
  }

  return null;
}

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