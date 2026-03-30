#!/usr/bin/env node

/**
 * Local Import Runner
 *
 * Runs the import transform against locally-scraped HTML when the live URL
 * is unreachable. Uses the cleaned.html from migration-work/ as the page DOM.
 *
 * Usage:
 *   node tools/importer/run-local-import.js \
 *     --import-script tools/importer/import-homepage.bundle.js \
 *     --html migration-work/cleaned.html \
 *     --url https://business.adobe.com/jp/
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const value = args[i + 1];
      if (!value || value.startsWith('--')) {
        console.error(`Missing value for ${arg}`);
        process.exit(1);
      }
      parsed[arg] = value;
      i++;
    }
  }

  if (!parsed['--import-script'] || !parsed['--html'] || !parsed['--url']) {
    console.error('Usage: node run-local-import.js --import-script <bundle.js> --html <cleaned.html> --url <original-url>');
    process.exit(1);
  }

  return {
    importScript: resolve(parsed['--import-script']),
    htmlFile: resolve(parsed['--html']),
    originalUrl: parsed['--url'],
    outputDir: resolve(process.cwd(), 'content'),
  };
}

function ensureDir(pathname) {
  mkdirSync(pathname, { recursive: true });
}

function sanitizeDocumentPath(docPath, fallbackUrl) {
  if (!docPath || typeof docPath !== 'string') {
    const { pathname } = new URL(fallbackUrl);
    docPath = pathname || '/';
  }
  let normalized = docPath.replace(/\\/g, '/');
  if (normalized.startsWith('/')) normalized = normalized.slice(1);
  if (normalized.endsWith('/')) normalized = normalized.slice(0, -1);
  if (normalized === '') normalized = 'index';
  return normalized;
}

async function main() {
  const { importScript, htmlFile, originalUrl, outputDir } = parseArgs();

  if (!existsSync(importScript)) {
    console.error(`Import script not found: ${importScript}`);
    process.exit(1);
  }
  if (!existsSync(htmlFile)) {
    console.error(`HTML file not found: ${htmlFile}`);
    process.exit(1);
  }

  const htmlContent = readFileSync(htmlFile, 'utf-8');
  const importScriptContent = readFileSync(importScript, 'utf-8');

  // Find helix-importer.js
  const helixPaths = [
    join(__dirname, '../../.claude/plugins/cache/excat-marketplace/excat/2.1.1/skills/excat-content-import/scripts/static/inject/helix-importer.js'),
    '/home/node/.claude/plugins/cache/excat-marketplace/excat/2.1.1/skills/excat-content-import/scripts/static/inject/helix-importer.js',
  ];

  let helixImporterScript;
  for (const p of helixPaths) {
    if (existsSync(p)) {
      helixImporterScript = readFileSync(p, 'utf-8');
      break;
    }
  }
  if (!helixImporterScript) {
    console.error('helix-importer.js not found');
    process.exit(1);
  }

  // Start a local HTTP server to serve the cleaned HTML
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(htmlContent);
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const localUrl = `http://127.0.0.1:${port}/`;

  console.log(`[Local Import] Serving cleaned HTML on port ${port}`);
  console.log(`[Local Import] Original URL: ${originalUrl}`);
  console.log(`[Local Import] Import script: ${importScript}`);

  ensureDir(outputDir);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') console.error(`[Browser] ${text}`);
    else if (type === 'warning') console.warn(`[Browser] ${text}`);
    else console.log(`[Browser] ${text}`);
  });

  try {
    // Navigate to local server (serves cleaned HTML)
    await page.goto(localUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('[Local Import] Page loaded');

    // Inject helix-importer
    await page.evaluate((script) => {
      const originalDefine = window.define;
      if (typeof window.define !== 'undefined') delete window.define;
      const scriptEl = document.createElement('script');
      scriptEl.textContent = script;
      document.head.appendChild(scriptEl);
      if (originalDefine) window.define = originalDefine;
    }, helixImporterScript);

    // Inject import bundle
    await page.evaluate((script) => {
      const scriptEl = document.createElement('script');
      scriptEl.textContent = script;
      document.head.appendChild(scriptEl);
    }, importScriptContent);

    // Wait for CustomImportScript
    await page.waitForFunction(
      () => typeof window.CustomImportScript !== 'undefined' && window.CustomImportScript?.default,
      { timeout: 10000 },
    );

    console.log('[Local Import] Running transform...');

    // Run the transform using the ORIGINAL URL as pageUrl
    const result = await page.evaluate(async (pageUrl) => {
      if (!window.WebImporter || typeof window.WebImporter.html2md !== 'function') {
        throw new Error('WebImporter not available');
      }
      const customImportConfig = window.CustomImportScript?.default;
      if (!customImportConfig) {
        throw new Error('CustomImportScript not available');
      }

      const importResult = await window.WebImporter.html2md(pageUrl, document, customImportConfig, {
        toDocx: false,
        toMd: true,
        originalURL: pageUrl,
      });

      importResult.html = window.WebImporter.md2da(importResult.md);
      return importResult;
    }, originalUrl);

    if (!result.path || typeof result.path !== 'string') {
      throw new Error(`Transform did not return valid path. Got: ${typeof result.path}`);
    }
    if (!result.html || typeof result.html !== 'string') {
      throw new Error(`HTML generation failed. Got: ${typeof result.html}`);
    }

    const relativeDocPath = sanitizeDocumentPath(result.path, originalUrl);
    const plainHtmlPath = join(outputDir, `${relativeDocPath}.plain.html`);
    ensureDir(dirname(plainHtmlPath));
    writeFileSync(plainHtmlPath, result.html, 'utf-8');

    // Write report
    const reportsDir = 'tools/importer/reports';
    const reportPath = join(reportsDir, `${relativeDocPath}.report.json`);
    ensureDir(dirname(reportPath));
    writeFileSync(
      reportPath,
      JSON.stringify({
        status: 'success',
        url: originalUrl,
        path: relativeDocPath,
        timestamp: new Date().toISOString(),
        ...(result.report || {}),
      }, null, 2),
      'utf-8',
    );

    console.log(`[Local Import] ✅ Saved content to content/${relativeDocPath}.plain.html`);
  } catch (error) {
    console.error(`[Local Import] ❌ Failed: ${error.message}`);

    // Write failure report
    const reportsDir = 'tools/importer/reports';
    ensureDir(reportsDir);
    writeFileSync(
      join(reportsDir, 'index.report.json'),
      JSON.stringify({
        status: 'failed',
        url: originalUrl,
        timestamp: new Date().toISOString(),
        error: error.message,
      }, null, 2),
      'utf-8',
    );
  } finally {
    await page.close().catch(() => {});
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
    server.close();
  }
}

main().catch((err) => {
  console.error('[Local Import] Unexpected error:', err);
  process.exit(1);
});
