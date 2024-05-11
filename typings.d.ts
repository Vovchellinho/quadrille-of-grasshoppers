export type TGrasshopperClass = {
	x: number;
	y: number;
	color: TColor;
	
}

export type TPosition = {
	x: number;
	y: number;
}

export type TBoardClass = {
	size: number;
	board: Array<Array<TGrasshopperClass | null>>;

	copy: (board: TBoard) => TBoardClass;
	setStartPosition: () => void;
	initialize: () => any[];
	getSize: () => number;
	setPos: (x: number, y: number, grasshopper: TGrasshopperClass | null) => void;
	getPos: (x: number, y: number) => TGrasshopperClass | null;
	getNextPossiblePositions: () => {
		positions: TBoardClass[];
		valid: boolean;
	};
	getNullPositions: () => TPosition[];
	draw: () => void;
	setFinishPosition: () => void;
	getH: () => number; 
};

export type TBoard = Array<Array<TGrasshopperClass | null>>;

export type TColor = 'white' | 'black';

export type TBoardVariant = {
	parentId: number | null;
	id: number;
	board: TBoardClass | null;
	g: number;
	h: number;
}