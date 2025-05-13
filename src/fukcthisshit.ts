import { getRandomNumber } from './bot/utils/getRandomPhoto'

const numbers = [0, 0, 0];
for (let i = 0; i < 1000000; i++) {
    const rng = getRandomNumber(3);
    numbers[rng]++;
}

console.log(`0: `, numbers[0]);
console.log(`1: `, numbers[1]);
console.log(`2: `, numbers[2]);