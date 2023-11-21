import type { Identity } from "./shared/identity";

export type Enum<
	TVariants extends VariantsAny,
	TDiscriminant extends DiscriminantAny = DiscriminantDefault
> = {
	[TKey in keyof TVariants]-?: TVariants[TKey] extends true
		? VariantUnit<TKey & string, TDiscriminant>
		: TVariants[TKey] extends Record<string, unknown>
		? VariantData<TKey & string, TVariants[TKey], TDiscriminant>
		: never;
}[keyof TVariants];

export type EnumAny<TDiscriminant extends DiscriminantAny> = Record<
	TDiscriminant,
	string
>;

export type VariantKeyAny = string;

export type VariantUnitValueAny = true;

export type VariantDataValueAny = Record<string, unknown>;

export type VariantsAny = Record<
	VariantKeyAny,
	VariantUnitValueAny | VariantDataValueAny
>;

export type DiscriminantAny = string;

export type DiscriminantDefault = "_type";

export type VariantUnit<
	TKey extends VariantKeyAny,
	TDiscriminant extends DiscriminantAny
> = Identity<{ [TDiscriminantKey in TDiscriminant]: TKey }>;

export type VariantData<
	TKey extends VariantKeyAny,
	TData extends VariantDataValueAny,
	TDiscriminant extends DiscriminantAny
> = Identity<{ [TDiscriminantKey in TDiscriminant]: TKey } & TData>;
