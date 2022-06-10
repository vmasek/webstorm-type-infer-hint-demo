import { map, of } from 'rxjs';

type MyObject = {
  foo: {
    bar?: {
      items: (string | undefined)[]
    }
  }
}

const DATA: MyObject = {
  foo: { bar: {items: ['a', undefined]} }
}

export function filterNonEmptyArrayItems<T>(
  items?: (T | null | undefined)[],
): T[] {
  return (items || []).filter((value): value is T => value != null);
}

export function exists<T>(value: T | null | undefined): value is T {
  return value != null;
}

//   TS: ✅ - Observable<MyObject>
// Hint: ✅ - Observable<MyObject>
const data$ = of(DATA);

//   TS: ✅ - Observable<string[]>
// Hint: ✅ - Observable<string[]>
const example1$ = data$.pipe(
  map(({foo}) =>
    filterNonEmptyArrayItems(foo.bar?.items),
  ),
);

//   TS: ✅ - Observable<string[]>
// Hint: ❌ - Observable<(string | undefined)[]>
const example2$ = data$.pipe(
  map(({foo}) =>
    foo.bar ?
      foo.bar.items.filter(exists)
      : [],
  ),
);

//   TS: ✅ - Observable<string[]>
// Hint: ❌ - Observable<(string | undefined)[]>
const example3$ = data$.pipe(
  map(({foo}) =>
    foo.bar?
      foo.bar.items.filter(<T>(value: T | null | undefined): value is T => value != null)
      : [],
  ),
);

//   TS: ✅ - Observable<string[] | undefined>
// Hint: ❌ - Observable<any>
const example4$ = data$.pipe(
  map(({foo}) =>
    foo.bar?.items.filter(exists),
  ),
);
