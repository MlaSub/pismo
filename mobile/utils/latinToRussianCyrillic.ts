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

const SINGLE_CHAR_MAP: Record<string, string> = {
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
        const isUpper = /[A-Z]/.test(candidate[0]);
        const cyr = multiMatch[1];
        conv = isUpper ? cyr[0].toUpperCase() + cyr.slice(1) : cyr;
        changeRequired = true;
    } else {
        const isPrefix = MULTI_CHAR_MAP_NEW.some(([lat]) => lat.startsWith(lower) && lat.length > lower.length);
        if (isPrefix) {
            conv = '';
        } else {
            const cyr = SINGLE_CHAR_MAP[nextCharacter.toLowerCase()];
            conv = cyr !== undefined
                ? /[A-Z]/.test(nextCharacter) ? cyr[0].toUpperCase() + cyr.slice(1) : cyr
                : nextCharacter;
        }
    }
    return { change: changeRequired, newValue: conv };
}
