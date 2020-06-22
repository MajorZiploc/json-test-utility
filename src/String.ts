class String {
  splitCamelCase(str: string, separator: string = ' '): string | null {
    if (str === null || str === '') {
      return str;
    }
    return str.replace(/([a-z0-9])([A-Z])/g, '$1' + separator + '$2');
  }

  titleCase(str: string): string | null {
    if (str === null || str === '') {
      return str;
    }
    return str
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join(' ');
  }
}

export const string = new String();
