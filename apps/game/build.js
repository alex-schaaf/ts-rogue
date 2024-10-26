import { build as _build } from 'esbuild';
import { resolve } from 'path';

_build({
    entryPoints: ['src/index.ts'], // Adjust the entry point as needed
    bundle: true,
    outdir: 'dist',
    platform: 'browser', // or 'browser' depending on your target
    tsconfig: 'tsconfig.json',
    plugins: [
        {
            name: 'alias',
            setup(build) {
                build.onResolve({ filter: /^@lib\// }, args => ({
                    path: resolve(__dirname, 'src/lib', args.path.slice(5))
                }));
                build.onResolve({ filter: /^@game\// }, args => ({
                    path: resolve(__dirname, 'src/game', args.path.slice(6))
                }));
                build.onResolve({ filter: /^@components\// }, args => ({
                    path: resolve(__dirname, 'src/ecs/components', args.path.slice(12))
                }));
                build.onResolve({ filter: /^@systems\// }, args => ({
                    path: resolve(__dirname, 'src/ecs/systems', args.path.slice(9))
                }));
                build.onResolve({ filter: /^@events\// }, args => ({
                    path: resolve(__dirname, 'src/ecs/events', args.path.slice(8))
                }));
            }
        }
    ]
}).catch(() => process.exit(1));
