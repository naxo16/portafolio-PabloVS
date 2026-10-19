import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FISCALIS_MEDIA } from '../src/data/fiscalisMedia.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

test('integration: dist contains built fiscalis case study and static assets', () => {
  const fiscalisHtmlPath = path.resolve(distDir, 'casos/fiscalis/index.html');
  assert.ok(fs.existsSync(fiscalisHtmlPath), 'dist/casos/fiscalis/index.html must exist');

  const html = fs.readFileSync(fiscalisHtmlPath, 'utf-8');

  // Check critical Canvas DOM elements
  assert.ok(html.includes('id="fiscalis-canvas"'), 'Must contain fiscalis-canvas element');
  assert.ok(html.includes('id="fiscalis-interactive-viewer"'), 'Must contain interactive viewer section');
  assert.ok(html.includes('id="canvas-play-overlay"'), 'Must contain play overlay');
  assert.ok(html.includes('id="video-controls-bar"'), 'Must contain video controls');
  assert.ok(html.includes('id="scrubber-track"'), 'Must contain scrubber track');
  assert.ok(html.includes('id="thumbnails-container"'), 'Must contain thumbnail container');
  assert.ok(html.includes('id="media-details-card"'), 'Must contain technical detail card');

  // Verify all media items are referenced in the built HTML
  for (const item of FISCALIS_MEDIA) {
    assert.ok(
      html.includes(item.id),
      `Built HTML must contain reference to media ID: ${item.id}`
    );
  }

  // Verify all assets are physically present in dist/images/fiscalis
  const distFiscalisImages = path.resolve(distDir, 'images/fiscalis');
  assert.ok(fs.existsSync(distFiscalisImages), 'dist/images/fiscalis folder must exist');

  for (const item of FISCALIS_MEDIA) {
    const filename = path.basename(item.src);
    const assetDistPath = path.resolve(distFiscalisImages, filename);
    assert.ok(
      fs.existsSync(assetDistPath),
      `Static build asset must exist at: ${assetDistPath}`
    );
    const stat = fs.statSync(assetDistPath);
    assert.ok(stat.size > 1000, `Asset ${filename} must have positive byte size in dist`);
  }
});

test('integration: index contains cinematic announcement and popup dialog for Fiscalis', () => {
  const indexHtmlPath = path.resolve(distDir, 'index.html');
  assert.ok(fs.existsSync(indexHtmlPath), 'dist/index.html must exist');

  const html = fs.readFileSync(indexHtmlPath, 'utf-8');
  assert.ok(html.includes('id="fiscalis-cinematic-banner"'), 'Index must include cinematic banner');
  assert.ok(html.includes('id="fiscalis-popup-dialog"'), 'Index must include popup dialog');
  assert.ok(html.includes('id="cinematic-teaser-video"'), 'Index must include teaser video');
  assert.ok(html.includes('fiscalis-demo-resumen.mp4'), 'Index must reference 24s demo video');
});

test('integration: navbar contains animated top slogan bar, dropdowns and accessibility markup', () => {
  const indexHtmlPath = path.resolve(distDir, 'index.html');
  const html = fs.readFileSync(indexHtmlPath, 'utf-8');

  // Verify top slogan bar
  assert.ok(html.includes('id="top-slogan-bar"'), 'Header must contain top-slogan-bar');
  assert.ok(html.includes('Disponible Full-Time'), 'Slogan bar must display availability badge');
  assert.ok(html.includes('Pablo Valdés Sandoval'), 'Slogan bar must display formal name');

  // Verify desktop dropdown navigation
  assert.ok(html.includes('nav-dropdown-wrapper'), 'Must contain dropdown wrapper containers');
  assert.ok(html.includes('dropdown-menu'), 'Must contain dropdown menu elements');
  assert.ok(html.includes('aria-haspopup="true"'), 'Triggers must include aria-haspopup for accessibility');
  assert.ok(html.includes('role="menu"'), 'Dropdowns must include role="menu"');
  assert.ok(html.includes('role="menuitem"'), 'Dropdown items must include role="menuitem"');

  // Verify mobile accordion
  assert.ok(html.includes('mobile-accordion-toggle'), 'Must contain mobile accordion toggle buttons');
  assert.ok(html.includes('mobile-accordion-content'), 'Must contain mobile accordion content sections');
});

test('integration: styles contain naxoresuelve palette tokens and custom scrollbars', () => {
  const globalCssPath = path.resolve(rootDir, 'src/styles/global.css');
  const css = fs.readFileSync(globalCssPath, 'utf-8');

  // Verify naxoresuelve signature background and surfaces
  assert.ok(css.includes('#3a3640'), 'Must include naxoresuelve velvety background #3a3640');
  assert.ok(css.includes('#45404d'), 'Must include naxoresuelve surface #45404d');
  assert.ok(css.includes('#423943'), 'Must include naxoresuelve card container #423943');

  // Verify gold and vino tokens
  assert.ok(css.includes('#cba135'), 'Must include naxoresuelve champagne gold #cba135');
  assert.ok(css.includes('#f2cf6b'), 'Must include naxoresuelve gold light #f2cf6b');
  assert.ok(css.includes('#721828'), 'Must include naxoresuelve deep vino #721828');
  assert.ok(css.includes('#b82d46'), 'Must include naxoresuelve ruby/vino light #b82d46');

  // Verify scrollbars and cyber grid
  assert.ok(css.includes('::-webkit-scrollbar'), 'Must configure custom scrollbars');
  assert.ok(css.includes('.cyber-grid'), 'Must include naxoresuelve cyber-grid');
  assert.ok(css.includes('.vino-gradient-text'), 'Must include vino gradient text');
  assert.ok(css.includes('.gold-gradient-text'), 'Must include gold gradient text');
});

test('integration: accessibility and text-to-speech module are present in built output', () => {
  const indexHtmlPath = path.resolve(distDir, 'index.html');
  const html = fs.readFileSync(indexHtmlPath, 'utf-8');

  // Verify skip to main content link for screen readers and keyboard users
  assert.ok(html.includes('id="skip-to-main"'), 'Must contain skip-to-main link');
  assert.ok(html.includes('href="#main"'), 'Skip link must point to #main');

  // Verify floating accessibility widget and speech synthesis controls
  assert.ok(html.includes('id="accessibility-widget"'), 'Must contain accessibility-widget');
  assert.ok(html.includes('id="a11y-toggle-btn"'), 'Must contain accessibility toggle button');
  assert.ok(html.includes('id="a11y-panel"'), 'Must contain accessibility dialog panel');
  assert.ok(html.includes('id="a11y-tts-play"'), 'Must contain TTS play button');
  assert.ok(html.includes('id="a11y-tts-pause"'), 'Must contain TTS pause button');
  assert.ok(html.includes('id="a11y-tts-stop"'), 'Must contain TTS stop button');
  assert.ok(html.includes('id="a11y-tts-status"'), 'Must contain live region status for screen readers');

  // Verify visual accessibility settings (contrast, motion, font-size)
  assert.ok(html.includes('id="a11y-toggle-contrast"'), 'Must contain contrast toggle switch');
  assert.ok(html.includes('id="a11y-toggle-motion"'), 'Must contain motion reduction toggle switch');
  assert.ok(html.includes('id="a11y-toggle-dyslexic"'), 'Must contain readable font toggle switch');
});

