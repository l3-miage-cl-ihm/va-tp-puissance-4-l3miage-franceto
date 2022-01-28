export interface Assertion<P extends unknown[], V> {
  args: P;
  expectedResult: {type: 'value', value: V} | {type: 'function', fct: (...p: P) => V};
  errorExpected?: boolean;
  comment: string;
};

export function assertEqual(a: unknown, b: unknown): boolean {
  switch (typeof a) {
      case "object":
          return [...Object.keys(a as Object), ...Object.keys(b as Object)].reduce(
            (acc, k) => acc && assertEqual( (a as any)[k], (b as any)[k]),
            true as boolean
          );
      default:
          return a === b;
  }
}
