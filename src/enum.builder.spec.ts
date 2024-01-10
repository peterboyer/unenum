import { Enum } from "./enum.js";

describe("Enum.builder", () => {
	test("Default", () => {
		type Event = Enum<{
			Open: true;
			Data: { value: unknown };
			Close: true;
		}>;

		const Event = Enum.builder({} as Event);

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

		const Event = Enum.builder({} as Event, {
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
});

describe("Enum.builder_", () => {
	test("Custom", () => {
		type Event = Enum<
			{
				Open: true;
				Data: { value: unknown };
				Close: true;
			},
			"custom"
		>;

		const Event = Enum.builder_({} as Event, "custom", {
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
