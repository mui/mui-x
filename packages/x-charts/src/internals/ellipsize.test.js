"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ellipsize_1 = require("./ellipsize");
describe('ellipsizeText', function () {
    it('returns the original text if it fits', function () {
        var doesTextFit = function () { return true; };
        expect((0, ellipsize_1.ellipsize)('Hello World', doesTextFit)).to.be.equal('Hello World');
    });
    it("shortens text and adds ellipsis if it doesn't fit", function () {
        var doesTextFit = function (text) { return text.length <= 6; };
        expect((0, ellipsize_1.ellipsize)('Hello World', doesTextFit)).to.be.equal('Hello…');
    });
    it('returns an empty string if text never fits', function () {
        var doesTextFit = function () { return false; };
        expect((0, ellipsize_1.ellipsize)('Hello World', doesTextFit)).to.be.equal('');
    });
    it('returns an empty string if only ellipsis fits', function () {
        var doesTextFit = function (text) { return text.length <= 1; };
        expect((0, ellipsize_1.ellipsize)('Hello World', doesTextFit)).to.be.equal('');
    });
    describe('performance', function () {
        /* I'm assuming that checking if the text fits is expensive, so we should reduce the number of calls. */
        it('calls `doesTextFit` the minimum amount of times when the text does not fit', function () {
            var doesTextFitCalled = 0;
            var doesTextFit = function () {
                doesTextFitCalled += 1;
                return false;
            };
            expect((0, ellipsize_1.ellipsize)('A_string_with_22_chars', doesTextFit)).to.be.equal('');
            // Starting with 22 chars, we should reduce to 11, then to 5, then to 2, then to 1, totaling 5 calls.
            expect(doesTextFitCalled).to.equal(5);
        });
        it('calls `doesTextFit` the minimum amount of times when the text fits', function () {
            var doesTextFitCalled = 0;
            var doesTextFit = function (text) {
                doesTextFitCalled += 1;
                return text.length <= 29;
            };
            expect((0, ellipsize_1.ellipsize)('A_string_with_30_characters!!!', doesTextFit)).to.be.equal('A_string_with_30_characters!…');
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
        it('calls `doesTextFit` the minimum amount of times when unicode text does not fit', function () {
            var doesTextFitCalled = 0;
            var doesTextFit = function () {
                doesTextFitCalled += 1;
                return false;
            };
            /* `'🧑‍🧑‍🧒‍🧒'.length` is 11.  */
            expect((0, ellipsize_1.ellipsize)('🧑‍🧑‍🧒‍🧒🧑‍🧑‍🧒‍🧒🧑‍🧑‍🧒‍🧒🧑‍🧑‍🧒‍🧒🧑‍🧑‍🧒‍🧒', doesTextFit)).to.be.equal('');
            /* Starting with 5 graphemes, we should reduce to 2, then 1, totaling 3 calls. */
            expect(doesTextFitCalled).to.equal(3);
        });
    });
});
