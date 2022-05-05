import * as child_process from 'child_process';
import * as path from 'path';
import * as fs from 'fs/promises';
import { promisify } from 'util';

import * as brotli from 'brotli';

/**
 *
 * @param wit_output_dir output for wit
 */
export async function compressSchema(wit_output_dir: string): Promise<string> {
  const json = JSON.parse(
    await fs.readFile(path.join(wit_output_dir, 'index.schema.json'), 'utf8'),
  );
  const json_data = compress(json);
  const min_file = path.join(wit_output_dir, 'index.schema.json.br');
  await fs.writeFile(min_file, json_data);
  return min_file;
}

export function compress(data: object): Uint8Array {
  const str = JSON.stringify(data);
  debugger;
  return brotli.compress(Buffer.from(str, 'utf-8'));
}

export const exec = promisify(child_process.exec);

export function cargo(args: string[]): Promise<{ stdout: string; stderr: string }> {
  return exec(args.join(' '));
}

export async function spawn(args: string[], cwd?: string): Promise<void> {
  const child = child_process.spawn(args[0], args.slice(1), {
    cwd,
    stdio: ['inherit', 'inherit', 'inherit'],
  });
  return await new Promise((resolve, reject) => {
    child.on('exit', (code) => (code == 0 ? resolve() : reject()));
  });
}

export interface WorkspaceMember {
  name: string;
  version: string;
  libPath: string;
  binPath: string;
}

export interface Config {
  release: boolean;
}

export function wasmBinName(name: string): string {
  return `${name.replaceAll('-', '_')}.wasm`;
}

export class CargoMetadata {
  constructor(private data: any, private config: Config) {}

  get workspace_members(): WorkspaceMember[] {
    return this.data.workspace_members.map((m: string) => {
      const [name, version, path_str] = m.split(' ');
      let libPath = path_str.replace('(path+file://', '');
      libPath = libPath.slice(0, libPath.length - 1);
      const binPath = path.join(
        this.target_directory,
        'wasm32-unknown-unknown',
        this.config.release ? 'debug' : 'release',
        wasmBinName(name),
      );
      return { name, version, libPath, binPath };
    });
  }

  static async fetch(config: Config): Promise<CargoMetadata> {
    return this.fromString((await cargo(['cargo', 'metadata'])).stdout, config);
  }

  async ensure_output_dirs(): Promise<void> {
    await mkdir(this.bin_output_dir);
    await mkdir(this.wit_output_dir);
  }

  static fromString(s: string, config: Config): CargoMetadata {
    return new CargoMetadata(JSON.parse(s), config);
  }

  get target_directory(): string {
    return this.data.target_directory;
  }

  get bin_output_dir(): string {
    return path.join(this.target_directory, 'res');
  }

  get wit_output_dir(): string {
    return path.join(this.target_directory, 'wit');
  }
}

export function build_cmd(args: {
  release: boolean;
  feature: string[];
  package?: string;
}): string[] {
  const cmd = ['cargo', 'build', '--target', 'wasm32-unknown-unknown'];
  if (args.release) {
    cmd.push('--release');
  }
  if (args.package) {
    cmd.push('--package', args.package);
  } else {
    cmd.push('--all');
  }
  for (const feature of args.feature) {
    cmd.push('--feature', feature);
  }
  return cmd;
}

export async function mkdir(s: string): Promise<void> {
  try {
    await fs.mkdir(s);
  } catch (e: any) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
}
