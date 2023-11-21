/* eslint-disable @typescript-eslint/no-explicit-any */

import type { DiscriminantAny, DiscriminantDefault } from "./enum";
import type { Infer } from "./infer";

// ---

type EnumAny<TDiscriminant extends DiscriminantAny> = Record<
	TDiscriminant,
	string
>;

export const match =
	<
		TEnum extends EnumAny<TDiscriminant>,
		TDiscriminant extends keyof TEnum & string = keyof TEnum &
			DiscriminantDefault
	>(
		value: TEnum,
		discriminant: TDiscriminant = "_type" as TDiscriminant
	) =>
	<
		TEnumMatcher extends {
			[Key in keyof Infer<TEnum, TDiscriminant>]: Infer<
				TEnum,
				TDiscriminant
			>[Key] extends true
				? () => unknown
				: (value: Infer<TEnum, TDiscriminant>[Key]) => unknown;
		},
		TMatcher extends TFallback extends () => unknown
			? [ReturnType<TFallback>] extends [never]
				? TEnumMatcher
				: Partial<TEnumMatcher>
			: TEnumMatcher,
		TFallback extends (() => unknown) | (() => never) | undefined = () => never
	>(
		matcher: TMatcher & { _?: TFallback }
	): {
		_: {
			[Key in keyof TMatcher]: TMatcher[Key] extends (...args: any[]) => any
				? ReturnType<TMatcher[Key]>
				: never;
		}[keyof TMatcher];
		$: {
			matcher: TMatcher;
			fallback: TFallback;
			keyofTEnum: keyof Infer<TEnum, TDiscriminant>;
			keyofTEnumMatcher: keyof TEnumMatcher;
			keyofTMatcher: keyof TMatcher;
		};
	}["_"] => {
		const key = value[discriminant];
		const keyMatchFn =
			matcher[key as unknown as keyof TMatcher & string] ??
			matcher["_" as keyof TMatcher & string];
		if (!keyMatchFn) {
			throw TypeError(`unhandled enum variant: ${JSON.stringify(value)}`);
		}
		return keyMatchFn(value as any) as any;
	};
