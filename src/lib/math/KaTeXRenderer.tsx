'use client';

import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathProps {
  math: string;
  block?: boolean;
  className?: string;
}

export function MathRenderer({ math, block = false, className = '' }: MathProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        strict: false,
      });
    } catch (e) {
      console.error('KaTeX rendering error:', e);
      return `<code>${math}</code>`;
    }
  }, [math, block]);

  return (
    <span
      className={`${block ? 'block my-3 text-center overflow-x-auto py-1' : 'inline'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * LaTeX-enabled Markdown Parser:
 * Splits text by $$...$$ (display math) and $...$ (inline math),
 * formatting regular text and math expressions cleanly.
 */
export function LatexText({ text, className = '' }: { text: string; className?: string }) {
  const parts = useMemo(() => {
    if (!text) return [];

    // Match display math $$...$$ first, then inline math $...$
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;
    const tokens: Array<{ type: 'text' | 'inline-math' | 'block-math'; content: string }> = [];

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      // Text preceding match
      if (match.index > lastIndex) {
        tokens.push({
          type: 'text',
          content: text.slice(lastIndex, match.index),
        });
      }

      const matchText = match[0];
      if (matchText.startsWith('$$') && matchText.endsWith('$$')) {
        tokens.push({
          type: 'block-math',
          content: matchText.slice(2, -2).trim(),
        });
      } else if (matchText.startsWith('$') && matchText.endsWith('$')) {
        tokens.push({
          type: 'inline-math',
          content: matchText.slice(1, -1).trim(),
        });
      }

      lastIndex = match.index + matchText.length;
    }

    if (lastIndex < text.length) {
      tokens.push({
        type: 'text',
        content: text.slice(lastIndex),
      });
    }

    return tokens;
  }, [text]);

  return (
    <div className={`leading-relaxed text-academic-800 dark:text-academic-200 ${className}`}>
      {parts.map((p, idx) => {
        if (p.type === 'block-math') {
          return <MathRenderer key={idx} math={p.content} block={true} />;
        }
        if (p.type === 'inline-math') {
          return <MathRenderer key={idx} math={p.content} block={false} />;
        }
        // Basic paragraph / linebreaks for text
        return (
          <span key={idx} className="whitespace-pre-wrap">
            {p.content}
          </span>
        );
      })}
    </div>
  );
}
