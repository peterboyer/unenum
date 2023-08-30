/**
Creates a union of mutually exclusive, discriminable variants.

@example
```ts
import "unenum/global.enum"; // global
import type { Enum } from "unenum"; // imported

type Foo = Enum<{
  A: true;
  B: { b: string };
  C: { c: number };
}>;
-> | { is: "A" }
   | { is: "B"; b: string }
   | { is: "C"; c: number }
```
*/
export type Enum<
	TVariants extends EnumVariants,
	TDiscriminant extends EnumDiscriminant = EnumDiscriminantDefault
> = {
	// prettier-ignore
	[TVariantKey in keyof TVariants]-?:
		TVariants[TVariantKey] extends true
			? EnumVariantUnit<TVariantKey & string, TDiscriminant>
		: TVariants[TVariantKey] extends Record<string, unknown>
			? EnumVariantData<TVariantKey & string, TVariants[TVariantKey], TDiscriminant>
		: never;
}[keyof TVariants];

export namespace Enum {
	// @ts-expect-error Should work.
	export type {
		EnumKeys as Keys,
		EnumUnwrap as Unwrap,
		EnumPick as Pick,
		EnumOmit as Omit,
		EnumMerge as Merge,
		EnumExtend as Extend,
	};
}

export type EnumVariants = Record<string, true | Record<string, unknown>>;
export type EnumDiscriminant = string;
export type EnumDiscriminantDefault = "is";

export type EnumVariantUnit<
	TKey extends string,
	TDiscriminant extends EnumDiscriminant = EnumDiscriminantDefault
> = Identity<{ [TDiscriminantKey in TDiscriminant]: TKey }>;

export type EnumVariantData<
	TKey extends string,
	TData extends Record<string, unknown>,
	TDiscriminant extends EnumDiscriminant = EnumDiscriminantDefault
> = Identity<{ [TDiscriminantKey in TDiscriminant]: TKey } & TData>;

/**
Infers all variants' keys of the given Enum.

@example
```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Keys<Foo>
-> "A" | "B" | "C"
```
 */
type EnumKeys<
	TEnum,
	TDiscriminant extends EnumDiscriminant = EnumDiscriminantDefault
> = TEnum extends Record<TDiscriminant, string> ? TEnum[TDiscriminant] : never;

/**
Infers all variants' unit and data definitions of the given Enum.

@example
```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Unwrap<Foo>
-> | { A: true; B: { b: string }; C: { c: number } }
```
 */
type EnumUnwrap<
	TEnum,
	TDiscriminant extends EnumDiscriminant = EnumDiscriminantDefault
> = Identity<
	Intersect<
		TEnum extends Record<TDiscriminant, string>
			? {
					[key in TEnum[TDiscriminant]]: Exclude<
						keyof TEnum,
						TDiscriminant
					> extends never
						? true
						: Identity<Omit<TEnum, TDiscriminant>>;
			  }
			: never
	>
>;

/**
Narrows a given Enum by including only the given variants by key.

@example
```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Pick<Foo, "A" | "C">
-> | { is: "A" }
   | { is: "C"; c: number }
```
 */
type EnumPick<
	TEnum,
	TKeys extends EnumKeys<TEnum, TDiscriminant>,
	TDiscriminant extends EnumDiscriminant = EnumDiscriminantDefault
> = TEnum extends Record<TDiscriminant, TKeys> ? TEnum : never;

/**
Narrows a given Enum by excluding only the given variants by key.

@example
```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Omit<Foo, "A" | "C">
-> | { is: "B"; b: string }
```
 */
type EnumOmit<
	TEnum,
	TKeys extends EnumKeys<TEnum, TDiscriminant>,
	TDiscriminant extends EnumDiscriminant = EnumDiscriminantDefault
> = TEnum extends Record<TDiscriminant, TKeys> ? never : TEnum;

/**
Merges a union of Enums' variants and properties into a new Enum.

@example
```ts
type Foo = Enum<{ A: true; B: true; C: { c1: string } }>;
type Bar = Enum<{ B: { b1: string }; C: { c2: number }; D: true }>;

Enum.Merge<Foo | Bar>
-> Enum<{
  A: true;
  B: { b1: string };
  C: { c1: string; c2: number };
  D: true;
}>
```
*/
type EnumMerge<
	TEnums,
	TDiscriminant extends EnumDiscriminant = EnumDiscriminantDefault
> = Enum<
	TrueOrObj<
		Intersect<
			TrueAsEmpty<
				TEnums extends unknown ? EnumUnwrap<TEnums, TDiscriminant> : never
			>
		>
	>,
	TDiscriminant
>;

/**
@internal
 */
type TrueOrObj<T> = {
	[K in keyof T]: keyof T[K] extends never ? true : Identity<T[K]>;
};

/**
@internal
 */
type TrueAsEmpty<T> = {
	[K in keyof T]: T[K] extends true ? Record<never, never> : T[K];
};

/**
Merges new additional variants and properties into a new Enum.

@example
```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Extend<Foo, { D: true }>
-> Enum<{
  A: true;
  B: { b: string };
  C: { c: number };
  D: true;
}>
```
 */
type EnumExtend<
	TEnum,
	TVariants extends EnumVariants,
	TDiscriminant extends EnumDiscriminant = EnumDiscriminantDefault
> = EnumMerge<TEnum | Enum<TVariants, TDiscriminant>, TDiscriminant>;

/**
Merges intersections.

@internal

@example
```
Identity<{ is: "Data" } & { value: string }>
-> { is: "Data"; value: string }
```
 */
// https://stackoverflow.com/a/49683575
type Identity<T> = T extends object ? { [K in keyof T]: T[K] } : never;

/**
Create an intersection of all union members.

@internal

@example
```
Intersect<{ A: string } | { B: string } | { C: string }>
-> { A: string, B: string, C: string }
```
 */
type Intersect<T> = (T extends unknown ? (t: T) => void : never) extends (
	t: infer R
) => void
	? R
	: never;
