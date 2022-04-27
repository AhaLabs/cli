#!/usr/bin/env node

import yargs from 'yargs';
import * as child_process from 'child_process';
import { promisify } from 'util';
import * as fs from "fs/promises";
import * as path from "path";
import { getBinary } from "witme/dist/getBinary";
import { uploadDirectory, uploadFile, uploadJSON } from './pinata';
import { packToFs } from 'ipfs-car/pack/fs';
import { CID } from '@ipld/car/indexer';

const exec = promisify(child_process.exec);

function cargo(args: string[]): Promise<{ stdout: string, stderr: string }> {
  return exec(args.join(" "));
}

async function spawn(args: string[], cwd?: string): Promise<void> {
  let child = child_process.spawn(args[0], args.slice(1), { cwd, stdio: ['inherit', 'inherit', 'inherit'] });
  return await new Promise((resolve, reject) => {
    child.on('exit', (code) => code == 0 ? resolve() : reject())
  })
}

interface Workspace {
  name: string,
  version: string,
  libPath: string,
  binPath: string,
}

interface Config {
  release: boolean,
}

function wasmBinName(name: string): string {
  return `${name.replaceAll("-", "_")}.wasm`;
}
class CargoMetadata {
  constructor(private data: any, private config: Config) { }

  get workspace_members(): Workspace[] {
    return this.data.workspace_members.map((m: string) => {
      let [name, version, libPath] = m.split(' ');
      libPath = libPath.split("file://")[1];
      libPath = libPath.slice(0, libPath.length - 1);
      const binPath = path.join(this.target_directory, "wasm32-unknown-unknown", this.config.release ? "debug" : "release", wasmBinName(name));
      return { name, version, libPath, binPath }
    });

  }

  static async fetch(config: Config): Promise<CargoMetadata> {
    return this.fromString((await cargo(["cargo", "metadata"])).stdout, config)
  }

  static fromString(s: string, config: Config): CargoMetadata {
    return new CargoMetadata(JSON.parse(s), config);
  }

  get target_directory(): string {
    return this.data.target_directory;
  }

}


function build_cmd(args: { release: boolean, feature: string[], package?: string }): string[] {
  let cmd = ["cargo", "build", "--target", "wasm32-unknown-unknown"];
  if (args.release) {
    cmd.push("--release");
  }
  if (args.package) {
    cmd.push("--package", args.package);
  } else {
    cmd.push("--all");
  }
  for (let feature of args.feature) {
    cmd.push("--feature", feature)
  }
  return cmd;
}

try {
// eslint-disable-next-line no-var
yargs
  .scriptName('aha')
  .command(
    'build',
    'Build contracts',
    (y) => {
      y.option('package', {
        describe: 'Name of package in current workspace',
        type: 'string',
      }).option('feature', {
        describe: "feature to pass to cargo",
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
      let cmd = build_cmd(argv as any);
      const now = Date.now();
      let members = metadata.workspace_members;
      let binary = await getBinary();

      try {
        await spawn(cmd);
      } catch (e) {
        console.log(e)
      }
      for (let { binPath, libPath, name } of members) {
        let stat = await fs.stat(binPath);
        if (stat.mtimeMs - now != 0) {
          await mkdir("./res")
          let args = [binary.binPath, "near", "wit", "-t", "./wit", "-o", "wit/index.wit"];
          if (argv.sdk) {
            args.push("--sdk");
          }
          if (argv.standards) {
            args.push("--standards");
          }
          await spawn(args, libPath);
          await spawn([binary.binPath, "near", "json", "-o", "wit"], libPath);
          let json = require(path.join(libPath, "wit", "index.schema.json"))
          let ipfsHash = await uploadJSON(json)
          let data = makeLinks(ipfsHash);
          console.log("uploaded: ", data);
          await spawn([binary.binPath, "near", "inject", "--name", "json", "--data", data, "--input", binPath, "--output", `./res/${wasmBinName(name)}`]);
        }
      }
    },
  ).argv;
} catch (e) {
  console.error(e);
  process.exit(1);
}

async function mkdir(s: string): Promise<void> {
  try {
    await fs.mkdir(s)
  } catch (e) {
    console.error(e)
  }
}

async function packCar(p: string): Promise<{ root: CID, filename: string }> {
  return await packToFs({ input: path.join(p, "wit"), output: path.join(p, "wit.car"), wrapWithDirectory: false });
  
}

function makeLinks(s: string): string {
  return `https://${s}.ipfs.dweb.link/index.schema.json;`;
}


