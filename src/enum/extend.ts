import type { Enum } from "../enum";
import type { Merge } from "./merge";

export type Extend<
	TEnum,
	TVariants extends Enum.Variants,
	TDiscriminant extends Enum.Discriminant = Enum.Discriminant.Default
> = Merge<TEnum | Enum<TVariants, TDiscriminant>, TDiscriminant>;
