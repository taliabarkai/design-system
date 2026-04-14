'use client';

import { useState } from 'react';
import { Heading } from '@/components';
import styles from './page.module.css';
import ibTokens from '../../tokens/ib.json';
import lalTokens from '../../tokens/lal.json';
import mnnTokens from '../../tokens/mnn.json';
import oalTokens from '../../tokens/oal.json';
import tgrTokens from '../../tokens/tgr.json';

type Theme = 'oal' | 'lal' | 'ib' | 'tgr' | 'mnn';

type TypographyRule = {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  fontWeight?: string;
  letterSpacing?: string;
  fontSizeMobile?: string;
  lineHeightMobile?: string;
  letterSpacingMobile?: string;
  textTransform?: string;
  textDecoration?: string;
  fontStyle?: string;
};

/** Snippet-only: convert `NNpx` → rem (1rem = 16px). Rem, %, and other units unchanged. */
function cssLengthPxToRemForSnippet(val: string | undefined): string | undefined {
  if (val == null || val.trim() === '') return undefined;
  const t = val.trim();
  const m = t.match(/^(-?[\d.]+)\s*px$/i);
  if (!m) return t;
  const px = parseFloat(m[1]);
  if (Number.isNaN(px)) return t;
  const rem = Math.round((px / 16) * 1e6) / 1e6;
  const formatted = String(rem).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
  return `${formatted}rem`;
}

/** CSS block matching the `.typography-{variant}` utility for copy/reference. */
function buildTypographyCssSnippet(variant: string, rule: TypographyRule): string {
  const selector = `.typography-${variant}`;
  const decls: string[] = [];
  const add = (prop: string, val: string | undefined) => {
    if (val != null && String(val).trim() !== '') decls.push(`  ${prop}: ${val};`);
  };
  add('font-family', rule.fontFamily);
  add('font-size', cssLengthPxToRemForSnippet(rule.fontSize));
  add('line-height', cssLengthPxToRemForSnippet(rule.lineHeight));
  add('font-weight', rule.fontWeight);
  add('letter-spacing', cssLengthPxToRemForSnippet(rule.letterSpacing));
  add('text-transform', rule.textTransform);
  add('text-decoration', rule.textDecoration);
  add('font-style', rule.fontStyle);

  let out = `${selector} {\n${decls.join('\n')}\n}`;

  const mobile: string[] = [];
  const addM = (prop: string, val: string | undefined) => {
    if (val != null && String(val).trim() !== '') mobile.push(`    ${prop}: ${val};`);
  };
  addM('font-size', cssLengthPxToRemForSnippet(rule.fontSizeMobile));
  addM('line-height', cssLengthPxToRemForSnippet(rule.lineHeightMobile));
  addM('letter-spacing', cssLengthPxToRemForSnippet(rule.letterSpacingMobile));

  if (mobile.length > 0) {
    out += `\n\n@media (max-width: 768px) {\n  ${selector} {\n${mobile.join('\n')}\n  }\n}`;
  }

  return out;
}

/** Assumes 1rem = 16px (root default). Returns a px label or null if not a rem/px length. */
function lengthToPxLabel(cssValue: string | undefined): string | null {
  if (!cssValue?.trim()) return null;
  const t = cssValue.trim();
  const remM = t.match(/^(-?[\d.]+)\s*rem$/i);
  if (remM) {
    const px = Math.round(parseFloat(remM[1]) * 16 * 1000) / 1000;
    return `${px}px`;
  }
  const pxM = t.match(/^(-?[\d.]+)\s*px$/i);
  if (pxM) return `${pxM[1]}px`;
  return null;
}

function letterSpacingPxPhrase(cssValue: string | undefined): string | null {
  if (cssValue == null || cssValue.trim() === '') return null;
  const t = cssValue.trim();
  if (t === 'normal' || t === '0') return 'normal';
  const px = lengthToPxLabel(t);
  return px ?? t;
}

