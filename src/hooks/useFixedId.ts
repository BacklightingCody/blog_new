import hash from 'hash-sum';

export function useFixedId(input: string) {
  return hash(input);
}
