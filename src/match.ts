/**
Uses a given `Enum` value to evaluate and return the result of the matching
`matcher` functions based on its variant. If any variants are not specified in
the `matcher`, `undefined` is returned as a fallback. If a `fallback` function
is specified then the return value is returned as a fallback.

```ts import { match } from "unenum"; // runtime

type Foo = Enum<{ A: undefined; B: { b: string }; C: { c: number } }>;
const foo: Foo = ...

// all cases
match(foo, {
	A: () => null,
	B: ({ b }) => b,
	C: ({ c }) => c,
})
-> null | string | number

// missing some cases
match(foo, {
	A: () => null,
	B: ({ b }) => b,
})
-> null | string | undefined

// using a fallback
match(foo, {
	A: () => null,
	B: ({ b }) => b,
}, ({ c }) => true)
-> null | string | boolean
```
 */
export function match<
	TEnum extends { is: string },
	TMatcher extends Matcher<TEnum>
>(
	value: TEnum,
	matcher: TMatcher
): ReturnType<NonNullable<TMatcher[keyof TMatcher]>>;

export function match<
	TEnum extends { is: string },
	TMatcher extends Partial<Matcher<TEnum>>
>(
	value: TEnum,
	matcher: TMatcher
): ReturnType<NonNullable<TMatcher[keyof TMatcher]>> | undefined;

export function match<
	TEnum extends { is: string },
	TMatcher extends Partial<Matcher<TEnum>>,
	TFallback extends Fallback<TEnum, TMatcher>
>(
	value: TEnum,
	matcher: TMatcher,
	fallback: TFallback
): ReturnType<NonNullable<TMatcher[keyof TMatcher]>> | ReturnType<TFallback>;

export function match<
	TEnum extends { is: string },
	TMatcher extends Record<string, (value: unknown) => unknown>,
	TFallback extends (value: unknown) => unknown
>(value: TEnum, matcher: TMatcher, fallback?: TFallback): unknown {
	const { is } = value;
	const matcherValue = matcher[is as keyof TMatcher];
	if (!matcherValue) {
		return fallback ? fallback(value) : undefined;
	}
	return matcherValue(value);
}

type Matcher<TEnum extends { is: string }> = {
	[TVariant in TEnum["is"]]: (
		value: TEnum extends { is: TVariant } ? TEnum : never
	) => unknown;
};

type Fallback<TEnum, TMatcher> = (
	value: NeverAsUnknown<TEnum extends { is: keyof TMatcher } ? never : TEnum>
) => unknown;

type NeverAsUnknown<T> = [T] extends [never] ? unknown : T;
