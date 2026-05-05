import * as Speech from 'expo-speech';

let currentlyPlaying = false;

// "Sprout" voice profile — slightly higher pitch, friendly pace
const SPROUT_VOICE = {
  pitch: 1.05,
  rate: 0.92,
};

/**
 * Compose a narration script for a scanned plant.
 * Sprout speaks like a friendly sidekick — short, warm, a bit of personality.
 */
function buildScanScript(result, safety) {
  const lines = [];
  const cat = safety.category;

  // Opening line
  lines.push(`I've got a match, partner.`);
  lines.push(`This is ${result.commonName}.`);

  // Category-specific line
  if (cat === 'edible') {
    lines.push(`Good news — this one's edible.`);
  } else if (cat === 'medicinal') {
    lines.push(`Interesting find — it has medicinal uses.`);
  } else if (cat === 'toxic') {
    lines.push(`Careful! This plant is toxic. Don't eat it, and keep it away from kids and pets.`);
  } else if (cat === 'caution') {
    lines.push(`Handle this one with care — there are some warnings.`);
  } else {
    lines.push(`We don't have safety info for this one yet, so play it safe.`);
  }

  // Add a use or warning if available
  if (safety.uses && safety.uses.length > 0 && cat !== 'unknown') {
    lines.push(`Common uses include: ${safety.uses.slice(0, 2).join(', ')}.`);
  }

  if (safety.warnings && safety.warnings.length > 0) {
    lines.push(`One warning: ${safety.warnings[0]}.`);
  }

  return lines.join(' ');
}

/**
 * Speak a plant scan result aloud as Sprout.
 * Cancels any ongoing narration first.
 */
export async function narrateScan(result, safety, callbacks = {}) {
  await stopNarration();

  const script = buildScanScript(result, safety);
  currentlyPlaying = true;

  Speech.speak(script, {
    ...SPROUT_VOICE,
    onStart: () => {
      currentlyPlaying = true;
      callbacks.onStart?.();
    },
    onDone: () => {
      currentlyPlaying = false;
      callbacks.onDone?.();
    },
    onStopped: () => {
      currentlyPlaying = false;
      callbacks.onStopped?.();
    },
    onError: (err) => {
      currentlyPlaying = false;
      callbacks.onError?.(err);
    },
  });
}

/**
 * Speak a custom Sprout line (used for tooltips, encouragement, etc.)
 */
export async function speakAsSprout(text, callbacks = {}) {
  await stopNarration();
  currentlyPlaying = true;
  Speech.speak(text, {
    ...SPROUT_VOICE,
    onDone: () => {
      currentlyPlaying = false;
      callbacks.onDone?.();
    },
    onStopped: () => {
      currentlyPlaying = false;
      callbacks.onStopped?.();
    },
  });
}

/**
 * Stop any narration in progress.
 */
export async function stopNarration() {
  const speaking = await Speech.isSpeakingAsync();
  if (speaking) {
    await Speech.stop();
  }
  currentlyPlaying = false;
}

/**
 * Check if narration is currently playing.
 */
export function isNarrating() {
  return currentlyPlaying;
}