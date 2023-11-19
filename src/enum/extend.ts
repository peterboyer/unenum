import type {
	Enum,
	VariantsAny,
	DiscriminantAny,
	DiscriminantDefault,
} from "./enum";
import type { Merge } from "./merge";

export type Extend<
	TEnum,
	TVariants extends VariantsAny,
	TDiscriminant extends DiscriminantAny = DiscriminantDefault
> = Merge<TEnum | Enum<TVariants, TDiscriminant>, TDiscriminant>;
