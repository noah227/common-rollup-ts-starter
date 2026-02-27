import {nodeResolve} from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
import terser from "@rollup/plugin-terser"
import json from "@rollup/plugin-json"


/**
 * @param input {String}
 * @param output {Object}
 * @param plugins {{useTerser?: Boolean}?}
 */
const createExport = (input, output, plugins) => ({
    input, output,
    plugins: [
        nodeResolve(),
        typescript({
            compilerOptions: {
                sourceMap: output.sourcemap,
            },
            sourceMap: output.sourcemap,
        }),
        commonjs(),
        plugins?.useTerser && terser(),
        json()
    ]
})

/**
 *
 * @param {{input: string, output: string, target: "esm" | "cjs", useTerser?: boolean}[]} buildConfigList
 */
const createBuild = (buildConfigList) => {
    return buildConfigList.reduce((buildList, {input, output, target, useTerser}) => {
        buildList.push([
            input, {
                file: output,
                format: target
            }, {
                useTerser
            }
        ])
        return buildList
    }, []).map(item => createExport(...item))
}

export default createBuild([
    {input: "./src/index.ts", output: "./dist/index.js", target: "esm"},
    {input: "./src/index.ts", output: "./dist/index.min.js", target: "esm", useTerser: true},
    // {input: "./src/index.ts", output: "./dist/index.cjs.js", target: "cjs"}
])
