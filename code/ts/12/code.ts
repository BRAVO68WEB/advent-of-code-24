const input = await Bun.file(`${import.meta.dir}/../../../input/12.txt`).text();

export type Position = [row: number, column: number];

type Region = {
    char: string;
    points: Position[];
    area: number;
    perimeter: number;
};

type SidePoint = {
    offsetString: string;
    position: Position;
    direction: "x" | "y";
};

const getCurrentRegion = ({
    map,
    position,
    char,
    visited,
}: {
    map: string[][];
    position: Position;
    char: string;
    visited: Set<string>;
}) => {
    const region = {
        char,
        points: [] as Position[],
        area: 0,
        perimeter: 0,
    } satisfies Region;

    const queue = [position];

    do {
        const currentPosition = queue.shift()!;
        const currentPositionString = currentPosition.join(",");

        if (visited.has(currentPositionString)) {
            continue;
        }

        visited.add(currentPosition.join(","));

        const unprocessedNeighbors = getNeighborSimpleVectors({
            position: currentPosition,
            height: map.length,
            width: map[0].length,
        }).map(neighbourOffsets => {
            const newPosition = [
                currentPosition[0] + neighbourOffsets[0],
                currentPosition[1] + neighbourOffsets[1],
            ] as Position;

            return newPosition;
        });

        const unvisitedNeighborsWithinTheSameRegion = unprocessedNeighbors.filter(neighbor => {
            const [row, column] = neighbor;
            const neighborString = neighbor.join(",");
            const neighborChar = map[row][column];
            return neighborChar === char && !visited.has(neighborString);
        });

        const allNeighborsLength = unprocessedNeighbors.length;
        const neighborsWithDifferentChar = unprocessedNeighbors.filter(neighbor => {
            const [row, column] = neighbor;
            const neighborChar = map[row][column];
            return neighborChar === char;
        });

        const neighborsWithDifferentCharLength = neighborsWithDifferentChar.length;

        const outside = 4 - allNeighborsLength;
        const inside = allNeighborsLength - neighborsWithDifferentCharLength;
        const fence = outside + inside;
        region.perimeter += fence;
        region.area += 1;
        region.points.push(currentPosition);

        queue.push(...unvisitedNeighborsWithinTheSameRegion);
    } while (queue.length > 0);

    return region;
};

export const getNeighborSimpleVectors = ({
    position,
    width,
    height,
}: {
    position: Position;
    width: number;
    height: number;
}) => {
    return [
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, 0],
    ].flatMap(([rowOffset, columnOffset]) => {
        if (position[0] + rowOffset < 0) return [];
        if (position[0] + rowOffset >= width) return [];
        if (position[1] + columnOffset < 0) return [];
        if (position[1] + columnOffset >= height) return [];

        return [[rowOffset, columnOffset] as Position];
    });
};

export const getCharMap = (lines: string[]) => {
    return lines.map(line => {
        return [...line].map(char => {
            return char;
        });
    });
};

export const sp1 = (input: string[]): number | bigint => {
    const map = getCharMap(input);

    const visited = new Set<string>();

    const regions = map.flatMap((row, rowIndex) => {
        return row.flatMap((char, columnIndex) => {
            const position = [rowIndex, columnIndex] as Position;
            const positionString = position.join(",");

            if (visited.has(positionString)) {
                return [];
            } else {
                const region = getCurrentRegion({ map, position, char, visited });
                return [region];
            }
        });
    });

    return regions.reduce((acc, region) => {
        return acc + region.area * region.perimeter;
    }, 0);
};

export const partone = sp1(input.split("\n"));

export const sp2 = (input: string[]): number | bigint => {
    const map = getCharMap(input);
    const visited = new Set<string>();

    const regions = map.flatMap((row, rowIndex) => {
        return row.flatMap((char, columnIndex) => {
            const position = [rowIndex, columnIndex] as Position;
            const positionString = position.join(",");

            if (visited.has(positionString)) {
                return [];
            } else {
                const region = getCurrentRegion({ map, position, char, visited });
                return [region];
            }
        });
    });

    const regionsWithSidesCounted = regions.map(region => {
        const sidePoints: SidePoint[] = region.points.flatMap(point => {
            const [x, y] = point;

            const allNeighbouringOffsets = [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1],
            ];

            const sidePoints = allNeighbouringOffsets.flatMap(([offX, offY]) => {
                const [xn, yn] = [x + offX, y + offY] as Position;

                const foundPoint = region.points.find(([xp, yp]) => {
                    return xn === xp && yn === yp;
                });

                if (!foundPoint) {
                    const direction = offX === 0 ? ("y" as const) : ("x" as const);
                    return [
                        {
                            position: [xn, yn] as Position,
                            offsetString: [offX, offY].join(","),
                            direction,
                        },
                    ];
                }

                return [];
            });

            return sidePoints;
        });

        const groupedByDirection = Object.groupBy(sidePoints, sidePoint => sidePoint.direction);

        const sum = Object.values(groupedByDirection).reduce((acc, sidePoints) => {
            const groupedInsideByCommonCoordinate = Object.groupBy(sidePoints, sidePoint => {
                return sidePoint.direction === "x" ? sidePoint.position[0] : sidePoint.position[1];
            });

            const values = Object.values(groupedInsideByCommonCoordinate);

            return (
                acc +
                values.reduce((acc, curr) => {
                    const groupedByOffset = Object.groupBy(
                        curr!,
                        sidePoint => sidePoint.offsetString,
                    );

                    const groupsScore = Object.values(groupedByOffset).map(offsetGroup => {
                        const currentPositions = offsetGroup!.map(p =>
                            p.direction === "x" ? p.position[1] : p.position[0],
                        );

                        const sortedPositions = currentPositions.toSorted((a, b) => a - b);

                        let groups = 1;

                        for (let i = 1; i < sortedPositions.length; i++) {
                            const current = sortedPositions[i];
                            const prev = sortedPositions[i - 1];
                            if (current - prev !== 1 || current - prev === 0) {
                                groups += 1;
                            }
                        }

                        return groups;
                    });

                    return acc + groupsScore.reduce((acc, curr) => acc + curr, 0);
                }, 0)
            );
        }, 0);

        return {
            ...region,
            sides: sum,
        } as const;
    });

    return regionsWithSidesCounted.reduce((acc, region) => {
        return acc + region.area * region.sides;
    }, 0);
};

export const parttwo = sp2(input.split("\n"));