/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Enum } from "./enum";

export const match =
	<
		TEnum extends Enum.Any<TDiscriminant>,
		TDiscriminant extends keyof TEnum & string = keyof TEnum &
			Enum.Discriminant.Default
	>(
		value: TEnum,
		discriminant: TDiscriminant = "_type" as TDiscriminant
	) =>
	<
		TEnumMatcher extends {
			[Key in keyof Enum.Infer<TEnum, TDiscriminant>]: Enum.Infer<
				TEnum,
				TDiscriminant
			>[Key] extends true
				? () => unknown
				: (value: Enum.Infer<TEnum, TDiscriminant>[Key]) => unknown;
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
		_:
			| (undefined extends TMatcher[Exclude<keyof TMatcher, "_">]
					? never
					: {
							[Key in keyof TMatcher]: TMatcher[Key] extends (
								...args: any[]
							) => any
								? ReturnType<TMatcher[Key]>
								: never;
					  }[keyof TMatcher])
			| (TFallback extends (...args: any[]) => any
					? ReturnType<TFallback>
					: never);
		// debug
		$: {
			matcher: TMatcher;
			fallback: TFallback;
			discriminant: TDiscriminant;
			keyofTEnum: keyof TEnum;
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
