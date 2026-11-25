import { Component, inject } from "@angular/core";
import { TitleService } from "./title.service";
import { Booking } from "./booking/booking";

@Component({
	selector: "app-root",
	imports: [Booking],
	templateUrl: "./app.html",
	styleUrl: "./app.scss"
})
export class App {
	private readonly titleService = inject(TitleService);
	protected readonly title = this.titleService.title;
	// To set the title, use: this.chapterTitleService.setTitle('new-title');

	constructor() {
		this.titleService.setTitle("BookMaster");
	}
}
