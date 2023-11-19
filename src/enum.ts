import type {
	Enum as _Enum,
	VariantsAny,
	DiscriminantAny,
	DiscriminantDefault,
} from "./enum/enum";

// Enum

export type Enum<
	TVariants extends VariantsAny,
	TDiscriminant extends DiscriminantAny = DiscriminantDefault
> = _Enum<TVariants, TDiscriminant>;

// Primitives

export type {
	VariantKeyAny,
	VariantUnitValueAny,
	VariantDataValueAny,
	VariantsAny,
	DiscriminantAny,
	DiscriminantDefault,
	VariantUnit,
	VariantData,
} from "./enum/enum";

import type { Extend as _Extend } from "./enum/extend";
import type { Infer as _Infer } from "./enum/infer";
import type { Keys as _Keys } from "./enum/keys";
import type { Merge as _Merge } from "./enum/merge";
import type { Omit as _Omit } from "./enum/omit";
import type { Pick as _Pick } from "./enum/pick";

// Utils

// prettier-ignore
export namespace Enum {
	export type Extend<TEnum, TVariants extends VariantsAny, TDiscriminant extends DiscriminantAny = DiscriminantDefault> = _Extend<TEnum, TVariants, TDiscriminant>
	export type Infer<TEnum, TDiscriminant extends DiscriminantAny = DiscriminantDefault> = _Infer<TEnum, TDiscriminant>;
	export type Keys<TEnum, TDiscriminant extends DiscriminantAny = DiscriminantDefault> = _Keys<TEnum, TDiscriminant>;
	export type Merge<TEnums, TDiscriminant extends DiscriminantAny = DiscriminantDefault> = _Merge<TEnums, TDiscriminant>
	export type Omit<TEnum, TKeys extends Keys<TEnum, TDiscriminant>, TDiscriminant extends DiscriminantAny = DiscriminantDefault> = _Omit<TEnum, TKeys, TDiscriminant>
	export type Pick<TEnum, TKeys extends Keys<TEnum, TDiscriminant>, TDiscriminant extends DiscriminantAny = DiscriminantDefault> = _Pick<TEnum, TKeys, TDiscriminant>
}

import { match } from "./enum/match";

export const Enum = {
	match,
};
