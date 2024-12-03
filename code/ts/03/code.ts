const input = await Bun.file(`${import.meta.dir}/../../../input/3.txt`).text();

const lines = input.split("\n");

const sp1 = (lines: string[]) => {
    let sum = 0;
    const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;
    
    for (const line of lines) {
        const matches = line.matchAll(regex);
        for (const match of matches) {
            const [_, num1, num2] = match;
            sum += parseInt(num1) * parseInt(num2);
        }
    }
    
    return sum;
};

export const partone = sp1(lines);

const sp2 = (lines: string[]) => {
    const fullText = lines.join('\n');
    const processedText = fullText.replace(/don't\(\)[\s\S]*?(do\(\)|$)/g, '');
    
    const regex = /mul\((\d+),(\d+)\)/g;
    let sum = 0;
    
    const matches = processedText.matchAll(regex);
    for (const match of matches) {
        const [_, num1, num2] = match;
        sum += parseInt(num1) * parseInt(num2);
    }
    
    return sum;
};

export const parttwo = sp2(lines);
