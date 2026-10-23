import { SelectedPhoto, RankedPhoto } from '@/types/photo';

const COVER_REASONS = [
  'A commanding opening image — bold composition and strong tonal contrast that stops the scroll immediately.',
  'Vivid colour and a clear focal point make this the natural hook for your carousel.',
  'Exceptional visual weight and balance — this is the image that earns the first tap.',
  'An emotionally resonant frame that draws viewers in before they even read the caption.',
  'Clean negative space and a confident subject — the perfect lead-in for a swipe-through sequence.',
];

const RANK_REASONS = [
  'A strong compositional counterpart to the cover — varied enough to hold attention.',
  'Builds the narrative with a shift in perspective that rewards the swipe.',
  'Excellent tonal harmony with the preceding slide — the sequence flows naturally.',
  'Introduces a new detail that deepens the story without losing visual cohesion.',
  'A quieter moment that gives the carousel rhythm and pacing.',
  'Strong textural contrast — keeps the viewer curious about what comes next.',
  'A satisfying pivot point — the energy shifts here in a way that feels intentional.',
  'A confident closing frame — leaves a lasting impression and encourages saves and shares.',
];

function deterministicScore(id: string, salt: string): number {
  let hash = 0;
  const str = id + salt;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 100;
}

export async function analyzePhotos(photos: SelectedPhoto[]): Promise<RankedPhoto[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const scored = photos.map((photo) => {
    const coverScore = deterministicScore(photo.id, 'cover');
    const rankScore = deterministicScore(photo.id, 'rank');
    return { photo, coverScore, rankScore };
  });

  const byCover = [...scored].sort((a, b) => b.coverScore - a.coverScore);
  const coverId = byCover[0].photo.id;

  const ordered = [...scored].sort((a, b) => {
    if (a.photo.id === coverId) return -1;
    if (b.photo.id === coverId) return 1;
    return b.rankScore - a.rankScore;
  });

  return ordered.map((item, index) => ({
    ...item.photo,
    rank: index + 1,
    score: item.rankScore,
    coverScore: item.coverScore,
    isCover: item.photo.id === coverId,
    reason: item.photo.id === coverId
      ? COVER_REASONS[index % COVER_REASONS.length]
      : RANK_REASONS[index % RANK_REASONS.length],
  }));
}
