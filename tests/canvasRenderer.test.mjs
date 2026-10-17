import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FISCALIS_MEDIA,
  getMediaById,
  filterMediaByCategory,
  calculateFitDimensions,
  formatTime,
  FISCALIS_NARRATION_CUES,
  getActiveNarrationCue
} from '../src/data/fiscalisMedia.ts';

test('fiscalisMedia: dataset integrity', (t) => {
  assert.equal(FISCALIS_MEDIA.length, 9, 'Should have exactly 9 media items (1 video demo + 8 screenshots)');

  const videoItems = FISCALIS_MEDIA.filter(item => item.type === 'video');
  const imageItems = FISCALIS_MEDIA.filter(item => item.type === 'image');

  assert.equal(videoItems.length, 1, 'Should have exactly 1 video demo item (24s)');
  assert.equal(imageItems.length, 8, 'Should have 8 mobile screenshots');

  // Check unique IDs
  const ids = new Set(FISCALIS_MEDIA.map(i => i.id));
  assert.equal(ids.size, 9, 'All media IDs must be unique');

  // Verify paths begin with /images/fiscalis/
  for (const item of FISCALIS_MEDIA) {
    assert.match(item.src, /^\/images\/fiscalis\//, `Src ${item.src} must be located in /images/fiscalis/`);
    assert.ok(item.title.length > 5, 'Title should be descriptive');
    assert.ok(item.description.length > 20, 'Description should be informative');
    assert.ok(item.technicalHighlights.length >= 2, 'Must have at least 2 technical highlights');
    assert.ok(item.aspectRatio > 0, 'Aspect ratio must be positive');
  }
});

test('fiscalisMedia: lookup and filtering', (t) => {
  const item = getMediaById('demo-resumen');
  assert.ok(item, 'Should find demo-resumen');
  assert.equal(item.category, 'video');

  const notFound = getMediaById('non-existent-id');
  assert.equal(notFound, undefined, 'Unknown ID returns undefined');

  const all = filterMediaByCategory('all');
  assert.equal(all.length, 9);

  const videos = filterMediaByCategory('video');
  assert.equal(videos.length, 1);

  const mobile = filterMediaByCategory('mobile');
  assert.equal(mobile.length, 8);
});

test('canvasRenderer math: calculateFitDimensions letterboxing', (t) => {
  // Test landscape container with landscape video (1920x912)
  const fit1 = calculateFitDimensions(1000, 600, 1920, 912, 0);
  assert.ok(fit1.width <= 1000, 'Width must fit in container');
  assert.ok(fit1.height <= 600, 'Height must fit in container');
  assert.ok(fit1.x >= 0, 'X must be centered');
  assert.ok(fit1.y >= 0, 'Y must be centered');

  // Test landscape container with tall mobile screen (723x1600)
  const fit2 = calculateFitDimensions(1000, 600, 723, 1600, 20);
  assert.ok(fit2.height <= 560, 'Height must respect padding');
  assert.ok(fit2.width < 560, 'Width must be scaled proportionally');
  assert.ok(fit2.x > 0, 'Must be horizontally centered with letterboxing');

  // Test zero or negative bounds resilience
  const fit3 = calculateFitDimensions(0, 0, 100, 100, 10);
  assert.ok(fit3.width > 0, 'Resilient against zero container width');
  assert.ok(fit3.height > 0, 'Resilient against zero container height');
});

test('canvasRenderer math: formatTime formatting', (t) => {
  assert.equal(formatTime(0), '00:00');
  assert.equal(formatTime(9), '00:09');
  assert.equal(formatTime(60), '01:00');
  assert.equal(formatTime(88), '01:28');
  assert.equal(formatTime(3599), '59:59');
  assert.equal(formatTime(-5), '00:00');
  assert.equal(formatTime(NaN), '00:00');
});

test('fiscalisMedia: AI narration cues and active cue lookup', (t) => {
  assert.ok(Array.isArray(FISCALIS_NARRATION_CUES));
  assert.equal(FISCALIS_NARRATION_CUES.length, 5);

  // Check timeline sequential continuity
  for (let i = 0; i < FISCALIS_NARRATION_CUES.length; i++) {
    const cue = FISCALIS_NARRATION_CUES[i];
    assert.ok(cue.start >= 0);
    assert.ok(cue.end > cue.start);
    assert.ok(cue.badge.length > 0);
    assert.ok(cue.interlocutorText.length > 10);

    if (i > 0) {
      assert.equal(cue.start, FISCALIS_NARRATION_CUES[i - 1].end);
    }
  }

  // Lookup at key video moments:
  // 1s -> splashart
  const cue0 = getActiveNarrationCue(1.0);
  assert.ok(cue0?.badge.includes('Identidad'));

  // 6s -> login admin/admin
  const cue6 = getActiveNarrationCue(6.0);
  assert.ok(cue6?.interlocutorText.includes('admin admin'));

  // 12s -> formulario & GPS
  const cue12 = getActiveNarrationCue(12.0);
  assert.ok(cue12?.interlocutorText.includes('GPS'));

  // 18s -> TOTP
  const cue18 = getActiveNarrationCue(18.0);
  assert.ok(cue18?.interlocutorText.includes('TOTP'));

  // 22s -> offline
  const cue22 = getActiveNarrationCue(22.0);
  assert.ok(cue22?.interlocutorText.includes('offline'));

  // 99s -> undefined
  assert.equal(getActiveNarrationCue(99), undefined);
});

