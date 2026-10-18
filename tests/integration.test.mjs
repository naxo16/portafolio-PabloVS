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
