import type { Enum } from "../enum";

export type Omit<
	TEnum extends Enum.Any<TDiscriminant>,
	TKeys extends Enum.Keys<TEnum, TDiscriminant>,
	TDiscriminant extends Enum.Discriminant = Enum.Discriminant.Default
> = Exclude<TEnum, Record<TDiscriminant, TKeys>>;
