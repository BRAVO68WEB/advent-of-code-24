const input = await Bun.file(`${import.meta.dir}/../../../input/1.txt`).text();

const lines = input.split("\n");

const sp1 = (lines: string[]) => {
    return 0;
}

export const partone = sp1(lines);

const sp2 = (lines: string[]) => {
    return 0;
}

export const parttwo = sp2(lines);
