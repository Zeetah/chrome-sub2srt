var testData = '{1}{1}23.976\n\
  {131}{263}This is the first subtitle line.\n\
  {272}{326}Second line.\n\
  {330}{449}Third line.|Splitted.\n';

var expectedData =
'1\n\
00:00:00,042 --> 00:00:00,042\n\
23.976\n\n\
2\n\
00:00:05,464 --> 00:00:10,969\n\
This is the first subtitle line.\n\n\
3\n\
00:00:11,345 --> 00:00:13,597\n\
Second line.\n\n\
4\n\
00:00:13,764 --> 00:00:18,727\n\
Third line.|Splitted.\n';

describe('sub2srt converter', function() {

  it('returns true if filename is sub file', function() {
    expect(sub2srt.isSubFile('test.sub')).to.be.true();
  });

  it('returns false if filename is not sub file', function() {
    expect(sub2srt.isSubFile('testsubi')).to.be.false();
  });

  it('returns correct name for sub file', function() {
    expect(sub2srt.getName('test.sub')).to.be.eql('test.srt');
  });

  it('converts sub to srt correctly', function() {
    expect(sub2srt.convert(testData)).to.be.equal(expectedData);
  });
});