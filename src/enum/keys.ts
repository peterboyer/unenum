import type { Enum } from "../enum";

export type Keys<
	TEnum extends Enum.Any<TDiscriminant>,
	TDiscriminant extends Enum.Discriminant = Enum.Discriminant.Default
> = TEnum[TDiscriminant];
