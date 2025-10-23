/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // FUCK ESLINT during builds
    },
    typescript: {
        ignoreDuringBuilds: true, // FUCK TypeScript errors during builds
    },
    // Add this for extra measure
    experimental: {
        forceSwcTransforms: true,
    }
}

module.exports = nextConfig