import { Injectable } from "@nestjs/common";
import { Genkit, genkit, ToolAction, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { ReservationsService } from "../reservations.service";

@Injectable()
export class AiService {
	private ai: Genkit;
	private tool: ToolAction;

	constructor(private reservationsService: ReservationsService) {
		this.ai = genkit({
			plugins: [googleAI()],
			model: googleAI.model("gemini-2.5-flash")
		});

		this.tool = this.ai.defineTool(
			{
				name: "createReservation",
				description: "Creates a new reservation",
				inputSchema: z.object({
					name: z.string(),
					email: z.string(),
					start: z.string(),
					room: z.number()
				}),
				outputSchema: z.string()
			},
			async (input) => {
				const rooms = await this.reservationsService.findRooms(input.start);
				if (!rooms.includes(input.room)) {
					return `Room ${input.room} is unavailable`;
				}

				const res = await this.reservationsService.create(input);
				return res.message;
			}
		);
	}

	async ask(prompt: string) {
		const resp = await this.ai.generate({
			prompt,
			tools: [this.tool]
		});
		const toolMessage = resp.messages.find((message) => message.role === "tool");
		const output: unknown = toolMessage?.content[0]?.toolResponse?.output;
		return {
			message: typeof output === "string" ? output : resp.text
		};
	}
}
