// Optimized way if starting with a reset array
// O(n)
export function _optimizeToggle(size: number, input: string): Array<number> {
  const operations = input.split('\n');
  let faucets: Array<number> = new Array(size+2).fill(0);
  operations.forEach((op: string) => {
    const indices = op.split(/\s+/);
    faucets[+indices[0]] ^= 1;
    faucets[+indices[1]+1] ^= 1;
  });

  for (let i = 1; i <= size; i++) { 
    faucets[i] ^= faucets[i-1];
  }

  return faucets.slice(0, size);
}

// Not optimized but allows us to animate the steps as well as start
// from the an existing state
// O(n^2)
export function toggleFaucets(arr: Array<number>, input: string): Array<number> {
  const operations = input.split('\n');
  let faucets: Array<number> = Array.from(arr);
  operations.forEach((op: string) => {
    const indices = op.split(/\s+/);
    for (let i = +indices[0]; i <= +indices[1]; i++) { 
      faucets[i] ^= 1;
    }
  });

  return faucets;
}
