const Formatter = require('../lib/formatter').default;
const assert = require('assert');
const saneDefaultOptions = [
    {pattern: '_', replacement: 'i'},
    { pattern: '~', replacement: 'del', allowEmbeded: false },
    { pattern: '```', allowEmbeded: false, replacement: 'pre' }
];

const f = new Formatter(saneDefaultOptions);

describe('Basic Sanity Checks', () => {
    it('show export a class', () => {
        assert.equal(typeof f, 'object');
        assert(f instanceof Formatter);
    });

    it('should throw an error when no patterns are specified in contsructor', () => {
        assert.throws(() => new Formatter(), { name: 'Error', message: 'Invalid initialization arguments' });
    });

    it('should parse simple chunks', () => {
        assert.equal(f.processText(`_me_`), '<i>me</i>');
    });

    it('should format embedded matches when allowEmbedded is set to true', () => {
        assert.equal(f.processText(`_~me~_`), '<i><del>me</del></i>');
    });

    it('should respect allowEmbedded flag when set to false', () => {
        const formatResult = f.processText('```me and my guys from monte cristo _bad_ also ~bad~```');
        const expectedResult = '<pre>me and my guys from monte cristo &lt;i&gt;bad&lt;/i&gt; also &lt;del&gt;bad&lt;/del&gt;</pre>';
        assert.equal(formatResult, expectedResult);
    });

    it('should respect whitespaces inside text to be formatted', () => {
        const formatResult = f.processText('``` me and my guys from monte cristo _bad_ also ~bad~ ```');
        const expectedResult = '<pre> me and my guys from monte cristo &lt;i&gt;bad&lt;/i&gt; also &lt;del&gt;bad&lt;/del&gt; </pre>';
        assert.equal(formatResult, expectedResult);
    });

    it('should correctly handle multiple matches on a line', () => {
        assert.equal(f.processText(`_me_ and my ~guys~`), '<i>me</i> and my <del>guys</del>');
    });

    it('should discard html tags', () => {
        assert.notEqual(f.processText(`_<pre>goosling</pre>_`), '<i><pre>goosling</pre></i>');
    });

    it('should escape html tags', () => {
        assert.equal(f.processText(`_<pre>goosling</pre>_`), '<i>&lt;pre&gt;goosling&lt;/pre&gt;</i>');
    });

    it('should parse multiple instances of matches', () => {
        const expectedResult = 'No more <del>suffering</del>  <del>procastination</del>  <del>stress</del>  <del>failure</del>';
        assert.equal(f.processText('No more ~suffering~  ~procastination~  ~stress~  ~failure~'), expectedResult);
    });

    it('should parse multiple instances of matches with allowEmbedded set to false', () => {
        const formatRes = f.processText('``` me and my guys ```  ``` me and my guys from saint carlos ```');
        const expectedResult = '<pre> me and my guys </pre>  <pre> me and my guys from saint carlos </pre>';
        assert.equal(formatRes, expectedResult);
    });
});