function pushPxBits(
  bits: string[],
  fontSize: string | undefined,
  lineHeight: string | undefined,
  letterSpacing: string | undefined,
) {
  const fs = lengthToPxLabel(fontSize);
  if (fs) bits.push(`font-size ${fs}`);
  const lh = lengthToPxLabel(lineHeight);
  if (lh) bits.push(`line-height ${lh}`);
  const ls = letterSpacingPxPhrase(letterSpacing);
  if (ls) bits.push(`letter-spacing ${ls}`);
}

/** Designer-readable px line(s) under the CSS snippet. */
function TypographyPxReference({ rule }: { rule: TypographyRule }) {
  const desktopBits: string[] = [];
  pushPxBits(desktopBits, rule.fontSize, rule.lineHeight, rule.letterSpacing);

  /* Same fallbacks as generated CSS: mobile uses *-mobile tokens when set, else desktop. */
  const mobileBits: string[] = [];
  pushPxBits(
    mobileBits,
    rule.fontSizeMobile ?? rule.fontSize,
    rule.lineHeightMobile ?? rule.lineHeight,
    rule.letterSpacingMobile ?? rule.letterSpacing,
  );

  if (desktopBits.length === 0 && mobileBits.length === 0) return null;

  const desktopStr = desktopBits.join(' · ');
  const mobileStr = mobileBits.join(' · ');
  const sameForBoth = desktopStr === mobileStr && desktopStr.length > 0;

  return (
    <div className={`${styles.typographyPxRef} ${styles.chromeUiFont}`}>
      <p className={styles.typographyPxRefTitle}>Px reference (1rem = 16px)</p>
      {sameForBoth ? (
        <p className={styles.typographyPxRefLine}>
          <span className={`${styles.typographyPxRefTag} ${styles.typographyPxRefTagWide}`}>
            Mobile & Desktop
          </span>
          {desktopStr}
        </p>
      ) : (
        <>
          {desktopBits.length > 0 && (
            <p className={styles.typographyPxRefLine}>
              <span className={styles.typographyPxRefTag}>Desktop</span>
              {desktopStr}
            </p>
          )}
          {mobileBits.length > 0 && (
            <p className={styles.typographyPxRefLine}>
              <span className={styles.typographyPxRefTag}>Mobile</span>
              {mobileStr}
            </p>
          )}
        </>
      )}
    </div>
  );
}

const THEME_TYPOGRAPHY: Record<Theme, Record<string, TypographyRule>> = {
  oal: oalTokens.typography as Record<string, TypographyRule>,
  lal: lalTokens.typography as Record<string, TypographyRule>,
  ib: ibTokens.typography as Record<string, TypographyRule>,
  tgr: tgrTokens.typography as Record<string, TypographyRule>,
  mnn: mnnTokens.typography as Record<string, TypographyRule>,
};

function typographyDisplayName(variant: string): string {
  if (variant === 'links') return 'Links';
  if (variant === 'ribbons') return 'Ribbons';
  const match = variant.match(/^(headline|text|paragraph)(\d+)$/i);
  if (match) {
    const [, kind, num] = match;
    const title =
      kind!.toLowerCase() === 'headline'
        ? 'Headline'
        : kind!.toLowerCase() === 'text'
          ? 'Text'
          : 'Paragraph';
    return `${title} ${num}`;
  }
  return variant;
}

const TYPOGRAPHY_PREVIEW = 'The quick brown fox jumps over the lazy dog';

function typographyPreviewText(variant: string): string {
  if (variant === 'button') return 'ADD TO BAG';
  if (variant === 'button2') return 'Add To Bag';
  if (variant === 'links') return 'Continue Shopping';
  if (variant === 'ribbons') return '20% OFF';
  return TYPOGRAPHY_PREVIEW;
}

