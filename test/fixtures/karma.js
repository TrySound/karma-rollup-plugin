it('should run in the browser not Mocha', function () {
    expect(window).to.exist;
    expect(document).to.exist;
});
