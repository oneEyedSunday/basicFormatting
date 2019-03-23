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
    // loop through text
    // check for occurences of formatters marked to not be embeddable
    // if they exists
    // parse text
    const fragmentMatcher = this.noEmbed.map(n => this.findOccurencesOf(text, n));
    console.log('Fragments', fragmentMatcher.filter(f => f.firstIndex > -1));
    console.log(fragmentMatcher.filter(f => (f.firstIndex > -1) && (f.secondIndex > -1))
    .map(f => text.substring(f.firstIndex, f.secondIndex + f.pattern.length)));
    return this.watchForMultipleMatchers(text);
  }

  // find first index
      
      // if we have both first and second index, parse the substring between them
      // repeat
      // if found
      // find second index
  findOccurencesOf(textFragments: string, pattern: string): { firstIndex: number; secondIndex: number, pattern: string } {
    const firstIndex = textFragments.indexOf(pattern);
    let secondIndex = -1;
    if (firstIndex > -1) {
      const stringToHoldInPlace = Array(pattern.length).fill(' ').join('');
      secondIndex = textFragments.replace(pattern, stringToHoldInPlace).indexOf(pattern)
    }

    return { firstIndex, secondIndex, pattern };
  }

}

