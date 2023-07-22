/**
Uses a given `Enum` `value` to execute its corresponding variants' `matcher`
function and return its result. Use `match.orUndefined(...)` or
`match.orDefault(...)` if you want to match against only a subset of variants.

```ts
import { match } from "unenum"; // dependency

type Foo = Enum<{ A: undefined; B: { b: string }; C: { c: number } }>;
const foo: Foo = ...

// all cases
match(foo, {
  A: () => null,
  B: ({ b }) => b,
  C: ({ c }) => c,
})
-> null | string | number

// some cases or undefined
match.orUndefined(foo, {
  A: () => null,
  B: ({ b }) => b,
})
-> null | string | undefined

// some cases or default
match.orDefault(
  foo,
  { A: () => null },
  ($) => $.is === "B" ? true : false
)
-> null | string | boolean
```
 */
export function match<
	TEnum extends { is: string },
	TMatcher extends Matcher<TEnum>
>(
	value: TEnum,
	matcher: TMatcher
): ReturnType<NonNullable<TMatcher[keyof TMatcher]>> {
	const { is } = value;
	const matcherValue = matcher[is as keyof TMatcher & string];
	if (!matcherValue) {
		throw TypeError(
			`Given Enum value has no matching variants: ${JSON.stringify(value)}`
		);
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return matcherValue(value as any) as ReturnType<
		NonNullable<TMatcher[keyof TMatcher]>
	>;
}

match.orUndefined = <
	TEnum extends { is: string },
	TMatcher extends Partial<Matcher<TEnum>>
>(
	value: TEnum,
	matcher: TMatcher
): ReturnType<NonNullable<TMatcher[keyof TMatcher]>> | undefined => {
	const { is } = value;
	const matcherValue = matcher[is as keyof TMatcher & string];
	if (!matcherValue) {
		return undefined;
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return matcherValue(value as any) as ReturnType<
		NonNullable<TMatcher[keyof TMatcher]>
	>;
};

match.orDefault = <
	TEnum extends { is: string },
	TMatcher extends Partial<Matcher<TEnum>>,
	TDefaultMatch extends (
		value: NeverAsUnknown<TEnum extends { is: keyof TMatcher } ? never : TEnum>
	) => unknown
>(
	value: TEnum,
	matcher: TMatcher,
	defaultMatch: TDefaultMatch
):
	| ReturnType<NonNullable<TMatcher[keyof TMatcher]>>
	| ReturnType<TDefaultMatch> => {
	const { is } = value;
	const valueMatch = matcher[is as keyof TMatcher & string];
	if (!valueMatch) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return defaultMatch(value as any) as ReturnType<TDefaultMatch>;
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return valueMatch(value as any) as ReturnType<
		NonNullable<TMatcher[keyof TMatcher]>
	>;
};

type Matcher<TEnum extends { is: string }> = {
	[TVariant in TEnum["is"]]: (
		value: TEnum extends { is: TVariant } ? TEnum : never
	) => unknown;
};

type NeverAsUnknown<T> = [T] extends [never] ? unknown : T;
