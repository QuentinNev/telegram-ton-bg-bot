const photos: string[] = [
    'https://tonbg.fra1.cdn.digitaloceanspaces.com/periodic/1.webp',
    'https://tonbg.fra1.cdn.digitaloceanspaces.com/periodic/2.webp',
    'https://tonbg.fra1.cdn.digitaloceanspaces.com/periodic/3.webp'
]

export default function getRandomPhoto() {
    return photos[Math.floor(Math.random() * photos.length)];
}