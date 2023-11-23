import type { Enum } from "../enum";

export type Extend<
	TEnum extends Enum.Any<TDiscriminant>,
	TVariants extends Enum.Variants,
	TDiscriminant extends Enum.Discriminant = Enum.Discriminant.Default
> = Enum.Merge<TEnum | Enum<TVariants, TDiscriminant>, TDiscriminant>;
