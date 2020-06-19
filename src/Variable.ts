class Variable {
  toString(varInJson: any): string {
    return Object.keys(varInJson)[0];
  }
}

export const variable = new Variable();
