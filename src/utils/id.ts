import hash from 'hash-sum';

export function getFixedId(input: string) {
    return hash(input);
}
