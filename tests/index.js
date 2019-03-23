const Formatter = require('../lib/formatter').default;


// export class FormatterExample {
//   static asCode = new RegExp(/`(.*?)`/g);
//   static asPre = new RegExp(/`{3}(.*?)`{3}/);
//   static asBold = new RegExp(/\*(.*?)\*/g);
//   static asItalic = new RegExp(/_(.*?)_/g);
//   static asStrikeThrough = new RegExp(/~(.*?)~/g);
//   static allSupportedMatchers = new RegExp(/`(.*?)`|\*(.*?)\*|_(.*?)_|~(.*?)~/g);

//   static formatters: FormatterPatternAndReplacement[] = [
//     {pattern: Formatter.asItalic, replacement: 'i'},
//     {pattern: Formatter.asCode,  replacement: 'code'},
//     {pattern: Formatter.asBold, replacement: 'b'},
//     {pattern: Formatter.asStrikeThrough, replacement: 'del'}
//   ];
// }


    // processCompletely(text: string): string {
    //   if (text.indexOf('```') > -1) {
    //     const decoded = text.replace(Formatter.asPre, (match, enclosed) => enclosed)
    //       .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    //       .replace('```', '').replace('```','');
    //     return `<pre>${decoded}</pre>`;
    //   }
    //   return this.watchForMultipleMatchers(text);
    // }

const f = new Formatter([
    {pattern: '_', replacement: 'i'},
    { pattern: '~', replacement: 'del', allowEmbeded: false },
    { pattern: '```', allowEmbeded: false, replacement: 'pre' }
]);

console.log(f.processText(`_me_ and my ~guys~`));
console.log(f.processText('``` me and my guys from monte cristo _bad_ also ~bad~ ```'));

console.log(f.processText('``` me and my guys ```  ``` me and my guys from saint carlos ```'));
console.log(f.processText('_<pre>goosling</pre>_'));
console.log(f.processText(`_~me~_`));
