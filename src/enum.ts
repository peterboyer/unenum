import type { Identity } from "./enum/shared/identity";
import type { Infer as _Infer } from "./enum/infer";
import type { Keys as _Keys } from "./enum/keys";
import type { Pick as _Pick } from "./enum/pick";
import type { Omit as _Omit } from "./enum/omit";
import type { Merge as _Merge } from "./enum/merge";
import type { Extend as _Extend } from "./enum/extend";

export type Enum<
	TVariants extends Enum.Variants,
	TDiscriminant extends Enum.Discriminant = Enum.Discriminant.Default
> = {
	[TKey in keyof TVariants]-?: TVariants[TKey] extends Enum.Variants.VariantUnitValueAny
		? Enum.Variants.VariantUnit<TKey & string, TDiscriminant>
		: TVariants[TKey] extends Enum.Variants.VariantDataValueAny
		? Enum.Variants.VariantData<TKey & string, TVariants[TKey], TDiscriminant>
		: never;
}[keyof TVariants];

export namespace Enum {
	export type Any<TDiscriminant extends Discriminant = Discriminant.Default> =
		Record<TDiscriminant, string>;

	export type Discriminant = string;

	export namespace Discriminant {
		export type Default = "_type";
	}

	export type Variants = Record<
		Variants.VariantKeyAny,
		Variants.VariantUnitValueAny | Variants.VariantDataValueAny
	>;

	export namespace Variants {
		export type VariantKeyAny = string;

		export type VariantUnitValueAny = true;

		export type VariantDataValueAny = Record<string, unknown>;

		export type VariantUnit<
			TKey extends VariantKeyAny,
			TDiscriminant extends Enum.Discriminant
		> = Identity<{ [TDiscriminantKey in TDiscriminant]: TKey }>;

		export type VariantData<
			TKey extends VariantKeyAny,
			TData extends VariantDataValueAny,
			TDiscriminant extends Enum.Discriminant
		> = Identity<{ [TDiscriminantKey in TDiscriminant]: TKey } & TData>;
	}

	export type Infer<
		TEnum,
		TDiscriminant extends Discriminant = Discriminant.Default
	> = _Infer<TEnum, TDiscriminant>;

	export type Keys<
		TEnum,
		TDiscriminant extends Discriminant = Discriminant.Default
	> = _Keys<TEnum, TDiscriminant>;

	export type Pick<
		TEnum,
		TKeys extends Keys<TEnum, TDiscriminant>,
		TDiscriminant extends Discriminant = Discriminant.Default
	> = _Pick<TEnum, TKeys, TDiscriminant>;

	export type Omit<
		TEnum,
		TKeys extends Keys<TEnum, TDiscriminant>,
		TDiscriminant extends Discriminant = Discriminant.Default
	> = _Omit<TEnum, TKeys, TDiscriminant>;

	export type Merge<
		TEnums,
		TDiscriminant extends Discriminant = Discriminant.Default
	> = _Merge<TEnums, TDiscriminant>;

	export type Extend<
		TEnum,
		TVariants extends Variants,
		TDiscriminant extends Discriminant = Discriminant.Default
	> = _Extend<TEnum, TVariants, TDiscriminant>;
}
