class List {
  /**
   * Sorts by ascending order be default using <= operator
   *
   * @param arr
   * @param comparer
   */
  isSorted(arr: any[], comparer: (f: any, s: any) => boolean = (f: any, s: any) => f <= s) {
    return arr.every((v, i, a) => !i || comparer(a[i - 1], v));
  }

  isSortedAsc(arr: any[]) {
    return this.isSorted(arr);
  }

  isSortedDesc(arr: any[]) {
    return this.isSorted(arr, (f, s) => f >= s);
  }
}

export const list = new List();
