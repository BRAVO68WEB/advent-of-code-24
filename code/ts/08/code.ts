const input = await Bun.file(`${import.meta.dir}/../../../input/8.txt`).text();

type Antenna = {
    x: number;
    y: number;
    type: string;
};

type Coordinate = {
    x: number;
    y: number;
};

const parseData = (rawData: string): string[][] => {
    return rawData.split("\n").map(row => row.split(""));
};

const getAntennas = (data: string[][]): Antenna[] => {
    const antennas: Antenna[] = [];
    data.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            if (cell !== ".") {
                antennas.push({ x: cellIndex, y: rowIndex, type: cell });
            }
        });
    });
    return antennas;
};

const inBounds = (x: number, y: number, data: string[][]): boolean => {
    return x >= 0 && x < data[0].length && y >= 0 && y < data.length;
};

const getPairAntiNodes = (
    a: Antenna,
    b: Antenna,
    data: string[][],
    isPartOne: boolean,
): Coordinate[] => {
    const diffX = a.x - b.x;
    const diffY = a.y - b.y;
    const result = [];

    let opt1 = { y: b.y - diffY, x: b.x - diffX };
    while (inBounds(opt1.x, opt1.y, data)) {
        result.push(opt1);
        if (isPartOne) {
            break;
        }
        opt1 = { y: opt1.y - diffY, x: opt1.x - diffX };
    }

    let opt2 = { y: a.y + diffY, x: a.x + diffX };

    while (inBounds(opt2.x, opt2.y, data)) {
        result.push(opt2);
        if (isPartOne) {
            break;
        }
        opt2 = { y: opt2.y + diffY, x: opt2.x + diffX };
    }

    return result;
};

const groupAntennas = (antennas: Antenna[]): Record<string, Antenna[]> => {
    return antennas.reduce((acc: Record<string, Antenna[]>, a) => {
        if (!acc[a.type]) {
            acc[a.type] = [];
        }
        acc[a.type].push(a);
        return acc;
    }, {});
};

const getAllAntiNodes = (
    groups: Record<string, Antenna[]>,
    data: string[][],
    isPartOne: boolean,
): Set<string> => {
    const antiNodes = new Set<string>();
    Object.keys(groups).forEach(key => {
        const antennas = [...groups[key]];
        while (antennas.length > 1) {
            const a = antennas.pop();
            if (a) {
                antennas.forEach(b =>
                    getPairAntiNodes(a, b, data, isPartOne).forEach(node => {
                        if (
                            data[node.y][node.x] === "." ||
                            data[node.y][node.x] === "#" ||
                            isPartOne
                        ) {
                            antiNodes.add(`${node.y}:${node.x}`);
                        }
                    }),
                );
            }
        }
    });

    return antiNodes;
};

const sp1 = (input: string) => {
    const data = parseData(input);
    const antennas = getAntennas(data);
    const groups = groupAntennas(antennas);
    const antiNodes = getAllAntiNodes(groups, data, true);
    const result = antiNodes.size;
    return result.toString();
};

const sp2 = (input: string) => {
    const data = parseData(input);
    const antennas = getAntennas(data);
    const groups = groupAntennas(antennas);
    const antiNodes = getAllAntiNodes(groups, data, false);
    const result = antiNodes.size + antennas.length;
    return result.toString();
};

export const partone = sp1(input);

export const parttwo = sp2(input);
