/// <reference types="node" />
import * as child_process from 'child_process';
/**
 *
 * @param wit_output_dir output for wit
 */
export declare function compressSchema(wit_output_dir: string): Promise<string>;
export declare function compress(data: object): Uint8Array;
export declare const exec: typeof child_process.exec.__promisify__;
export declare function cargo(args: string[]): Promise<{
    stdout: string;
    stderr: string;
}>;
export declare function spawn(args: string[], cwd?: string): Promise<void>;
export interface WorkspaceMember {
    name: string;
    version: string;
    libPath: string;
    binPath: string;
}
export interface Config {
    release: boolean;
}
export declare function wasmBinName(name: string): string;
export declare class CargoMetadata {
    private data;
    private config;
    constructor(data: any, config: Config);
    get workspace_members(): WorkspaceMember[];
    static fetch(config: Config): Promise<CargoMetadata>;
    ensure_output_dirs(): Promise<void>;
    static fromString(s: string, config: Config): CargoMetadata;
    get target_directory(): string;
    get bin_output_dir(): string;
    get wit_output_dir(): string;
}
export declare function build_cmd(args: {
    release: boolean;
    feature: string[];
    package?: string;
}): string[];
export declare function mkdir(s: string): Promise<void>;
