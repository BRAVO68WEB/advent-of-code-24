const input = await Bun.file(`${import.meta.dir}/../../../input/13.txt`).text();

type Section = {
    A: [bigint, bigint];
    B: [bigint, bigint];
    R: [bigint, bigint];
  };
  
const buttonLineRegex = /Button\s(?<name>\w):\sX\+(?<x>\d+),\sY\+(?<y>\d+)/gm;
const prizeLineRegex = /Prize: X=(?<x>\d+), Y=(?<y>\d+)/gm;

export const getParsedSections = (input: string[], bonus = 0n) => {
    const parsedInput = input.reduce((acc, curr) => {
      if (curr === "") {
        acc.sections.push(acc.currentSection);
        acc.currentSection = {} as Section;
      } else {
        const buttonLineMatch = [...curr.trim().matchAll(buttonLineRegex)][0];
  
        if (buttonLineMatch) {
          const buttonLineMatchGroups = buttonLineMatch.groups!;
          acc.currentSection[buttonLineMatchGroups.name as keyof Section] = [
            BigInt(buttonLineMatchGroups.x),
            BigInt(buttonLineMatchGroups.y),
          ];
        } else {
          const prizeLineMatch = [...curr.trim().matchAll(prizeLineRegex)][0];
          if (prizeLineMatch) {
            const prizeLineMatchGroups = prizeLineMatch.groups!;
            acc.currentSection.R = [
              BigInt(prizeLineMatchGroups.x) + bonus,
              BigInt(prizeLineMatchGroups.y) + bonus,
            ];
          }
        }
      }
  
      return acc;
    }, {
      sections: [] as Section[],
      currentSection: {} as Section,
    });
  
    parsedInput.sections.push(parsedInput.currentSection);
  
    return parsedInput.sections;
  };
  
  const getResult = (sections: Section[]) => {
    return sections.reduce((acc, section) => {
      const detA = section.A[0] * section.B[1] - section.A[1] * section.B[0];
      if (detA === 0n) {
        return acc;
      }
  
      const detB1 = section.R[0] * section.B[1] - section.B[0] * section.R[1];
      const detB2 = section.A[0] * section.R[1] - section.A[1] * section.R[0];
  
      const ATimes = detB1 / detA;
      const ACheck = ATimes * detA;
  
      const BTimes = detB2 / detA;
      const BCheck = BTimes * detA;
  
      if (detB2 !== BCheck || ACheck !== detB1) {
        return acc;
      }
  
      const result = 3n * ATimes + BTimes;
  
      return acc + result;
    }, 0n);
};

export const partone = getResult(getParsedSections(input.split("\n")));

export const parttwo = getResult(getParsedSections(input.split("\n"), 10_000_000_000_000n));