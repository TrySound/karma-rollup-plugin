/* eslint-disable */

/**
 * Simple tests to test if Mocha works just fine.
 *
 * This will also work for Jasmine etc.
 */

describe("Mocha - 'to.be'", function() {
    it("should return positive", function() {
        expect(true).to.be.true;
    });
    it("should accept a a negative case", function() {
        expect(false).not.to.be.true;
    });
});

describe("Included matchers:", function() {
    it("should compare the 'to.be' matcher with compares with ===", function() {
        const a = 12;
        const b = a;
        expect(a).to.eql(b);
        expect(a).not.to.be.null;
    });

    describe("The 'to.equal' matcher", function() {

        it("should work for simple literals and variables", function() {
            const a = 12;
            expect(a).to.equal(12);
        });
    });

    describe("The 'to.eql' matcher", function() {
        it("should work for objects", function() {
            const foo = {
                a: 12,
                b: 34
            };
            
            const bar = {
                a: 12,
                b: 34
            };
            
            expect(foo).to.eql(bar);
        });
    });

    it("The 'to.contain' matcher is for finding an item in an Array", function() {
        const a = ['foo', 'bar', 'baz'];
        expect(a).to.contain('bar');
        expect(a).not.to.contain('quux');
    });

    it("The 'to.throw' matcher is for testing if a function throws an exception", function() {
        const foo = function() {
            return 1 + 2;
        };
        const bar = function() {
            throw new Error();
        };
        expect(foo).not.to.throw();
        expect(bar).to.throw();
    });
});
