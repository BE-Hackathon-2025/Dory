import { usePersonalize } from './personalizeStore';

export function getDraftAndProfile() {
  const s = usePersonalize.getState();
  return {
    draftText: typeof s.draftText === 'string' ? s.draftText : '',
    profile: s.profile || {
      ageGroup: null,
      gradeLevel: null,
      learningNeed: null,
      font: null,
      background: null,
      reducedMotion: false,
    },
  };
}

export function retrieveProfile() {
  return getDraftAndProfile().profile;
}

export function buildSummarizePayload({ text = null, mode = 'summary' } = {}) {
  const { draftText, profile } = getDraftAndProfile();
  return {
    text: (text !== null && text !== undefined) ? text : (draftText || ''),
    profile,
    mode,
  };
}
