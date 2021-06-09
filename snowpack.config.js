// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    extends: "@snowpack/app-scripts-svelte",
    mount: {
        public: {url: "/", static: true},
        src: "/_dist_",
    },
    plugins: [
        [
            "@snowpack/plugin-build-script",
            {cmd: "postcss", input: [".css"], output: [".css"]},
        ],
        "@snowpack/plugin-typescript",
        [
            '@snowpack/plugin-run-script',
            {
                cmd: 'echo test',
                watch: 'cargo watch -i .gitignore -i "pkg/*" -s "wasm-pack build --target web --out-dir ../src/pkg --out-name index" -C ./wasm',
            },
        ],
    ],
    packageOptions: {
        installTypes: true,
        polyfillNode: true,
    },
    devOptions: {
        port: 5000,
    },
    buildOptions: {
        clean: true,
    },
    optimize: {
        bundle: true,
        minify: true,
        treeshake: true,
        target: "es2020",
    },
};
