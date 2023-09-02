import type { EnumDiscriminant } from "./enum";

/**
Uses a given `Enum` `value` to execute its corresponding variants' `matcher`
function and return its result. Use `match.partial(...)` if you want to match
against only a subset of variants.

```ts
import { match } from "unenum"; // dependency

type Foo = Enum<{ A: undefined; B: { b: string }; C: { c: number } }>;
const foo: Foo = ...

// exhaustive
match(foo, {
  A: () => null,
  B: ({ b }) => b,
  C: ({ c }) => c,
})
-> null | string | number

// default case
match.partial(foo, {
  A: () => null,
  B: ({ b }) => b,
  _: () => undefined,
})
-> null | string | undefined
```
 */
export const match = <TDiscriminant extends EnumDiscriminant>(
	discriminant: TDiscriminant
) => {
	const fn = <
		TEnum extends Record<TDiscriminant, string>,
		TMatcher extends Matcher<TDiscriminant, TEnum>
	>(
		value: TEnum,
		matcher: TMatcher
	): ReturnType<NonNullable<TMatcher[keyof TMatcher]>> => {
		const key = value[discriminant];
		const matcherValue = matcher[key as keyof TMatcher & string];
		if (!matcherValue) {
			throw TypeError(`unhandled enum variant: ${JSON.stringify(value)}`);
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return matcherValue(value as any) as ReturnType<
			NonNullable<TMatcher[keyof TMatcher]>
		>;
	};

	fn.partial = <
		TEnum extends Record<TDiscriminant, string>,
		TMatcher extends Partial<Matcher<TDiscriminant, TEnum>> & {
			_: () => unknown;
		}
	>(
		value: TEnum,
		matcher: TMatcher
	):
		| ReturnType<NonNullable<TMatcher[keyof TMatcher]>>
		| ReturnType<TMatcher["_"]> => {
		const key = value[discriminant];
		const match = matcher[key as keyof TMatcher & string];
		if (!match) {
			return matcher["_"]() as ReturnType<typeof fn>;
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return match(value as any) as ReturnType<typeof fn>;
	};

	return fn;
};

type Matcher<
	TDiscriminant extends EnumDiscriminant,
	TEnum extends Record<TDiscriminant, string>
> = {
	[TKey in TEnum[TDiscriminant]]: (
		value: TEnum extends Record<TDiscriminant, TKey> ? TEnum : never
	) => unknown;
};
