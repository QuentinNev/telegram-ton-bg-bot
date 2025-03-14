const photos: string[] = [
    'https://tonbg.fra1.cdn.digitaloceanspaces.com/periodic/1.webp',
    'https://tonbg.fra1.cdn.digitaloceanspaces.com/periodic/2.webp',
    'https://tonbg.fra1.cdn.digitaloceanspaces.com/periodic/3.webp'
]

let last = -1;

export default function getRandomPhoto() {
    let index = Math.floor(Math.random() * photos.length);
    while (last === index) { index = Math.floor(Math.random() * photos.length); }
    last = index;
    console.log(`Sending image n°${index}`);
    return photos[index];
}