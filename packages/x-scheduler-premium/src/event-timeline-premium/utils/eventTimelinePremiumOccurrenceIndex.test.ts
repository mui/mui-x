import { createEventTimelinePremiumOccurrenceIndex } from './eventTimelinePremiumOccurrenceIndex';

interface TestOccurrence {
  id: number;
  start: number;
  end: number;
}

function createOccurrence(id: number, position: number, duration: number): TestOccurrence {
  return { id, start: position, end: position + duration };
}

describe('createEventTimelinePremiumOccurrenceIndex', () => {
  it('should find intersecting occurrences and preserve their order', () => {
    const occurrences = [
      createOccurrence(1, 0, 0.25),
      createOccurrence(2, 0.1, 0.7),
      createOccurrence(3, 0.3, 0.1),
      createOccurrence(4, 0.5, 0.1),
    ];
    const index = createEventTimelinePremiumOccurrenceIndex(occurrences);

    expect(index(0.25, 0.5).map((occurrence) => occurrence.id)).to.deep.equal([2, 3]);
  });

  it('should handle empty and invalid ranges', () => {
    const index = createEventTimelinePremiumOccurrenceIndex([createOccurrence(1, 0.2, 0.1)]);

    expect(index(0.5, 0.5)).to.deep.equal([]);
    expect(index(0.6, 0.5)).to.deep.equal([]);
    expect(createEventTimelinePremiumOccurrenceIndex<TestOccurrence>([])(0, 1)).to.deep.equal([]);
  });

  it('should match a linear scan', () => {
    let seed = 1;
    const random = () => {
      seed = (seed * 1_664_525 + 1_013_904_223) % 2 ** 32;
      return seed / 2 ** 32;
    };
    const occurrences = Array.from({ length: 1_000 }, (_, id) => {
      const position = random();
      return createOccurrence(id, position, random() * 0.2);
    }).sort((a, b) => a.start - b.start);
    const index = createEventTimelinePremiumOccurrenceIndex(occurrences);

    for (let query = 0; query < 200; query += 1) {
      const start = random();
      const end = start + random() * 0.1;
      const expected = occurrences.filter(
        (occurrence) => occurrence.end > start && occurrence.start < end,
      );

      expect(index(start, end)).to.deep.equal(expected);
    }
  });
});
