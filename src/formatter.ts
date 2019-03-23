export interface StringPatternAndReplacement {
  pattern: string;
  replacement: string;
  allowEmbeded?: boolean;
}

interface RegExpPatternAndReplacement {
  replacement: string;
  allowEmbeded: boolean;
  regExpPattern: RegExp;
  pattern: string;
}

// new Formatter([])
export default class Formatter {
  formatters: RegExpPatternAndReplacement[];
  noEmbed: string[] = [];
  constructor(formatters: StringPatternAndReplacement[]) {
    this.formatters = this.convertStringsToRegExps(formatters);
    this.populateNoEmbeds();
    console.log(this.formatters);

  }
  // turn ` to /`(.?*)`/
  convertStringToRegExp(patternAsString: string): RegExp {
    const patternEscapedRegExp = this.escapeRegex(patternAsString);
    return new RegExp(`${patternEscapedRegExp}(.*?)${patternEscapedRegExp}`, 'g');
  }

  escapeRegex(value: string) {
    return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
  }

  convertStringsToRegExps(patternAsString: StringPatternAndReplacement[]): RegExpPatternAndReplacement[] {
    return patternAsString.map(s => 
      ({ ...s, regExpPattern: this.convertStringToRegExp(s.pattern), allowEmbeded: s.allowEmbeded === false ? false : true })
       );
  }


  populateNoEmbeds(): void {
    // filter through formatters
    // check if allowEmbed is set to false for any
    // populate noEmbeds prop with the 
    this.noEmbed = this.formatters.filter(f => !f.allowEmbeded).map(g => g.pattern);
  }

  stripFormattersAndReturnHTML(textToFormat: string, formatter: RegExpPatternAndReplacement): string {
    try {
      const elem = document.createElement(formatter.replacement);
      elem.innerText = textToFormat;
      return  `<${formatter.replacement}>${elem.innerHTML}</${formatter.replacement}>`
    } catch (error) {
      // console.log((error as Error).name);
      const naivelyCleanedContent = this.naiveTagCleanUp(textToFormat);
      return `<${formatter.replacement}>${naivelyCleanedContent}</${formatter.replacement}>`;
    }
  }
  
  watchForMultipleMatchers(word: string): string {
      return this.formatters.reduce(
        (word, formatter) => word.replace(formatter.regExpPattern, (match, enclosed)  => {
          return this.stripFormattersAndReturnHTML(enclosed, formatter);
        })
        , word);
  }

  naiveTagCleanUp(rawContent: string): string {
    return rawContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  processText(text: string): string {
    return this.watchForMultipleMatchers(text);
  }

}

