import { Enum } from "./enum";
import type { Equal, Expect } from "./shared/tests";

describe("Enum", () => {
	test("Default", () => {
		type Event = Enum<{
			Open: true;
			Data: { value: unknown };
			Close: true;
		}>;

		const Event = Enum({} as Event);

		{
			const eventOpen = Event.Open();
			expect(eventOpen).toStrictEqual({ _type: "Open" });
			const eventData = Event.Data({ value: "..." });
			expect(eventData).toStrictEqual({ _type: "Data", value: "..." });
			const eventClose = Event.Close();
			expect(eventClose).toStrictEqual({ _type: "Close" });

			void [eventOpen, eventData, eventClose];
		}
	});

	test("Mapped", () => {
		type Event = Enum<{
			Open: true;
			Data: { value: unknown };
			Close: true;
		}>;

		const Event = Enum({} as Event, {
			Data: (value: unknown) => ({ value }),
		});

		{
			const eventOpen = Event.Open();
			expect(eventOpen).toStrictEqual({ _type: "Open" });
			const eventData = Event.Data("...");
			expect(eventData).toStrictEqual({ _type: "Data", value: "..." });
			const eventClose = Event.Close();
			expect(eventClose).toStrictEqual({ _type: "Close" });

			void [eventOpen, eventData, eventClose];
		}
	});

	test("Custom", () => {
		type Event = Enum<
			{
				Open: true;
				Data: { value: unknown };
				Close: true;
			},
			"custom"
		>;

		const Event = Enum([{} as Event, "custom"], {
			Data: (value: unknown) => ({ value }),
		});

		{
			const eventOpen: Event = { custom: "Open" };
			const eventData: Event = { custom: "Data", value: "..." };
			const eventClose: Event = { custom: "Close" };

			void [eventOpen, eventData, eventClose];
		}

		{
			const eventOpen = Event.Open();
			expect(eventOpen).toStrictEqual({ custom: "Open" });
			const eventData = Event.Data("...");
			expect(eventData).toStrictEqual({ custom: "Data", value: "..." });
			const eventClose = Event.Close();
			expect(eventClose).toStrictEqual({ custom: "Close" });

			void [eventOpen, eventData, eventClose];
		}
	});
});

describe("Enum.is", () => {
	test("Default", () => {
		type Event = Enum<{
			Open: true;
			Data: { value: unknown };
			Close: true;
		}>;

		const Event = Enum({} as Event);
		const event = {} as Event;

		{
			if (Enum.is(event, "Open")) {
				({}) as [Expect<Equal<typeof event, Enum.Pick<Event, "Open">>>];
			} else if (Enum.is(event, "Data")) {
				({}) as [Expect<Equal<typeof event, Enum.Pick<Event, "Data">>>];
			} else {
				({}) as [Expect<Equal<typeof event, Enum.Pick<Event, "Close">>>];
			}
		}

		{
			if (Enum.is(event, ["Open", "Close"])) {
				({}) as [
					Expect<Equal<typeof event, Enum.Pick<Event, "Open" | "Close">>>
				];
			} else {
				({}) as [Expect<Equal<typeof event, Enum.Pick<Event, "Data">>>];
			}
		}

		{
			const event = Event.Open() as Event;
			expect(Enum.is(event, "Open")).toEqual(true);
			expect(Enum.is(event, "Data")).toEqual(false);
			expect(Enum.is(event, ["Open", "Close"])).toEqual(true);
			expect(Enum.is(event, ["Data", "Close"])).toEqual(false);
		}
	});

	test("Default", () => {
		type Event = Enum<
			{
				Open: true;
				Data: { value: unknown };
				Close: true;
			},
			"custom"
		>;

		const Event = Enum([{} as Event, "custom"]);
		const event = {} as Event;

		{
			if (Enum.is(event, "custom", "Open")) {
				({}) as [
					Expect<Equal<typeof event, Enum.Pick<Event, "Open", "custom">>>
				];
			} else if (Enum.is(event, "custom", "Data")) {
				({}) as [
					Expect<Equal<typeof event, Enum.Pick<Event, "Data", "custom">>>
				];
			} else {
				({}) as [
					Expect<Equal<typeof event, Enum.Pick<Event, "Close", "custom">>>
				];
			}
		}

		{
			if (Enum.is(event, "custom", ["Open", "Close"])) {
				({}) as [
					Expect<
						Equal<typeof event, Enum.Pick<Event, "Open" | "Close", "custom">>
					>
				];
			} else {
				({}) as [
					Expect<Equal<typeof event, Enum.Pick<Event, "Data", "custom">>>
				];
			}
		}

		{
			const event = Event.Open() as Event;
			expect(Enum.is(event, "custom", "Open")).toEqual(true);
			expect(Enum.is(event, "custom", "Data")).toEqual(false);
			expect(Enum.is(event, "custom", ["Open", "Close"])).toEqual(true);
			expect(Enum.is(event, "custom", ["Data", "Close"])).toEqual(false);
		}
	});
});
