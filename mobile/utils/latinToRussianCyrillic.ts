const MULTI_CHAR_MAP: Array<[string, string]> = [
    ['shh', 'щ'],
    ['yo', 'ё'],
    ['zh', 'ж'],
    ['ts', 'ц'],
    ['ch', 'ч'],
    ['sh', 'ш'],
    ['yu', 'ю'],
    ['ya', 'я'],
    ['qq', 'ъ'],
];

const SINGLE_CHAR_MAP: Record<string, string> = {
    a: 'а', b: 'б', v: 'в', g: 'г', d: 'д', e: 'е',
    z: 'з', i: 'и', j: 'й', k: 'к', l: 'л', m: 'м',
    n: 'н', o: 'о', p: 'п', r: 'р', s: 'с', t: 'т',
    u: 'у', f: 'ф', h: 'х', y: 'ы', x: 'кс', w: 'щ',
    q: 'ь',
};

export function latinToRussianCyrillic(input: string): string {
    let result = '';
    let i = 0;
    while (i < input.length) {
        const lower = input.slice(i).toLowerCase();
        let matched = false;
        for (const [lat, cyr] of MULTI_CHAR_MAP) {
            if (lower.startsWith(lat)) {
                const isUpper = /[A-Z]/.test(input[i]);
                result += isUpper ? cyr[0].toUpperCase() + cyr.slice(1) : cyr;
                i += lat.length;
                matched = true;
                break;
            }
        }
        if (!matched) {
            const cyr = SINGLE_CHAR_MAP[input[i].toLowerCase()];
            if (cyr !== undefined) {
                const isUpper = /[A-Z]/.test(input[i]);
                result += isUpper ? cyr[0].toUpperCase() + cyr.slice(1) : cyr;
            } else {
                result += input[i];
            }
            i++;
        }
    }
    return result;
}
