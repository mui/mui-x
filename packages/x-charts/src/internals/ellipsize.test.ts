import { expect } from 'chai';
import { ellipsize } from './ellipsize';

describe('ellipsizeText', () => {
  it('returns the original text if it fits', () => {
    const doesTextFit = () => true;
    expect(ellipsize('Hello World', doesTextFit)).to.be.equal('Hello World');
  });

  it("shortens text and adds ellipsis if it doesn't fit", () => {
    const doesTextFit = (text: string) => text.length <= 6;
    expect(ellipsize('Hello World', doesTextFit)).to.be.equal('Hello…');
  });

  it('returns an empty string if text never fits', () => {
    const doesTextFit = () => false;
    expect(ellipsize('Hello World', doesTextFit)).to.be.equal('');
  });

  it('returns an empty string if only ellipsis fits', () => {
    const doesTextFit = (text: string) => text.length <= 1;
    expect(ellipsize('Hello World', doesTextFit)).to.be.equal('');
  });

  describe('performance', () => {
    /* I'm assuming that checking if the text fits is expensive, so we should reduce the number of calls. */

    it('calls `doesTextFit` the minimum amount of times when the text does not fit', () => {
      let doesTextFitCalled = 0;
      const doesTextFit = () => {
        doesTextFitCalled += 1;
        return false;
      };
      expect(ellipsize('A_string_with_22_chars', doesTextFit)).to.be.equal('');

      // Starting with 22 chars, we should reduce to 11, then to 5, then to 2, then to 1, totaling 5 calls.
      expect(doesTextFitCalled).to.equal(5);
    });

    it('calls `doesTextFit` the minimum amount of times when the text fits', () => {
      let doesTextFitCalled = 0;
      const doesTextFit = (text: string) => {
        doesTextFitCalled += 1;
        return text.length <= 29;
      };
      expect(ellipsize('A_string_with_30_characters!!!', doesTextFit)).to.be.equal(
        'A_string_with_30_characters!…',
      );

      /* Starting with 30 chars, we should:
       *   1. reduce to 15
       *   2. increase to 22
       *   3. increase to 26
       *   4. increase to 28
       *   5. increase to 29
       *
       * Return 28, but we shouldn't measure it again, totaling 6 calls.
       */
      expect(doesTextFitCalled).to.equal(6);
    });

    it('calls `doesTextFit` the minimum amount of times when unicode text does not fit', () => {
      let doesTextFitCalled = 0;
      const doesTextFit = () => {
        doesTextFitCalled += 1;
        return false;
      };

      /* `'🧑‍🧑‍🧒‍🧒'.length` is 11.  */
      expect(ellipsize('🧑‍🧑‍🧒‍🧒🧑‍🧑‍🧒‍🧒🧑‍🧑‍🧒‍🧒🧑‍🧑‍🧒‍🧒🧑‍🧑‍🧒‍🧒', doesTextFit)).to.be.equal('');

      /* Starting with 5 graphemes, we should reduce to 2, then 1, totaling 3 calls. */
      expect(doesTextFitCalled).to.equal(3);
    });
  });
});
