const photos: string[] = [
    'https://tonbg.fra1.cdn.digitaloceanspaces.com/periodic/1.webp',
    'https://tonbg.fra1.cdn.digitaloceanspaces.com/periodic/2.webp',
    'https://tonbg.fra1.cdn.digitaloceanspaces.com/periodic/3.webp'
]

let last = -1;

export default function getRandomPhoto() {
    let index = getRandomNumber(photos.length);
    while (last === index) { index = getRandomNumber(photos.length); }
    last = index;
    return photos[index];
}

export function getRandomNumber(max: number) {
    return Math.floor(Math.random() * max);
}