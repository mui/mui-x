import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import { renderMarkdown } from './renderMarkdown';

const { render } = createRenderer();

describe('renderMarkdown', () => {
  describe('inline', () => {
    it('renders **bold** as <strong>', () => {
      render(<React.Fragment>{renderMarkdown('**bold**')}</React.Fragment>);
      const strong = document.querySelector('strong');
      expect(strong).not.toBeNull();
      expect(strong!.textContent).toBe('bold');
    });

    it('renders __bold__ as <strong>', () => {
      render(<React.Fragment>{renderMarkdown('__bold__')}</React.Fragment>);
      const strong = document.querySelector('strong');
      expect(strong).not.toBeNull();
      expect(strong!.textContent).toBe('bold');
    });

    it('renders *italic* as <em>', () => {
      render(<React.Fragment>{renderMarkdown('*italic*')}</React.Fragment>);
      const em = document.querySelector('em');
      expect(em).not.toBeNull();
      expect(em!.textContent).toBe('italic');
    });

    it('renders _italic_ as <em>', () => {
      render(<React.Fragment>{renderMarkdown('_italic_')}</React.Fragment>);
      const em = document.querySelector('em');
      expect(em).not.toBeNull();
      expect(em!.textContent).toBe('italic');
    });

    it('renders `code` as <code>', () => {
      render(<React.Fragment>{renderMarkdown('`code`')}</React.Fragment>);
      const code = document.querySelector('p > code');
      expect(code).not.toBeNull();
      expect(code!.textContent).toBe('code');
    });

    it('renders [label](url) as <a> with href and target="_blank"', () => {
      render(<React.Fragment>{renderMarkdown('[label](url)')}</React.Fragment>);
      const anchor = document.querySelector('a');
      expect(anchor).not.toBeNull();
      expect(anchor!.getAttribute('href')).toBe('url');
      expect(anchor!.getAttribute('target')).toBe('_blank');
      expect(anchor!.textContent).toBe('label');
    });

    it('renders [^1] footnote as <sup>', () => {
      render(<React.Fragment>{renderMarkdown('See here[^1]')}</React.Fragment>);
      const sup = document.querySelector('sup');
      expect(sup).not.toBeNull();
      expect(sup!.textContent).toBe('[1]');
    });

    it('renders nested **bold *italic* bold** as <strong> containing <em>', () => {
      render(<React.Fragment>{renderMarkdown('**bold *italic* bold**')}</React.Fragment>);
      const strong = document.querySelector('strong');
      expect(strong).not.toBeNull();
      const em = strong!.querySelector('em');
      expect(em).not.toBeNull();
      expect(em!.textContent).toBe('italic');
    });

    it('renders plain text without HTML elements', () => {
      render(<React.Fragment>{renderMarkdown('plain text')}</React.Fragment>);
      const p = document.querySelector('p');
      expect(p).not.toBeNull();
      expect(p!.textContent).toBe('plain text');
      // No inline formatting elements inside the paragraph
      expect(p!.querySelector('strong')).toBeNull();
      expect(p!.querySelector('em')).toBeNull();
      expect(p!.querySelector('code')).toBeNull();
      expect(p!.querySelector('a')).toBeNull();
    });

    it('returns null for empty string', () => {
      const { container } = render(<React.Fragment>{renderMarkdown('')}</React.Fragment>);
      expect(container.innerHTML).toBe('');
    });
  });

  describe('block', () => {
    it('renders code fence with language as ChatCodeBlock', () => {
      render(<React.Fragment>{renderMarkdown('```ts\nconst x = 1;\n```')}</React.Fragment>);
      const codeBlock = document.querySelector('.MuiChatCodeBlock-root');
      expect(codeBlock).not.toBeNull();
      // The language label should display the language
      const languageLabel = document.querySelector('.MuiChatCodeBlock-languageLabel');
      expect(languageLabel).not.toBeNull();
      expect(languageLabel!.textContent).toBe('ts');
    });

    it('renders code fence without language as ChatCodeBlock', () => {
      render(<React.Fragment>{renderMarkdown('```\nsome code\n```')}</React.Fragment>);
      const codeBlock = document.querySelector('.MuiChatCodeBlock-root');
      expect(codeBlock).not.toBeNull();
      const languageLabel = document.querySelector('.MuiChatCodeBlock-languageLabel');
      expect(languageLabel).not.toBeNull();
      expect(languageLabel!.textContent).toBe('');
    });

    it('renders # as <h1>', () => {
      render(<React.Fragment>{renderMarkdown('# Heading 1')}</React.Fragment>);
      const h1 = document.querySelector('h1');
      expect(h1).not.toBeNull();
      expect(h1!.textContent).toBe('Heading 1');
    });

    it('renders ## as <h2>', () => {
      render(<React.Fragment>{renderMarkdown('## Heading 2')}</React.Fragment>);
      const h2 = document.querySelector('h2');
      expect(h2).not.toBeNull();
      expect(h2!.textContent).toBe('Heading 2');
    });

    it('renders ### as <h3>', () => {
      render(<React.Fragment>{renderMarkdown('### Heading 3')}</React.Fragment>);
      const h3 = document.querySelector('h3');
      expect(h3).not.toBeNull();
      expect(h3!.textContent).toBe('Heading 3');
    });

    it('renders #### as <h4>', () => {
      render(<React.Fragment>{renderMarkdown('#### Heading 4')}</React.Fragment>);
      const h4 = document.querySelector('h4');
      expect(h4).not.toBeNull();
      expect(h4!.textContent).toBe('Heading 4');
    });

    it('renders ##### as <h5>', () => {
      render(<React.Fragment>{renderMarkdown('##### Heading 5')}</React.Fragment>);
      const h5 = document.querySelector('h5');
      expect(h5).not.toBeNull();
      expect(h5!.textContent).toBe('Heading 5');
    });

    it('renders ###### as <h6>', () => {
      render(<React.Fragment>{renderMarkdown('###### Heading 6')}</React.Fragment>);
      const h6 = document.querySelector('h6');
      expect(h6).not.toBeNull();
      expect(h6!.textContent).toBe('Heading 6');
    });

    it('renders heading with inline formatting', () => {
      render(<React.Fragment>{renderMarkdown('## **bold** header')}</React.Fragment>);
      const h2 = document.querySelector('h2');
      expect(h2).not.toBeNull();
      const strong = h2!.querySelector('strong');
      expect(strong).not.toBeNull();
      expect(strong!.textContent).toBe('bold');
    });

    it('renders unordered list with - items', () => {
      render(<React.Fragment>{renderMarkdown('- a\n- b')}</React.Fragment>);
      const ul = document.querySelector('ul');
      expect(ul).not.toBeNull();
      const items = ul!.querySelectorAll('li');
      expect(items.length).toBe(2);
      expect(items[0].textContent).toBe('a');
      expect(items[1].textContent).toBe('b');
    });

    it('renders ordered list with numbered items', () => {
      render(<React.Fragment>{renderMarkdown('1. a\n2. b')}</React.Fragment>);
      const ol = document.querySelector('ol');
      expect(ol).not.toBeNull();
      const items = ol!.querySelectorAll('li');
      expect(items.length).toBe(2);
      expect(items[0].textContent).toBe('a');
      expect(items[1].textContent).toBe('b');
    });

    it('renders multi-line text as <p>', () => {
      render(<React.Fragment>{renderMarkdown('line one\nline two')}</React.Fragment>);
      const p = document.querySelector('p');
      expect(p).not.toBeNull();
      expect(p!.textContent).toContain('line one');
      expect(p!.textContent).toContain('line two');
    });

    it('renders mixed blocks in correct sequence', () => {
      const input = '# Title\n\nSome text\n\n- item one\n- item two';
      render(<React.Fragment>{renderMarkdown(input)}</React.Fragment>);

      const h1 = document.querySelector('h1');
      expect(h1).not.toBeNull();
      expect(h1!.textContent).toBe('Title');

      const p = document.querySelector('p');
      expect(p).not.toBeNull();
      expect(p!.textContent).toBe('Some text');

      const ul = document.querySelector('ul');
      expect(ul).not.toBeNull();
      const items = ul!.querySelectorAll('li');
      expect(items.length).toBe(2);
    });

    it('skips empty lines between blocks', () => {
      const input = '# Title\n\n\n\nSome text';
      render(<React.Fragment>{renderMarkdown(input)}</React.Fragment>);
      const h1 = document.querySelector('h1');
      expect(h1).not.toBeNull();
      const p = document.querySelector('p');
      expect(p).not.toBeNull();
      // Only a heading and a paragraph should be rendered — empty lines produce no extra DOM nodes
      expect(document.querySelectorAll('h1').length).toBe(1);
      expect(document.querySelectorAll('p').length).toBe(1);
      expect(h1!.textContent).toBe('Title');
      expect(p!.textContent).toBe('Some text');
    });
  });

  describe('normalizeMarkdownForRender', () => {
    it('auto-closes an unclosed code fence', () => {
      const input = '```ts\nconst x = 1;';
      render(<React.Fragment>{renderMarkdown(input)}</React.Fragment>);
      const codeBlock = document.querySelector('.MuiChatCodeBlock-root');
      expect(codeBlock).not.toBeNull();
      // The code content should be rendered inside the code block
      const code = document.querySelector('.MuiChatCodeBlock-code');
      expect(code).not.toBeNull();
      expect(code!.textContent).toBe('const x = 1;');
    });
  });
});
