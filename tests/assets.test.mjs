import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FISCALIS_MEDIA } from '../src/data/fiscalisMedia.ts';
import { execFileSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');

test('assets: all FISCALIS_MEDIA files exist on disk with positive size', () => {
  for (const item of FISCALIS_MEDIA) {
    const relativePath = item.src.replace(/^\//, '');
    const absolutePath = path.resolve(publicDir, relativePath);

    assert.ok(fs.existsSync(absolutePath), `File must exist on disk: ${absolutePath}`);
    const stats = fs.statSync(absolutePath);
    assert.ok(stats.size > 1000, `File ${item.src} must be non-empty (was ${stats.size} bytes)`);
  }
});

test('assets: video files must have audio tracks completely removed', () => {
  const ffmpegExe = 'C:/Users/Seiketsu_Yamigiri/AppData/Local/Programs/Python/Python312/Lib/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
  
  if (!fs.existsSync(ffmpegExe)) {
    // If running in CI without ffmpeg, skip this check
    return;
  }

  const videos = FISCALIS_MEDIA.filter(item => item.type === 'video');
  for (const v of videos) {
    const relativePath = v.src.replace(/^\//, '');
    const absPath = path.resolve(publicDir, relativePath);

    try {
      execFileSync(ffmpegExe, ['-i', absPath], { stdio: 'pipe' });
    } catch (err) {
      // ffmpeg exits with 1 when no output file is provided, but prints stream details in stderr
      const stderr = err.stderr ? err.stderr.toString() : '';
      const hasAudio = stderr.includes('Audio:') || stderr.includes('Stream #0:1') && stderr.includes('Audio');
      assert.equal(hasAudio, false, `Video ${v.src} must NOT contain any audio stream! Found audio: ${hasAudio}`);
    }
  }
});

test('assets: no raw or unrenamed legacy files remain in public/images', () => {
  const imagesDir = path.resolve(publicDir, 'images');
  const files = fs.readdirSync(imagesDir);

  for (const f of files) {
    assert.doesNotMatch(f, /Grabaci[oó]n/i, 'No unrenamed screen recordings in public/images');
    assert.doesNotMatch(f, /^thumb_/i, 'No leftover thumbnail files in public/images');
  }
});
