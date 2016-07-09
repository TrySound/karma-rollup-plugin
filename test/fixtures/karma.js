/* eslint-disable */

it('runs', function() {
    expect(true).to.be.true;
});

it('runs in the browser', function() {
    expect(window).to.exist;
    expect(document).to.exist;
});

it("'to.be' should return positive", function() {
    expect(true).to.be.true;
});
it("'to.be' can have a negative case", function() {
    expect(false).not.to.be.true;
});
