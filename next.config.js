/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/@:coordinates*',
                destination: '/[...coordinates]/@:coordinates*',
            },
        ]
    },
}

module.exports = nextConfig 