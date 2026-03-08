/**
 * Audio analysis utilities using Web Audio API
 * - Waveform extraction for timeline display
 * - Beat detection using energy-based onset detection
 */

export interface AudioAnalysisResult {
  waveformData: number[]; // normalized 0-1, ~500 samples for display
  beats: number[]; // timestamps in seconds
  duration: number;
}

/**
 * Analyze an audio file and extract waveform data + beat timestamps
 */
export async function analyzeAudio(file: File): Promise<AudioAnalysisResult> {
  const audioContext = new AudioContext();
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const duration = audioBuffer.duration;
  const waveformData = extractWaveform(audioBuffer, 500);
  const beats = detectBeats(audioBuffer);

  await audioContext.close();

  return { waveformData, beats, duration };
}

/**
 * Extract a downsampled waveform from audio buffer
 */
function extractWaveform(buffer: AudioBuffer, samples: number): number[] {
  const rawData = buffer.getChannelData(0); // mono or left channel
  const blockSize = Math.floor(rawData.length / samples);
  const waveform: number[] = [];

  for (let i = 0; i < samples; i++) {
    const start = i * blockSize;
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(rawData[start + j] || 0);
    }
    waveform.push(sum / blockSize);
  }

  // Normalize to 0-1
  const max = Math.max(...waveform, 0.001);
  return waveform.map(v => v / max);
}

/**
 * Simple energy-based beat detection
 * Compares short-term energy to local average energy
 */
function detectBeats(buffer: AudioBuffer): number[] {
  const rawData = buffer.getChannelData(0);
  const sampleRate = buffer.sampleRate;
  
  // Window size for energy calculation (~43ms at 44.1kHz)
  const windowSize = Math.floor(sampleRate * 0.043);
  // Number of windows to average for local energy
  const localAvgWindows = 20;
  // Sensitivity threshold multiplier
  const threshold = 1.4;
  // Minimum time between beats (prevents double-detection)
  const minBeatInterval = 0.2; // seconds
  
  const energies: number[] = [];
  
  // Calculate energy for each window
  for (let i = 0; i < rawData.length; i += windowSize) {
    let energy = 0;
    for (let j = 0; j < windowSize && (i + j) < rawData.length; j++) {
      energy += rawData[i + j] * rawData[i + j];
    }
    energies.push(energy / windowSize);
  }
  
  const beats: number[] = [];
  let lastBeatTime = -minBeatInterval;
  
  for (let i = localAvgWindows; i < energies.length; i++) {
    // Calculate local average energy
    let localAvg = 0;
    for (let j = i - localAvgWindows; j < i; j++) {
      localAvg += energies[j];
    }
    localAvg /= localAvgWindows;
    
    // If current energy exceeds threshold * local average, it's a beat
    if (energies[i] > threshold * localAvg && energies[i] > 0.001) {
      const time = (i * windowSize) / sampleRate;
      if (time - lastBeatTime >= minBeatInterval) {
        beats.push(Math.round(time * 1000) / 1000); // round to ms
        lastBeatTime = time;
      }
    }
  }
  
  return beats;
}

/**
 * Check if a given time is near a beat (within tolerance)
 */
export function isNearBeat(time: number, beats: number[], tolerance = 0.05): boolean {
  return beats.some(beat => Math.abs(time - beat) < tolerance);
}

/**
 * Get the intensity of beat proximity (0-1, 1 = exactly on beat)
 */
export function getBeatIntensity(time: number, beats: number[], decayMs = 150): number {
  let maxIntensity = 0;
  for (const beat of beats) {
    const diff = Math.abs(time - beat) * 1000; // convert to ms
    if (diff < decayMs) {
      const intensity = 1 - (diff / decayMs);
      maxIntensity = Math.max(maxIntensity, intensity);
    }
  }
  return maxIntensity;
}
