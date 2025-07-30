import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default [
    {
        input: './src/index.ts',
        output: [
            {
                file: 'dist/index.js',
                format: 'cjs',
                sourcemap: false,
            },
            {
                file: 'dist/index.es.js',
                format: 'es',
                exports: 'named',
                sourcemap: false,
            },
        ],
        plugins: [
            external(),
            resolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json',
                declaration: true,
                declarationDir: 'types',
                rootDir: 'src',
                sourceMap: false,
            }),
            babel({
                babelHelpers: 'bundled',
                exclude: 'node_modules/**',
                presets: [['@babel/preset-react', { runtime: 'classic' }]],
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            }),
            terser(),
        ],
    },
];
