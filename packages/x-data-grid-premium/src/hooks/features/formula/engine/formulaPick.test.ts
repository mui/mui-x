import { describe, expect, it } from 'vitest';
import { getFormulaPickAction } from './formulaPick';
import type { FormulaPendingPick, FormulaPickAction } from './formulaPick';

/**
 * Reads a marked editor text: `|` is the caret, `[…]` a selection.
 * `'=B2+|'` → text `=B2+`, caret 4. `'=[B2]+1'` → text `=B2+1`, selection 1..3.
 */
function parseMarked(marked: string) {
  const caret = marked.indexOf('|');
  if (caret !== -1) {
    return {
      text: marked.slice(0, caret) + marked.slice(caret + 1),
      selection: { start: caret, end: caret },
    };
  }
  const start = marked.indexOf('[');
  const end = marked.indexOf(']') - 1;
  return {
    text: marked.replace('[', '').replace(']', ''),
    selection: { start, end },
  };
}

function pick(marked: string, a1Notation: boolean, pending: FormulaPendingPick | null = null) {
  const { text, selection } = parseMarked(marked);
  return getFormulaPickAction(text, selection, pending, { a1Notation });
}

/**
 * The pending pick left by a previous click: `[…]` marks the picked reference.
 */
function pendingOf(marked: string): FormulaPendingPick {
  const { text, selection } = parseMarked(marked);
  return { ...selection, text };
}

const NONE: FormulaPickAction = { type: 'none' };
const insertAt = (offset: number): FormulaPickAction => ({
  type: 'insert',
  start: offset,
  end: offset,
});
const replace = (start: number, end: number): FormulaPickAction => ({
  type: 'replace',
  start,
  end,
});