const TYPOGRAPHY_ROWS: { variant: string; label?: string }[] = [
  ...Array.from({ length: 12 }, (_, i) => ({ variant: `headline${i + 1}` })),
  { variant: 'text1', label: 'Text 1' },
  { variant: 'text2', label: 'Text 2' },
  { variant: 'text3', label: 'Text 3' },
  { variant: 'text4', label: 'Text 4' },
  { variant: 'text5' },
  { variant: 'text6' },
  { variant: 'text7' },
  { variant: 'text8', label: 'text 8' },
  { variant: 'text9', label: 'Text 9' },
  { variant: 'text10' },
  { variant: 'text11' },
  { variant: 'disclaimer1', label: 'Disclaimer 1' },
  { variant: 'disclaimer2', label: 'Disclaimer 2' },
  { variant: 'paragraph1' },
  { variant: 'paragraph2' },
  { variant: 'paragraph3' },
  { variant: 'paragraph4' },
  { variant: 'button', label: 'Button 1' },
  { variant: 'button2', label: 'Button 2' },
  { variant: 'links' },
  { variant: 'ribbons' },
];

const brands = [
  { value: 'oal', label: 'OAL', description: 'Oak & Luna' },
  { value: 'lal', label: 'LAL', description: 'Lime & Lou' },
  { value: 'ib', label: 'IB', description: 'Israel Blessing' },
  { value: 'tgr', label: 'TGR', description: 'Theo Grace' },
  { value: 'mnn', label: 'MNN', description: 'MYKA' },
];

function brandTypographyStylesTitle(theme: Theme): string {
  const brand = brands.find((b) => b.value === theme);
  if (!brand) return 'Typography styles';
  const name = brand.description.replace(/\s*&\s*/g, ' and ');
  return `${name} Typography styles`;
}

export default function DesignSystemPage() {
  const [theme, setTheme] = useState<Theme>('oal');

  return (
    <div className={styles.container} data-theme={theme}>
      {/* One sticky chrome block (title + brands) so main never stacks above it and steals clicks. */}
      <header className={styles.siteChrome}>
        <div className={styles.headerInner}>
          <Heading level={1} className={styles.headerTitle}>
            Tenengroup Sites Design System
          </Heading>
          <div className={`${styles.brandSelector} ${styles.chromeUiFont}`}>
            {brands.map((brand) => (
              <button
                key={brand.value}
                type="button"
                onClick={() => setTheme(brand.value as Theme)}
                className={`${styles.brandButton} ${theme === brand.value ? styles.active : ''}`}
              >
                <div className={styles.brandName}>{brand.label}</div>
                <div className={styles.brandDesc}>{brand.description}</div>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Scroll lives here only — chrome stays out of the scroll stack so brand tabs always receive clicks. */}
      <div className={styles.pageScroll}>
      <main className={styles.main}>
        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} ${styles.chromeUiFont}`}>
            {brandTypographyStylesTitle(theme)}
          </h2>

          <ul className={styles.typographyList}>
            {TYPOGRAPHY_ROWS.map(({ variant, label }) => {
              const rule = THEME_TYPOGRAPHY[theme][variant];
              return (
                <li
                  key={variant}
                  className={`${styles.typographyListItem} ${rule ? styles.typographyListItemWithCss : ''}`}
                >
                  <span className={styles.typographyRuleName}>
                    {label ?? typographyDisplayName(variant)}
                  </span>
                  <div className={styles.typographyPreviewCol}>
                    <div className={`typography-${variant}`}>{typographyPreviewText(variant)}</div>
                  </div>
                  {rule ? (
                    <div className={styles.typographyCssCol}>
                      <details className={styles.typographyCssDetails}>
                        <summary
                          className={`${styles.typographyCssSummary} ${styles.chromeUiFont}`}
                        >
                          CSS Typography Rules
                        </summary>
                        <pre className={styles.typographyCssPre}>
                          <code>{buildTypographyCssSnippet(variant, rule)}</code>
                        </pre>
                        <TypographyPxReference rule={rule} />
                      </details>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      <footer className={`${styles.footer} ${styles.chromeUiFont}`}>
        <p className={styles.footerText}>© 2026 Tenengroup Sites Design System</p>
      </footer>
      </div>
    </div>
  );
}
