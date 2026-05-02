const HF_TOKEN = process.env.EXPO_PUBLIC_HF_API_TOKEN;
const MODEL_URL = 'https://router.huggingface.co/hf-inference/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification';

const TREATMENTS = {
  'apple scab': {
    severity: 'moderate',
    treatment: 'Apply fungicide (captan or myclobutanil). Remove fallen infected leaves. Prune for air circulation.',
    prevention: 'Plant resistant varieties. Rake and destroy fallen leaves in autumn.',
    contagious: true,
  },
  'apple black rot': {
    severity: 'high',
    treatment: 'Prune and destroy infected branches and mummified fruit. Apply fungicide during bloom.',
    prevention: 'Remove dead wood and cankers. Maintain good sanitation.',
    contagious: true,
  },
  'apple cedar rust': {
    severity: 'moderate',
    treatment: 'Apply fungicide in spring. Remove nearby juniper/cedar trees if possible.',
    prevention: 'Plant resistant apple varieties. Separate apple trees from cedar/juniper.',
    contagious: true,
  },
  'bacterial spot': {
    severity: 'moderate',
    treatment: 'Apply copper-based bactericide. Remove infected leaves. Avoid overhead watering.',
    prevention: 'Use disease-free seeds and transplants. Rotate crops.',
    contagious: true,
  },
  'black rot': {
    severity: 'high',
    treatment: 'Remove infected plant parts immediately. Apply copper fungicide. Improve drainage.',
    prevention: 'Ensure good air circulation. Avoid wetting foliage.',
    contagious: true,
  },
  'blight': {
    severity: 'high',
    treatment: 'Remove and destroy affected plants. Apply copper-based fungicide to remaining plants.',
    prevention: 'Rotate crops yearly. Avoid overhead irrigation. Use disease-resistant varieties.',
    contagious: true,
  },
  'early blight': {
    severity: 'moderate',
    treatment: 'Remove lower affected leaves. Apply chlorothalonil or copper fungicide weekly.',
    prevention: 'Mulch around base. Avoid overhead watering. Rotate crops every 2-3 years.',
    contagious: true,
  },
  'late blight': {
    severity: 'critical',
    treatment: 'Remove and destroy all infected plants immediately. Apply fungicide to nearby plants.',
    prevention: 'Plant resistant varieties. Avoid crowding. Monitor during cool, wet weather.',
    contagious: true,
  },
  'leaf scorch': {
    severity: 'low',
    treatment: 'Usually environmental — increase watering, provide shade during heat waves.',
    prevention: 'Mulch root zone. Water deeply and consistently. Protect from hot dry wind.',
    contagious: false,
  },
  'leaf spot': {
    severity: 'moderate',
    treatment: 'Remove affected leaves. Apply neem oil or copper fungicide.',
    prevention: 'Improve air circulation. Water at soil level, not on leaves.',
    contagious: true,
  },
  'septoria leaf spot': {
    severity: 'moderate',
    treatment: 'Remove affected lower leaves. Apply copper fungicide weekly. Mulch to prevent soil splash.',
    prevention: 'Avoid overhead watering. Stake plants for airflow. Rotate crops.',
    contagious: true,
  },
  'powdery mildew': {
    severity: 'moderate',
    treatment: 'Apply potassium bicarbonate or neem oil. Remove heavily infected leaves.',
    prevention: 'Space plants for airflow. Avoid excessive nitrogen fertilizer.',
    contagious: true,
  },
  'downy mildew': {
    severity: 'high',
    treatment: 'Remove infected plants. Apply copper-based fungicide. Improve drainage.',
    prevention: 'Avoid overhead watering. Plant in well-ventilated areas.',
    contagious: true,
  },
  'rust': {
    severity: 'moderate',
    treatment: 'Remove infected leaves. Apply sulfur or neem oil fungicide.',
    prevention: 'Ensure good air circulation. Avoid overhead watering.',
    contagious: true,
  },
  'mosaic virus': {
    severity: 'high',
    treatment: 'No cure. Remove and destroy infected plants to prevent spread.',
    prevention: 'Control aphids (virus carriers). Use virus-free seeds. Sanitize tools.',
    contagious: true,
  },
  'target spot': {
    severity: 'moderate',
    treatment: 'Apply chlorothalonil or mancozeb fungicide. Remove affected leaves.',
    prevention: 'Maintain proper spacing. Avoid overhead irrigation.',
    contagious: true,
  },
  'yellow leaf curl virus': {
    severity: 'critical',
    treatment: 'No cure. Remove infected plants. Control whiteflies aggressively.',
    prevention: 'Use reflective mulch to repel whiteflies. Plant resistant varieties.',
    contagious: true,
  },
  'leaf mold': {
    severity: 'moderate',
    treatment: 'Improve ventilation. Remove affected leaves. Apply copper fungicide.',
    prevention: 'Reduce humidity. Space plants widely. Ventilate greenhouses.',
    contagious: true,
  },
  'spider mites': {
    severity: 'moderate',
    treatment: 'Spray with water to dislodge. Apply neem oil or insecticidal soap.',
    prevention: 'Maintain humidity. Avoid dusty conditions. Introduce predatory mites.',
    contagious: true,
  },
  'common rust': {
    severity: 'moderate',
    treatment: 'Apply fungicide if severe. Remove heavily infected leaves.',
    prevention: 'Plant resistant hybrids. Ensure good air circulation.',
    contagious: true,
  },
  'gray leaf spot': {
    severity: 'moderate',
    treatment: 'Apply foliar fungicide. Remove crop debris after harvest.',
    prevention: 'Rotate crops. Use resistant varieties. Till under crop debris.',
    contagious: true,
  },
  'northern leaf blight': {
    severity: 'high',
    treatment: 'Apply foliar fungicide at first sign. Remove infected debris.',
    prevention: 'Plant resistant hybrids. Rotate away from corn for 1-2 years.',
    contagious: true,
  },
  'haunglongbing': {
    severity: 'critical',
    treatment: 'No cure. Remove infected trees to protect others. Control psyllid insects.',
    prevention: 'Use disease-free nursery stock. Control Asian citrus psyllid.',
    contagious: true,
  },
  'esca': {
    severity: 'high',
    treatment: 'Prune infected wood. No chemical cure. Trunk surgery in some cases.',
    prevention: 'Protect pruning wounds. Use clean pruning tools.',
    contagious: false,
  },
  'healthy': {
    severity: 'none',
    treatment: 'No treatment needed — your plant looks great!',
    prevention: 'Keep doing what you\'re doing. Regular watering, good soil, proper light.',
    contagious: false,
  },
};

