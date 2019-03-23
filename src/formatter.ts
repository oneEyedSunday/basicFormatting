export interface StringPatternAndReplacement {
  pattern: string;
  replacement: string;
  allowEmbeded?: boolean;
}

interface RegExpPatternAndReplacement {
  replacement: string;
  allowEmbeded: boolean;
  regExpPattern: RegExp;
}

// new Formatter([])
export default class Formatter {
  formatters: RegExpPatternAndReplacement[];
  noEmbed: string = '';
  constructor(formatters: StringPatternAndReplacement[]) {
    this.formatters = this.convertStringsToRegExps(formatters);
    console.log(this.formatters);

  }
  // turn ` to /`(.?*)`/
  convertStringToRegExp(patternAsString: string): RegExp {
    return new RegExp(patternAsString, 'g');
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
  }

  stripFormattersAndReturnHTML(textToFormat: string, tag: string): string {
      return `<${tag}>${textToFormat}</${tag}>`;
    }
  
  watchForMultipleMatchers(word: string): string {
      return this.formatters.reduce(
        (word, formatter) => word.replace(formatter.regExpPattern, (match, enclosed)  => {
          return `<${formatter.replacement}>${enclosed}</${formatter.replacement}>`;
        })
        , word);
  }

}

