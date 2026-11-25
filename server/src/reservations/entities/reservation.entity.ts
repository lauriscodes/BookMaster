import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Reservation {
	@Prop()
	declare name: string;

	@Prop()
	declare start: string;

	@Prop()
	declare room: number;

	@Prop()
	declare email: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
