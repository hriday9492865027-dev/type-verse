export interface TypingSessionPayload {
  mode: string;
  durationSeconds: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  totalChars: number;
  correctChars: number;
  incorrectChars: number;
}

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

export function validateTypingSessionPayload(payload: Partial<TypingSessionPayload>): ValidationResult {
  if (!payload) {
    return { isValid: false, reason: 'Payload cannot be null or undefined' };
  }

  const { durationSeconds, wpm, rawWpm, accuracy, totalChars, correctChars, incorrectChars } = payload;

  if (typeof durationSeconds !== 'number' || durationSeconds <= 0 || durationSeconds > 3600) {
    return { isValid: false, reason: 'Invalid durationSeconds' };
  }

  if (typeof wpm !== 'number' || wpm < 0 || wpm > 250) {
    return { isValid: false, reason: 'WPM out of valid human range (0-250)' };
  }

  if (typeof accuracy !== 'number' || accuracy < 0 || accuracy > 100) {
    return { isValid: false, reason: 'Accuracy must be between 0 and 100' };
  }

  if (typeof totalChars !== 'number' || totalChars < 0) {
    return { isValid: false, reason: 'Invalid totalChars' };
  }

  if (typeof correctChars === 'number' && typeof incorrectChars === 'number') {
    if (correctChars + incorrectChars > totalChars + 50) { // allow small extra buffer
      return { isValid: false, reason: 'Character counts do not balance' };
    }
  }

  return { isValid: true };
}
