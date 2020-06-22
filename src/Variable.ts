import { string } from './String';

class Variable {
  toString(varInJson: any): string | null {
    if (varInJson === null) {
      return varInJson;
    }
    return Object.keys(varInJson)[0];
  }

  splitCamelCase(varInJson: any, separator: string = ' '): string | null {
    return string.splitCamelCase(this.toString(varInJson), separator);
  }
}

export const variable = new Variable();
