class Variable {
  toString(varInJson: any): string {
    return Object.keys(varInJson)[0];
  }

  splitCamelCase(varInJson: any, separator: string = ' '): string {
    return this.toString(varInJson).replace(/([a-z0-9])([A-Z])/g, '$1' + separator + '$2');
  }
}

export const variable = new Variable();
