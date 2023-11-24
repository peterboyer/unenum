import type { Expect, Equal } from "./shared/tests";
import type { Enum } from "./enum";
import { Value } from "./value";

describe("Value", () => {
	type Value = Enum<{ Unit: true; Data: { value: unknown } }>;

	test("naked", () => {
		{
			const value: Value = Value("Unit");
			expect(value).toStrictEqual({ _type: "Unit" });
			void value;
		}
	});

	test("infer from value", () => {
		{
			const value: Value = Value("Unit");
			expect(value).toStrictEqual({ _type: "Unit" });
			void value;
		}

		{
			// @ts-expect-error Requires `data` argument.
			const value: Value = Value("Data");
			void value;
		}

		{
			const value: Value = Value("Data", { value: "..." });
			expect(value).toStrictEqual({ _type: "Data", value: "..." });
			void value;
		}
	});

	test("infer from return", () => {
		{
			const fn = (): Value => Value("Unit");
			expect(fn()).toStrictEqual({ _type: "Unit" });
			({}) as [Expect<Equal<ReturnType<typeof fn>, Value>>];
		}

		{
			// @ts-expect-error Requires `data` argument.
			const fn = (): Value => Value("Data");
			void fn;
		}

		{
			const fn = (): Value => Value("Data", { value: "..." });
			expect(fn()).toStrictEqual({ _type: "Data", value: "..." });
			({}) as [Expect<Equal<ReturnType<typeof fn>, Value>>];
		}
	});
});
