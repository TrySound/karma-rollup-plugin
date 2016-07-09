
/**
 * Simple Karma tests to test if Karma works as expected
 */
it('should run', function () {
    expect(true).to.be.true;
});

it('should run in the browser', function () {
    expect(window).to.exist;
    expect(document).to.exist;
});