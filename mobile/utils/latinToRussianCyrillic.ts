const MULTI_CHAR_MAP_NEW: Array<[string, string]> = [
    ['ыo', 'ё'],
    ['зh', 'ж'],
    ['тs', 'ц'],
    ['цh', 'ч'],
    ['сh', 'ш'],
    ['ыu', 'ю'],
    ['ыa', 'я'],
    ['ьq', 'ъ'],
];

const SINGLE_CHAR_MAP: { [key: string]: string | undefined } = {
    a: 'а', b: 'б', v: 'в', g: 'г', d: 'д', e: 'е',
    z: 'з', i: 'и', j: 'й', k: 'к', l: 'л', m: 'м',
    n: 'н', o: 'о', p: 'п', r: 'р', s: 'с', t: 'т',
    u: 'у', f: 'ф', h: 'х', x: 'х', y: 'ы', w: 'щ',
    q: 'ь', c: 'ц',
};

interface LatinToCyrillicResponse {
    change: boolean;
    newValue: string;
}

export function latinToCyrillic(lastCharacter: string, nextCharacter: string): LatinToCyrillicResponse {
    let conv = '';
    let changeRequired = false;
    const candidate = lastCharacter + nextCharacter;
    const lower = candidate.toLowerCase();

    const multiMatch = MULTI_CHAR_MAP_NEW.find(([lat]) => lat === lower);
    if (multiMatch) {
        const isUpper = candidate[0] !== candidate[0].toLowerCase();
        const cyr = multiMatch[1];
        conv = isUpper ? cyr[0].toUpperCase() + cyr.slice(1) : cyr;
        changeRequired = true;
    } else {
        const isPrefix = MULTI_CHAR_MAP_NEW.some(([lat]) => lat.startsWith(lower) && lat.length > lower.length);
        if (isPrefix) {
            conv = '';
        } else {
            const cyr = SINGLE_CHAR_MAP[nextCharacter.toLowerCase()];
            if (cyr === undefined) {
                conv = nextCharacter;
            } else if (/[A-Z]/.test(nextCharacter)) {
                conv = cyr[0].toUpperCase() + cyr.slice(1);
            } else {
                conv = cyr;
            }
        }
    }
    return { change: changeRequired, newValue: conv };
}