describe('getFormulaPickAction', () => {
  describe.each([
    { dialect: 'A1 notation', a1Notation: true },
    { dialect: 'canonical', a1Notation: false },
  ])('$dialect', ({ a1Notation }) => {
    describe('inserts where a reference is expected', () => {
      it.each([
        ['=|', 1],
        ['= |', 2],
        ['=price+|', 7],
        ['=price + |', 9],
        ['=price*|', 7],
        ['=price&|', 7],
        ['=price<>|', 8],
        ['=-|', 2],
        ['=SUM(|', 5],
        ['=SUM(|)', 5],
        ['=SUM(price,|', 11],
        ['=SUM(price, |)', 12],
        ['=IF(price>|, 1, 2)', 10],
        ['="abc"&|', 7],
        ['=|+price', 1],
      ])('%s', (marked, offset) => {
        expect(pick(marked, a1Notation)).toEqual(insertAt(offset));
      });
    });

    describe('is not a pick after a complete operand', () => {
      it.each([
        '=5|',
        '=5 |',
        '=price|',
        '=price |',
        '=SUM(price)|',
        '=SUM(price) |',
        '=price+quantity|',
        '="abc"|',
        '=TRUE|',
      ])('%s', (marked) => {
        expect(pick(marked, a1Notation)).toEqual(NONE);
      });
    });

    describe('is not a pick on a partially typed name', () => {
      it.each(['=pri|', '=price+qu|', '=SU|', '=SUM(pr|', '=pr|ice'])('%s', (marked) => {
        expect(pick(marked, a1Notation)).toEqual(NONE);
      });
    });

    describe('is not a pick inside a string', () => {
      it.each(['="abc|', '="ab|c"', '="a+|"', '=CONCAT("a,|', '="abc"&"|'])('%s', (marked) => {
        expect(pick(marked, a1Notation)).toEqual(NONE);
      });
    });

    describe('is not a pick when the text is not a formula', () => {
      it.each(['|', '7|', 'abc|', '+|', "'=|", "'=price+|", ' =|'])('%s', (marked) => {
        expect(pick(marked, a1Notation)).toEqual(NONE);
      });
    });

    it('is not a pick with the caret before the leading `=`', () => {
      expect(pick('|=price+', a1Notation)).toEqual(NONE);
      expect(pick('[=]price+', a1Notation)).toEqual(NONE);
      expect(pick('[=price+]', a1Notation)).toEqual(NONE);
    });

    describe('replaces the selected text when a reference fits in its place', () => {
      it.each([
        ['=[price]', 1, 6],
        ['=[5]', 1, 2],
        ['=price+[quantity]', 7, 15],
        ['=SUM([price], 2)', 5, 10],
        ['=[price+quantity]', 1, 15],
      ])('%s', (marked, start, end) => {
        expect(pick(marked, a1Notation)).toEqual(replace(start, end));
      });
    });

    describe('is not a pick when a reference does not fit in place of the selection', () => {
      it.each([
        // Would leave `=1<ref>`.
        '=1[23]',
        // Would leave `=price<ref>`.
        '=price[+quantity]',
        // Would write the reference inside the string.
        '="ab[c]"',
        '="a[bc"]',
        // Would leave `=pri<ref>`.
        '=pri[ce]',
      ])('%s', (marked) => {
        expect(pick(marked, a1Notation)).toEqual(NONE);
      });
    });

    it('normalizes a backward selection', () => {
      expect(getFormulaPickAction('=price', { start: 6, end: 1 }, null, { a1Notation })).toEqual(
        replace(1, 6),
      );
    });

    it('clamps a selection past the end of the text', () => {
      expect(getFormulaPickAction('=price+', { start: 99, end: 99 }, null, { a1Notation })).toEqual(
        insertAt(7),
      );
    });
  });

  describe('A1 notation only', () => {
    it.each(['=B2|', '=B2+C45|', '=$B$2|', '=SUM(B4:C4)|', '=SUM(B4:C4|', '=B:B|'])(
      'is not a pick after a typed reference: %s',
      (marked) => {
        expect(pick(marked, true)).toEqual(NONE);
      },
    );

    it.each(['=B|2', '=SUM(B4:C|4)', '=B|'])(
      'is not a pick inside a reference or a column letter: %s',
      (marked) => {
        expect(pick(marked, true)).toEqual(NONE);
      },
    );

    it('inserts after the range operator (Shift+click and typed `:`)', () => {
      expect(pick('=SUM(B2:|', true)).toEqual(insertAt(8));
      expect(pick('=B2:|', true)).toEqual(insertAt(4));
    });

    it('inserts after an operator following a reference', () => {
      expect(pick('=B2+|', true)).toEqual(insertAt(4));
      expect(pick('=SUM(B2:C4,|', true)).toEqual(insertAt(11));
    });

    it('replaces a selected reference', () => {
      expect(pick('=B2+[C45]', true)).toEqual(replace(4, 7));
      expect(pick('=SUM([B2:C4])', true)).toEqual(replace(5, 10));
    });
  });

  describe('canonical only', () => {
    it('is not a pick after a typed reference', () => {
      expect(pick('=REF(COLUMN("price"), ROW(2))|', false)).toEqual(NONE);
      expect(pick('=COLUMN_VALUES("price")|', false)).toEqual(NONE);
    });

    it('inserts after an operator following a reference', () => {
      expect(pick('=REF(COLUMN("price"), ROW(2))+|', false)).toEqual(insertAt(30));
    });

    it('reads an A1-looking name as a partially typed name', () => {
      // In the canonical dialect `B2` is a field name being typed.
      expect(pick('=B2|', false)).toEqual(NONE);
    });
  });

  describe('pending pick', () => {
    it('replaces the pending reference while the caret is still at its end', () => {
      // `=`, click B2 → `=B2` (pending), click C3.
      const pending = pendingOf('=[B2]');
      expect(pick('=B2|', true, pending)).toEqual(replace(1, 3));
    });

    it('replaces the pending reference after an operator', () => {
      // `=B2+`, click C3 → `=B2+C3` (pending), click C4.
      const pending = pendingOf('=B2+[C3]');
      expect(pick('=B2+C3|', true, pending)).toEqual(replace(4, 6));
    });

    it('replaces a pending canonical reference', () => {
      const pending = pendingOf('=SUM([REF(COLUMN("price"), ROW(2))]');
      expect(pick('=SUM(REF(COLUMN("price"), ROW(2))|', false, pending)).toEqual(replace(5, 33));
    });

    it('replaces a pending same-row field name', () => {
      const pending = pendingOf('=[price]');
      expect(pick('=price|', false, pending)).toEqual(replace(1, 6));
      expect(pick('=price|', true, pending)).toEqual(replace(1, 6));
    });

    it('replaces a pending reference followed by more text', () => {
      // `=SUM(|)`, click B2 → `=SUM(B2|)`.
      const pending = pendingOf('=SUM([B2])');
      expect(pick('=SUM(B2|)', true, pending)).toEqual(replace(5, 7));
    });

    it('is finalized by typing: the text changed', () => {
      // `=B2` pending, the user types `+`: the next click inserts.
      const pending = pendingOf('=[B2]');
      expect(pick('=B2+|', true, pending)).toEqual(insertAt(4));
      // The user types a digit: the reference is complete, the click is not a pick.
      expect(pick('=B22|', true, pending)).toEqual(NONE);
    });

    it('is finalized by moving the caret', () => {
      const pending = pendingOf('=SUM([B2])');
      // Caret after the `)`: complete operand.
      expect(pick('=SUM(B2)|', true, pending)).toEqual(NONE);
      // Caret inside the reference.
      expect(pick('=SUM(B|2)', true, pending)).toEqual(NONE);
      // Caret before the reference: a value position, a new insert.
      expect(pick('=SUM(|B2)', true, pending)).toEqual(insertAt(5));
    });

    it('is finalized by selecting text', () => {
      const pending = pendingOf('=[B2]');
      expect(pick('=B[2]', true, pending)).toEqual(NONE);
      // Selecting the whole reference still replaces it, through the selection rule.
      expect(pick('=[B2]', true, pending)).toEqual(replace(1, 3));
    });

    it('ignores a malformed pending span', () => {
      expect(pick('=B2|', true, { start: 0, end: 3, text: '=B2' })).toEqual(NONE);
      expect(pick('=B2|', true, { start: 3, end: 3, text: '=B2' })).toEqual(NONE);
      expect(pick('=B2|', true, { start: 1, end: 9, text: '=B2' })).toEqual(NONE);
    });

    it('does not make a non-formula text pickable', () => {
      expect(pick('B2|', true, { start: 0, end: 2, text: 'B2' })).toEqual(NONE);
    });
  });

  describe('AG Grid reference table (docs demo, A1)', () => {
    it('`=|` click → insert', () => {
      expect(pick('=|', true)).toEqual(insertAt(1));
    });

    it('`=B2|` pending, click → replace', () => {
      expect(pick('=B2|', true, pendingOf('=[B2]'))).toEqual(replace(1, 3));
    });

    it('`=B2+|` click, click → insert then replace', () => {
      expect(pick('=B2+|', true)).toEqual(insertAt(4));
      expect(pick('=B2+C3|', true, pendingOf('=B2+[C3]'))).toEqual(replace(4, 6));
    });

    it('`=B2+C45|` typed, click → commits (D3; AG Grid replaces the reference)', () => {
      expect(pick('=B2+C45|', true)).toEqual(NONE);
    });

    it('`=5|`, `=SUM(B4:C4)|`, `="abc|` click → commits', () => {
      expect(pick('=5|', true)).toEqual(NONE);
      expect(pick('=SUM(B4:C4)|', true)).toEqual(NONE);
      expect(pick('="abc|', true)).toEqual(NONE);
    });

    it('`=SUM(|` click → insert (drag anchor)', () => {
      expect(pick('=SUM(|', true)).toEqual(insertAt(5));
    });

    it('plain `7|` click → commits', () => {
      expect(pick('7|', true)).toEqual(NONE);
    });
  });
});
