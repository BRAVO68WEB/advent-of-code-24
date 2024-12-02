const input = await Bun.file(`${import.meta.dir}/../../../input/2.txt`).text();

const lines = input.split("\n");

const sp1 = (lines: string[]) => {
    return lines.filter(line => {
        if (!line) return false;
        
        const numbers = line.split(' ').map(Number);
        
        // Check if sequence is monotonic (all increasing or all decreasing)
        let increasing: boolean | null = null;
        
        for (let i = 1; i < numbers.length; i++) {
            const diff = numbers[i] - numbers[i-1];
            
            // Check if difference is between 1 and 3
            if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
                return false;
            }
            
            // First difference determines if sequence should be increasing or decreasing
            if (increasing === null) {
                increasing = diff > 0;
            }
            // Check if current difference maintains the same direction
            else if ((diff > 0) !== increasing) {
                return false;
            }
        }
        
        return true;
    }).length;
};

export const partone = sp1(lines);

const isValidSequence = (numbers: number[]) => {
    let increasing: boolean | null = null;
    
    for (let i = 1; i < numbers.length; i++) {
        const diff = numbers[i] - numbers[i-1];
        if (Math.abs(diff) < 1 || Math.abs(diff) > 3) return false;
        
        if (increasing === null) {
            increasing = diff > 0;
        } else if ((diff > 0) !== increasing) {
            return false;
        }
    }
    return true;
};

const sp2 = (lines: string[]) => {
    return lines.filter(line => {
        if (!line) return false;
        
        const numbers = line.split(' ').map(Number);
        
        // Check if sequence is already valid without removing any number
        if (isValidSequence(numbers)) return true;
        
        // Try removing each number one at a time
        for (let i = 0; i < numbers.length; i++) {
            const newSequence = [...numbers.slice(0, i), ...numbers.slice(i + 1)];
            if (isValidSequence(newSequence)) return true;
        }
        
        return false;
    }).length;
};


export const parttwo = sp2(lines);
