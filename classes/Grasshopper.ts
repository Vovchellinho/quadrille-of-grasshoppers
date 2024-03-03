import type { TBoard, TColor } from "../typings";

class Grasshopper {
	x: number;
	y: number;
	color: TColor;

	constructor(x: number, y:number, color: TColor) {
		this.x = x;
		this.y = y;
		this.color = color
	};
};

export default Grasshopper;