/**
 * Migration / maintenance: rebuilds typography in tokens/*.json from each file's
 * headline1–3, text1–3, body1, button1, caption1. Run once after pulling old tokens:
 *   node scripts/build-typography-tokens.mjs
 * Re-running after migration will fail (body1 / button1 keys are removed).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokensDir = path.join(__dirname, '..', 'tokens');

function rem(n) {
  const s = Number(n).toFixed(4).replace(/\.?0+$/, '');
  return `${s}rem`;
}

function headlineSteps(h3fs) {
  const r = h3fs / 2;
  const rows = [
    [1.75, 2.25, 0.025],
    [1.55, 2.05, 0.02],
    [1.4, 1.88, 0.018],
    [1.28, 1.72, 0.016],
    [1.18, 1.58, 0.014],
    [1.08, 1.46, 0.012],
    [1, 1.35, 0.01],
    [0.92, 1.24, 0.009],
    [0.85, 1.14, 0.008],
  ];
  return rows.map(([fs, lh, ls]) => ({
    fontSize: rem(fs * r),
    lineHeight: rem(lh * r),
    letterSpacing: `${(ls * r).toFixed(5)}rem`,
    fontWeight: '700',
  }));
}

function buildTypography(prev) {
  const h1 = prev.headline1;
  const h2 = prev.headline2;
  const h3 = prev.headline3;
  const t1 = prev.text1;
  const t2 = prev.text2;
  const t3 = prev.text3;
  const body = prev.body1;
  const btn = prev.button1;
  const cap = prev.caption1;

  const h3fs = parseFloat(String(h3.fontSize).replace('rem', ''));

  const steps = headlineSteps(h3fs);
  const headlineFont = h1.fontFamily;

  const ty = {};

  ty.headline1 = { ...h1 };
  ty.headline2 = { ...h2 };
  ty.headline3 = { ...h3 };
  for (let i = 0; i < 9; i++) {
    const n = i + 4;
    ty[`headline${n}`] = {
      fontFamily: headlineFont,
      ...steps[i],
    };
  }

  ty.text1 = { ...t1 };
  ty.text2 = { ...t2 };
  ty.text3 = { ...t3 };
  ty.text4 = {
    fontFamily: t3.fontFamily,
    fontSize: t3.fontSize,
    lineHeight: t3.lineHeight,
    fontWeight: '700',
    ...(t3.letterSpacing != null ? { letterSpacing: t3.letterSpacing } : {}),
  };

  const t1fs = parseFloat(String(t1.fontSize).replace('rem', ''));
  const scale = t1fs / 1.5;

  ty.text5 = {
    fontFamily: t1.fontFamily,
    fontSize: rem(1.35 * scale),
    lineHeight: rem(1.85 * scale),
    fontWeight: '400',
    ...(t1.letterSpacing != null ? { letterSpacing: t1.letterSpacing } : {}),
  };
  ty.text6 = {
    fontFamily: t1.fontFamily,
    fontSize: rem(1.3 * scale),
    lineHeight: rem(1.78 * scale),
    fontWeight: '400',
    ...(t1.letterSpacing != null ? { letterSpacing: t1.letterSpacing } : {}),
  };
  ty.text7 = {
    fontFamily: t1.fontFamily,
    fontSize: rem(1.22 * scale),
    lineHeight: rem(1.68 * scale),
    fontWeight: '400',
    ...(t1.letterSpacing != null ? { letterSpacing: t1.letterSpacing } : {}),
  };
  ty.text8 = {
    fontFamily: t1.fontFamily,
    fontSize: rem(0.78 * scale),
    lineHeight: rem(1.12 * scale),
    fontWeight: '400',
    ...(t1.letterSpacing != null ? { letterSpacing: t1.letterSpacing } : {}),
  };
  ty.text9 = {
    fontFamily: t1.fontFamily,
    fontSize: rem(0.78 * scale),
    lineHeight: rem(1.12 * scale),
    fontWeight: '700',
    ...(t1.letterSpacing != null ? { letterSpacing: t1.letterSpacing } : {}),
  };

  ty.paragraph1 = { ...body };
  ty.paragraph2 = {
    fontFamily: body.fontFamily,
    fontSize: rem(parseFloat(String(body.fontSize).replace('rem', '')) * (1.5 / 1.6)),
    lineHeight: rem(parseFloat(String(body.lineHeight).replace('rem', '')) * (2 / 2.2)),
    fontWeight: body.fontWeight,
    ...(body.letterSpacing != null ? { letterSpacing: body.letterSpacing } : {}),
  };
  ty.paragraph3 = {
    fontFamily: body.fontFamily,
    fontSize: rem(parseFloat(String(body.fontSize).replace('rem', '')) * (1.4 / 1.6)),
    lineHeight: rem(parseFloat(String(body.lineHeight).replace('rem', '')) * (1.9 / 2.2)),
    fontWeight: body.fontWeight,
    ...(body.letterSpacing != null ? { letterSpacing: body.letterSpacing } : {}),
  };
  ty.paragraph4 = {
    fontFamily: body.fontFamily,
    fontSize: rem(parseFloat(String(body.fontSize).replace('rem', '')) * (1.3 / 1.6)),
    lineHeight: rem(parseFloat(String(body.lineHeight).replace('rem', '')) * (1.75 / 2.2)),
    fontWeight: body.fontWeight,
    ...(body.letterSpacing != null ? { letterSpacing: body.letterSpacing } : {}),
  };

  ty.button = {
    fontFamily: btn.fontFamily,
    fontSize: btn.fontSize,
    lineHeight: btn.lineHeight,
    fontWeight: btn.fontWeight,
    ...(btn.letterSpacing != null ? { letterSpacing: btn.letterSpacing } : {}),
    ...(btn.textTransform != null ? { textTransform: btn.textTransform } : {}),
  };

  ty.links = {
    fontFamily: t1.fontFamily,
    fontSize: t1.fontSize,
    lineHeight: t1.lineHeight,
    fontWeight: '500',
    textDecoration: 'underline',
    ...(t1.letterSpacing != null ? { letterSpacing: t1.letterSpacing } : {}),
  };

  ty.ribbons = {
    fontFamily: t1.fontFamily,
    fontSize: rem(0.72 * scale),
    lineHeight: rem(1 * scale),
    fontWeight: '700',
    letterSpacing: rem(0.1 * scale),
    textTransform: 'uppercase',
  };

  return ty;
}

for (const name of fs.readdirSync(tokensDir)) {
  if (!name.endsWith('.json') || name === 'shared.json') continue;
  const fp = path.join(tokensDir, name);
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const prev = data.typography;
  if (!prev?.headline1 || !prev.body1 || !prev.button1) {
    console.warn(`skip ${name}: missing expected keys`);
    continue;
  }
  data.typography = buildTypography(prev);
  fs.writeFileSync(fp, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`updated ${name}`);
}
