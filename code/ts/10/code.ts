const input = await Bun.file(`${import.meta.dir}/../../../input/10.txt`).text();

type Point = { x: number; y: number };
type Grid = number[][];

const parseInput = (input: string): Grid => {
    return input.split('\n').map(line => 
        line.split('').map(Number)
    );
};

const findTrailheads = (grid: Grid): Point[] => {
    const trailheads: Point[] = [];
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 0) {
                trailheads.push({ x, y });
            }
        }
    }
    return trailheads;
};

const getNeighbors = (point: Point, grid: Grid): Point[] => {
    const { x, y } = point;
    const neighbors: Point[] = [];
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // right, down, left, up
    
    for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
        if (newY >= 0 && newY < grid.length && 
            newX >= 0 && newX < grid[0].length) {
            neighbors.push({ x: newX, y: newY });
        }
    }
    return neighbors;
};

const calculateTrailheadScore = (start: Point, grid: Grid): number => {
    const visited = new Set<string>();
    const reachableNines = new Set<string>();
    
    const dfs = (current: Point, height: number) => {
        const key = `${current.x},${current.y}`;
        if (visited.has(key)) return;
        visited.add(key);
        
        if (grid[current.y][current.x] === 9) {
            reachableNines.add(key);
            return;
        }
        
        for (const neighbor of getNeighbors(current, grid)) {
            const neighborHeight = grid[neighbor.y][neighbor.x];
            if (neighborHeight === height + 1) {
                dfs(neighbor, neighborHeight);
            }
        }
    };
    
    dfs(start, 0);
    return reachableNines.size;
};

export const sp1 = (input: string) => {
    const grid = parseInput(input);
    const trailheads = findTrailheads(grid);
    
    return trailheads.reduce((sum, trailhead) => 
        sum + calculateTrailheadScore(trailhead, grid), 0);
};

export const partone = sp1(input);

const calculateTrailheadRating = (start: Point, grid: Grid): number => {
    const paths = new Set<string>();
    
    const dfs = (current: Point, path: string) => {
        const currentHeight = grid[current.y][current.x];
        
        if (currentHeight === 9) {
            paths.add(path);
            return;
        }
        
        for (const neighbor of getNeighbors(current, grid)) {
            const neighborHeight = grid[neighbor.y][neighbor.x];
            if (neighborHeight === currentHeight + 1) {
                dfs(neighbor, path + `${neighbor.x},${neighbor.y};`);
            }
        }
    };
    
    dfs(start, `${start.x},${start.y};`);
    return paths.size;
};

export const sp2 = (input: string) => {
    const grid = parseInput(input);
    const trailheads = findTrailheads(grid);
    
    return trailheads.reduce((sum, trailhead) => 
        sum + calculateTrailheadRating(trailhead, grid), 0);
};

export const parttwo = sp2(input);