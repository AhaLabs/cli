#!/usr/bin/env node

import yargs from 'yargs';
import * as fs from 'fs/promises';
import * as path from 'path';
import { getBinary } from 'witme/dist/getBinary';
import { build_cmd, CargoMetadata, compressSchema, mkdir, spawn, wasmBinName } from './util';

try {
  // eslint-disable-next-line no-var
  yargs.scriptName('aha').command(
    'build',
    'Build contracts',
    (y) => {
      y.option('package', {
        describe: 'Name of package in current workspace',
        type: 'string',
      })
        .option('feature', {
          describe: 'feature to pass to cargo',
          type: 'array',
          default: [],
        })
        .option('release', {
          describe: 'Build release build. Default is debug',
          default: false,
          type: 'boolean',
        })
        .option('sdk', {
          describe: 'Include wit types from near-sdk-rs',
          default: false,
          type: 'boolean',
        })
        .option('standards', {
          describe: 'Include wit types from near-contract-standards',
          default: false,
          type: 'boolean',
        });
    },
    async (argv) => {
      const metadata = await CargoMetadata.fetch({ release: argv.release as boolean });
      await metadata.ensure_output_dirs();
      const cmd = build_cmd(argv as any);
      const now = Date.now();
      const members = metadata.workspace_members;
      const binary = await getBinary();
      const witme = binary.binPath;

      try {
        await spawn(cmd);
      } catch (e) {
        console.error(e);
        return;
      }
      const bin_dir = metadata.bin_output_dir;
      const wit_dir = metadata.wit_output_dir;
      for (const { binPath, libPath, name } of members) {
        const stat = await fs.stat(binPath);
        if (stat.mtimeMs - now != 0) {
          const dir = path.join(wit_dir, name.replaceAll('-', '_'));
          await mkdir(dir);
          const args = [
            witme,
            'near',
            'wit',
            '-t',
            dir,
            '-o',
            `${dir}/index.wit`,
            '-i',
            `${libPath}/src/lib.rs`,
            `--sdk`,
          ];
          if (argv.standards) {
            args.push('--standards');
          }
          await spawn(args);
          const json_args = [witme, 'near', 'json', '-o', dir, '-i', `${dir}/index.ts`];
          await spawn(json_args);
          const min_file = await compressSchema(dir);
          await spawn([
            witme,
            'near',
            'inject',
            '--name',
            'json',
            '--file',
            min_file,
            '--input',
            binPath,
            '--output',
            `${bin_dir}/${wasmBinName(name)}`,
          ]);
        }
      }
    },
  ).argv;
} catch (e) {
  console.error(e);
  process.exit(1);
}
