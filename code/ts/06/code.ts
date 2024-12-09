const input = await Bun.file(`${import.meta.dir}/../../../input/6.txt`).text();

type Position = {
    x: number;
    y: number;
};

type Direction = "up" | "down" | "left" | "right";

const parseData = (rawData: string): string[][] => {
    return rawData.split("\n").map(row => row.split(""));
};

const getGuardStartPosition = (data: string[][]): Position => {
    let x: number = -1,
        y: number = -1;
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] === "^") {
                x = j;
                y = i;
                break;
            }
        }
    }
    return { x, y };
};

const inBounds = (data: string[][], pos: Position): boolean => {
    return pos.y >= 0 && pos.y < data.length && pos.x >= 0 && pos.x < data[0].length;
};

const getNextDirection = (direction: Direction): Direction => {
    switch (direction) {
        case "down":
            return "left";
        case "right":
            return "down";
        case "up":
            return "right";
        case "left":
            return "up";
    }
};

const getNextPosition = (currentPosition: Position, direction: Direction): Position => {
    const nextPosition = { ...currentPosition };
    switch (direction) {
        case "down":
            nextPosition.y++;
            break;
        case "right":
            nextPosition.x++;
            break;
        case "up":
            nextPosition.y--;
            break;
        case "left":
            nextPosition.x--;
            break;
    }
    return nextPosition;
};

const moveUntilExit = (data: string[][], startPosition: Position): Set<string> => {
    let direction: Direction = "up";
    const visited = new Set<string>();

    data[startPosition.y][startPosition.x] = ".";
    visited.add(`${startPosition.y},${startPosition.x}`);

    let currentPosition = { ...startPosition };
    while (true) {
        const nextPosition = getNextPosition(currentPosition, direction);
        if (!inBounds(data, nextPosition)) {
            break;
        }
        if (data[nextPosition.y][nextPosition.x] === "#") {
            direction = getNextDirection(direction);
        } else if (data[nextPosition.y][nextPosition.x] === ".") {
            currentPosition = { ...nextPosition };
            visited.add(`${nextPosition.y},${nextPosition.x}`);
        }
    }
    return visited;
};

const guardHasReturnVisit = (
    data: string[][],
    startPosition: Position,
    newObstacle: Position,
): boolean => {
    const dataCopy = data.map(row => row.map(cell => cell));
    dataCopy[newObstacle.y][newObstacle.x] = "#";

    let currentPosition = { ...startPosition };
    let direction: Direction = "up";
    const visits = new Set<string>();
    while (true) {
        const positionAndDirection = `${currentPosition.y},${currentPosition.x},${direction}`;

        if (visits.has(positionAndDirection)) {
            return true;
        }

        visits.add(positionAndDirection);
        const nextPosition = getNextPosition(currentPosition, direction);
        if (!inBounds(data, nextPosition)) {
            return false;
        }
        if (dataCopy[nextPosition.y][nextPosition.x] === "#") {
            direction = getNextDirection(direction);
        } else {
            currentPosition = { ...nextPosition };
        }
    }
};

const getValidObstacleCount = (
    data: string[][],
    startPos: Position,
    visited: Set<string>,
): number => {
    let result = 0;
    for (let y = 0; y < data.length; y++) {
        for (let x = 0; x < data[0].length; x++) {
            if (
                !visited.has(`${y},${x}`) ||
                data[y][x] === "#" ||
                (y === startPos.y && x === startPos.x)
            ) {
                continue;
            }

            if (guardHasReturnVisit(data, startPos, { y, x })) {
                result++;
            }
        }
    }

    return result;
};

export const sp1 = (input: string): string => {
    const data = parseData(input);

    const startPosition = getGuardStartPosition(data);
    const visited = moveUntilExit(data, startPosition);
    const result = visited.size;

    return result.toString();
};

export const partone = sp1(input);

export const sp2 = (input: string): string => {
    const data = parseData(input);

    const startPosition = getGuardStartPosition(data);
    const visited = moveUntilExit(data, startPosition);
    const result = getValidObstacleCount(data, startPosition, visited);

    return result.toString();
};

export const parttwo = sp2(input);
