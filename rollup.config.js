import buble from 'rollup-plugin-buble'
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    entry: 'src/index.js',
    plugins: [	nodeResolve({
        jsnext: true,
        main: true,
    }),
        buble({
            transforms:
            {
                dangerousForOf: true
            }

        })],
    targets: [
        {
            format: 'cjs',
            dest: 'dist/rollup-plugin-karma.js'
        }
    ]
}