export async function load({ fetch }) {
  const longTailOfPi = await fetch('/pi-long-tail.txt') 
    .then((res) => res.text())
    .then((text) => text.split('').map(Number));

return { longTailOfPi };
}