import { describe, expect, it } from 'vitest';
import { getFormulaPickAction } from './formulaPick';
import type { FormulaPendingPick, FormulaPickAction, FormulaPickMode } from './formulaPick';

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

    describe('is not a pick right before an operand', () => {
      it.each([
        '=|price',
        '=| price',
        '=|5',
        '=|"abc"',
        '=|(price)',
        '=|SUM(price)',
        '=SUM(|price)',
        '=price+|quantity',
        '=SUM(price,|quantity)',
      ])('%s', (marked) => {
        expect(pick(marked, a1Notation)).toEqual(NONE);
      });
    });

    describe('inserts right before an operator or a closing token', () => {
      it.each([
        ['=|-price', 1],
        ['=SUM(|)', 5],
        ['=SUM(|, price)', 5],
        ['=price+|*2', 7],
      ])('%s', (marked, offset) => {
        expect(pick(marked, a1Notation)).toEqual(insertAt(offset));
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
    it.each([
      ['=B2|', 1, 3],
      ['=B|2', 1, 3],
      ['=|B2', 1, 3],
      ['=B2+C45|', 4, 7],
      ['=B2|+C45', 1, 3],
      ['=$B$2|', 1, 5],
      ['=SUM(B4:C4|', 5, 10],
      ['=SUM(B4:C|4)', 5, 10],
      ['=SUM(|B4:C4)', 5, 10],
      ['=B:B|', 1, 4],
    ])('replaces the reference the caret is on: %s', (marked, start, end) => {
      expect(pick(marked, true)).toEqual(replace(start, end));
    });

    it.each(['=SUM(B4:C4)|', '=B|', '=B2 |', '=B2+5|'])(
      'is not a pick when the caret is not on a reference: %s',
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
    it.each([
      ['=REF(COLUMN("price"), ROW(2))|', 1, 29],
      ['=REF(COLUMN("pri|ce"), ROW(2))', 1, 29],
      ['=REF(COLUMN("price"), RO|W(2))', 1, 29],
      ['=|REF(COLUMN("price"), ROW(2))', 1, 29],
      ['=2*REF(COLUMN("price"), ROW(2))|+1', 3, 31],
      ['=COLUMN_VALUES("price")|', 1, 23],
      ['=FIELD("q1")|', 1, 12],
      ['=SUM(RANGE_REF(COLUMN_FROM("a"), ROW_FROM(1), COLUMN_TO("b"), ROW_TO(2))|)', 5, 72],
    ])('replaces the reference form the caret is on: %s', (marked, start, end) => {
      expect(pick(marked, false)).toEqual(replace(start, end));
    });

    it('is not a pick on a reference form that is not closed', () => {
      expect(pick('=REF(COLUMN("price"), ROW(2)|', false)).toEqual(NONE);
      expect(pick('=REF|', false)).toEqual(NONE);
    });

    it('is not a pick on a function call', () => {
      expect(pick('=SUM(price)|', false)).toEqual(NONE);
      expect(pick('=SU|M(price)', false)).toEqual(NONE);
    });

    it('inserts after an operator following a reference', () => {
      expect(pick('=REF(COLUMN("price"), ROW(2))+|', false)).toEqual(insertAt(30));
    });

    it('reads an A1-looking name as a partially typed name', () => {
      // In the canonical dialect `B2` is a field name being typed.
      expect(pick('=B2|', false)).toEqual(NONE);
    });
  });

  describe.each([
    { dialect: 'A1 notation', a1Notation: true },
    { dialect: 'canonical', a1Notation: false },
  ])('field names, $dialect', ({ a1Notation }) => {
    const isFieldName = (name: string) => name === 'price' || name === 'quantity';
    const pickField = (marked: string) => {
      const { text, selection } = parseMarked(marked);
      return getFormulaPickAction(text, selection, null, { a1Notation, isFieldName });
    };

    it.each([
      ['=price|', 1, 6],
      ['=pri|ce', 1, 6],
      ['=|price', 1, 6],
      ['=price * quantity|', 9, 17],
      ['=price| * quantity', 1, 6],
      ['=SUM(price, quantity|)', 12, 20],
    ])('replaces the field name the caret is on: %s', (marked, start, end) => {
      expect(pickField(marked)).toEqual(replace(start, end));
    });

    it.each(['=pri|', '=total|', '=price |', '=PRICE|', '="price|"'])(
      'is not a pick when the caret is not on a field name: %s',
      (marked) => {
        expect(pickField(marked)).toEqual(NONE);
      },
    );

    it('is not a pick on a function named like a field', () => {
      expect(pickField('=price|(1)')).toEqual(NONE);
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
      // The user types a digit: the click replaces the reference as typed.
      expect(pick('=B22|', true, pending)).toEqual(replace(1, 4));
    });

    it('is finalized by moving the caret', () => {
      const pending = pendingOf('=SUM([B2])');
      // Caret after the `)`: complete operand.
      expect(pick('=SUM(B2)|', true, pending)).toEqual(NONE);
      // Caret after the pending field name, moved before the operator typed after it.
      expect(pick('=price|+1', false, pendingOf('=[price]'))).toEqual(NONE);
    });

    it('is finalized by selecting text', () => {
      const pending = pendingOf('=[B2]');
      expect(pick('=B[2]', true, pending)).toEqual(NONE);
      // Selecting the whole reference still replaces it, through the selection rule.
      expect(pick('=[B2]', true, pending)).toEqual(replace(1, 3));
    });

    it('ignores a malformed pending span', () => {
      expect(pick('=5|', true, { start: 0, end: 2, text: '=5' })).toEqual(NONE);
      expect(pick('=5|', true, { start: 2, end: 2, text: '=5' })).toEqual(NONE);
      expect(pick('=5|', true, { start: 1, end: 9, text: '=5' })).toEqual(NONE);
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

    it('`=B2+C45|` typed, click → the reference at the caret is replaced', () => {
      expect(pick('=B2+C45|', true)).toEqual(replace(4, 7));
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

  describe('modifier clicks', () => {
    const isFieldName = (name: string) => name === 'price' || name === 'qty';

    function pickWith(
      mode: FormulaPickMode,
      marked: string,
      a1Notation: boolean,
      pending: FormulaPendingPick | null = null,
    ) {
      const { text, selection } = parseMarked(marked);
      return getFormulaPickAction(text, selection, pending, { a1Notation, isFieldName, mode });
    }
    const appendAt = (offset: number): FormulaPickAction => ({
      type: 'append',
      start: offset,
      end: offset,
    });
    const extend = (start: number, end: number): FormulaPickAction => ({
      type: 'extend',
      start,
      end,
    });

    describe.each([
      { dialect: 'A1 notation', a1Notation: true },
      { dialect: 'canonical', a1Notation: false },
    ])('$dialect', ({ a1Notation }) => {
      describe('append (Ctrl/Cmd+click)', () => {
        it.each([
          ['=SUM(price|', 10],
          ['=SUM(pr|ice', 10],
          ['=SUM(|price', 10],
          ['=SUM(price|, 2)', 10],
          ['=SUM(price|)', 10],
          ['=SUM(2, price|', 13],
          ['=SUM(1+price|', 12],
          ['=SUM (price|', 11],
          ['=IF(qty, SUM(price|', 18],
          ['=sum(price|', 10],
        ])('adds an argument after the reference at the caret: `%s`', (marked, offset) => {
          expect(pickWith('append', marked, a1Notation)).toEqual(appendAt(offset));
        });

        it('adds an argument after the pending reference', () => {
          const pending = pendingOf('=SUM([price]');
          expect(pickWith('append', '=SUM(price|', a1Notation, pending)).toEqual(appendAt(10));
        });

        it('adds an argument after a pending reference that was itself appended', () => {
          const pending = pendingOf('=SUM(price, [qty]');
          expect(pickWith('append', '=SUM(price, qty|', a1Notation, pending)).toEqual(appendAt(15));
        });

        it.each([
          ['=|', insertAt(1)],
          ['=SUM(|', insertAt(5)],
          ['=SUM(price, |', insertAt(12)],
          ['=price+|', insertAt(7)],
          ['=price|', replace(1, 6)],
          ['=price+qty|', replace(7, 10)],
          // A group is not an argument list.
          ['=(price|', replace(2, 7)],
          ['=SUM((price|', replace(6, 11)],
          // The call is closed before the reference.
          ['=SUM(1)+price|', replace(8, 13)],
          ['=SUM([price]', replace(5, 10)],
        ])('behaves like a plain click anywhere else: `%s`', (marked, expected) => {
          expect(pickWith('append', marked, a1Notation)).toEqual(expected);
          expect(pickWith('replace', marked, a1Notation)).toEqual(expected);
        });

        it.each(['=5|', '=SUM(5|', '=SUM(pri|', '=SUM("a|', '=SUM(price)|', 'price|'])(
          'is not a pick where a plain click is not one: `%s`',
          (marked) => {
            expect(pickWith('append', marked, a1Notation)).toEqual(NONE);
          },
        );
      });

      describe('extend (Shift+click)', () => {
        it.each([
          ['=price|', extend(1, 6)],
          ['=pr|ice', extend(1, 6)],
          ['=|price', extend(1, 6)],
          ['=SUM(price|', extend(5, 10)],
          ['=SUM(price|)', extend(5, 10)],
          ['=price+qty|', extend(7, 10)],
        ])('turns the reference at the caret into a range: `%s`', (marked, expected) => {
          expect(pickWith('extend', marked, a1Notation)).toEqual(expected);
        });

        it('turns the pending reference into a range', () => {
          const pending = pendingOf('=SUM([price]');
          expect(pickWith('extend', '=SUM(price|', a1Notation, pending)).toEqual(extend(5, 10));
        });

        it.each([
          ['=|', insertAt(1)],
          ['=price+|', insertAt(7)],
          ['=SUM(|', insertAt(5)],
          ['=[price]', replace(1, 6)],
        ])(
          'behaves like a plain click without a reference at the caret: `%s`',
          (marked, expected) => {
            expect(pickWith('extend', marked, a1Notation)).toEqual(expected);
          },
        );

        it.each(['=5|', '=price+5|', '=SUM(price)|', '=pri|', '="a|', 'price|'])(
          'is not a pick where a plain click is not one: `%s`',
          (marked) => {
            expect(pickWith('extend', marked, a1Notation)).toEqual(NONE);
          },
        );
      });
    });

    describe('A1 references', () => {
      it('appends after a cell reference and after a range', () => {
        expect(pickWith('append', '=SUM(B2|', true)).toEqual(appendAt(7));
        expect(pickWith('append', '=SUM(B|2', true)).toEqual(appendAt(7));
        expect(pickWith('append', '=SUM(B2:C4|', true)).toEqual(appendAt(10));
        expect(pickWith('append', '=SUM(B2:C4|)', true)).toEqual(appendAt(10));
      });

      it('replaces a cell reference outside a call', () => {
        expect(pickWith('append', '=B2|', true)).toEqual(replace(1, 3));
      });

      it('extends a cell reference and a range', () => {
        expect(pickWith('extend', '=B2|', true)).toEqual(extend(1, 3));
        expect(pickWith('extend', '=SUM(B2:C4|)', true)).toEqual(extend(5, 10));
        expect(pickWith('extend', '=SUM(B2:C4|', true, pendingOf('=SUM([B2:C4]'))).toEqual(
          extend(5, 10),
        );
      });
    });

    describe('canonical reference forms', () => {
      const ref = 'REF(COLUMN("price"), ROW(2))';

      it('appends after a reference form, wherever the caret is in it', () => {
        expect(pickWith('append', `=SUM(${ref}|`, false)).toEqual(appendAt(5 + ref.length));
        expect(pickWith('append', '=SUM(REF(COLUMN("pr|ice"), ROW(2))', false)).toEqual(
          appendAt(5 + ref.length),
        );
      });

      it('does not append inside a reference form that is still open', () => {
        // The innermost parenthesis belongs to `REF(`, which takes selectors, not references.
        expect(pickWith('append', '=REF(price|', false)).toEqual(replace(5, 10));
        expect(pickWith('append', '=SUM(REF(price|', false)).toEqual(replace(9, 14));
      });

      it('replaces a reference form outside a call', () => {
        expect(pickWith('append', `=${ref}|`, false)).toEqual(replace(1, 1 + ref.length));
      });

      it('extends a reference form', () => {
        expect(pickWith('extend', `=${ref}|`, false)).toEqual(extend(1, 1 + ref.length));
        expect(pickWith('extend', `=SUM(${ref}|)`, false)).toEqual(extend(5, 5 + ref.length));
      });
    });
  });
});