export async function detectDisease(imageUri) {
  if (!HF_TOKEN) {
    throw new Error('Hugging Face API token not found. Check your .env file.');
  }

  const response = await fetch(imageUri);
  const blob = await response.blob();

  const hfResponse = await fetch(MODEL_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_TOKEN}`,
    },
    body: blob,
  });

  if (!hfResponse.ok) {
    const errorText = await hfResponse.text();
    if (hfResponse.status === 503) {
      throw new Error('Disease model is loading. Please try again in 20 seconds.');
    }
    throw new Error(`Disease detection error ${hfResponse.status}: ${errorText}`);
  }

  const results = await hfResponse.json();

  if (!results || results.length === 0) {
    throw new Error('Could not analyze this image. Try a clearer close-up of a single leaf.');
  }

  const parsed = results.slice(0, 5).map(r => {
    const fullLabel = r.label.replace(/_+/g, ' ').toLowerCase();
    const isHealthy = fullLabel.includes('healthy');

    let plantName = 'Unknown';
    let diseaseName = 'Unknown condition';

    if (r.label.includes('___')) {
      const segments = r.label.split('___');
      plantName = segments[0].replace(/_/g, ' ');
      diseaseName = segments[1].replace(/_/g, ' ');
    } else {
      plantName = r.label.replace(/_/g, ' ');
      diseaseName = isHealthy ? 'Healthy' : r.label.replace(/_/g, ' ');
    }

    return {
      plantName,
      diseaseName,
      isHealthy,
      confidence: Math.round(r.score * 100),
      fullLabel,
    };
  });

  const topResult = parsed[0];
  const treatmentKey = findTreatmentKey(topResult.diseaseName.toLowerCase());
  const treatment = treatmentKey
    ? TREATMENTS[treatmentKey]
    : {
        severity: 'unknown',
        treatment: 'Consult a local plant expert or agricultural extension service for diagnosis.',
        prevention: 'Maintain good plant hygiene. Monitor regularly for changes.',
        contagious: false,
      };

  let vitality;
  if (topResult.isHealthy && topResult.confidence > 50) {
    vitality = Math.min(95, 70 + topResult.confidence * 0.25);
  } else {
    vitality = Math.max(10, 60 - topResult.confidence * 0.5);
  }

  // Flag low confidence — likely means plant is outside model's training data
  const isReliable = topResult.confidence >= 60;

  return {
    topResult,
    allResults: parsed,
    treatment,
    vitality: Math.round(vitality),
    isReliable,
  };
}

function findTreatmentKey(diseaseName) {
  const name = diseaseName.toLowerCase().trim();

  if (TREATMENTS[name]) return name;

  for (const key of Object.keys(TREATMENTS)) {
    if (name.includes(key) || key.includes(name)) {
      return key;
    }
  }

  if (name.includes('healthy')) return 'healthy';
  if (name.includes('scab')) return 'apple scab';
  if (name.includes('early') && name.includes('blight')) return 'early blight';
  if (name.includes('late') && name.includes('blight')) return 'late blight';
  if (name.includes('blight')) return 'blight';
  if (name.includes('rust')) return 'rust';
  if (name.includes('mildew') && name.includes('powder')) return 'powdery mildew';
  if (name.includes('mildew')) return 'downy mildew';
  if (name.includes('mosaic') || name.includes('virus')) return 'mosaic virus';
  if (name.includes('spot') && name.includes('septoria')) return 'septoria leaf spot';
  if (name.includes('spot') && name.includes('bacterial')) return 'bacterial spot';
  if (name.includes('spot')) return 'leaf spot';
  if (name.includes('rot')) return 'black rot';
  if (name.includes('mold')) return 'leaf mold';
  if (name.includes('curl')) return 'yellow leaf curl virus';
  if (name.includes('scorch')) return 'leaf scorch';

  return null;
}

export function getSeverityStyle(severity) {
  const styles = {
    none:     { color: '#6cd9a3', label: 'HEALTHY',  bg: 'rgba(108, 217, 163, 0.15)' },
    low:      { color: '#6cd9a3', label: 'LOW RISK', bg: 'rgba(108, 217, 163, 0.15)' },
    moderate: { color: '#ffb454', label: 'MODERATE', bg: 'rgba(255, 180, 84, 0.15)' },
    high:     { color: '#ff7b8a', label: 'HIGH',     bg: 'rgba(255, 123, 138, 0.15)' },
    critical: { color: '#ff4757', label: 'CRITICAL', bg: 'rgba(255, 71, 87, 0.15)' },
    unknown:  { color: '#8fb4b0', label: 'UNKNOWN',  bg: 'rgba(143, 180, 176, 0.15)' },
  };
  return styles[severity] || styles.unknown;
}