#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_1 = __importDefault(require("yargs"));
var child_process = __importStar(require("child_process"));
var util_1 = require("util");
var fs = __importStar(require("fs/promises"));
var path = __importStar(require("path"));
var getBinary_1 = require("witme/dist/getBinary");
var pinata_1 = require("./pinata");
// import { packToFs } from 'ipfs-car/pack/fs';
// import { CID } from '@ipld/car/indexer';
var exec = (0, util_1.promisify)(child_process.exec);
function cargo(args) {
    return exec(args.join(' '));
}
function spawn(args, cwd) {
    return __awaiter(this, void 0, void 0, function () {
        var child;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    child = child_process.spawn(args[0], args.slice(1), {
                        cwd: cwd,
                        stdio: ['inherit', 'inherit', 'inherit'],
                    });
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            child.on('exit', function (code) { return (code == 0 ? resolve() : reject()); });
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function wasmBinName(name) {
    return "".concat(name.replaceAll('-', '_'), ".wasm");
}
var CargoMetadata = /** @class */ (function () {
    function CargoMetadata(data, config) {
        this.data = data;
        this.config = config;
    }
    Object.defineProperty(CargoMetadata.prototype, "workspace_members", {
        get: function () {
            var _this = this;
            return this.data.workspace_members.map(function (m) {
                var _a = m.split(' '), name = _a[0], version = _a[1], path_str = _a[2];
                var libPath = path_str.replace('(path+file://', '');
                libPath = libPath.slice(0, libPath.length - 1);
                var binPath = path.join(_this.target_directory, 'wasm32-unknown-unknown', _this.config.release ? 'debug' : 'release', wasmBinName(name));
                return { name: name, version: version, libPath: libPath, binPath: binPath };
            });
        },
        enumerable: false,
        configurable: true
    });
    CargoMetadata.fetch = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.fromString;
                        return [4 /*yield*/, cargo(['cargo', 'metadata'])];
                    case 1: return [2 /*return*/, _a.apply(this, [(_b.sent()).stdout, config])];
                }
            });
        });
    };
    CargoMetadata.fromString = function (s, config) {
        return new CargoMetadata(JSON.parse(s), config);
    };
    Object.defineProperty(CargoMetadata.prototype, "target_directory", {
        get: function () {
            return this.data.target_directory;
        },
        enumerable: false,
        configurable: true
    });
    return CargoMetadata;
}());
function build_cmd(args) {
    var cmd = ['cargo', 'build', '--target', 'wasm32-unknown-unknown'];
    if (args.release) {
        cmd.push('--release');
    }
    if (args.package) {
        cmd.push('--package', args.package);
    }
    else {
        cmd.push('--all');
    }
    for (var _i = 0, _a = args.feature; _i < _a.length; _i++) {
        var feature = _a[_i];
        cmd.push('--feature', feature);
    }
    return cmd;
}
try {
    // eslint-disable-next-line no-var
    yargs_1.default.scriptName('aha').command('build', 'Build contracts', function (y) {
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
    }, function (argv) { return __awaiter(void 0, void 0, void 0, function () {
        var metadata, cmd, now, members, binary, witme, e_1, bin_dir, wit_dir, _i, members_1, _a, binPath, libPath, name, stat, dir, args, json, _b, _c, ipfsHash, data;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, CargoMetadata.fetch({ release: argv.release })];
                case 1:
                    metadata = _d.sent();
                    cmd = build_cmd(argv);
                    now = Date.now();
                    members = metadata.workspace_members;
                    return [4 /*yield*/, (0, getBinary_1.getBinary)()];
                case 2:
                    binary = _d.sent();
                    witme = binary.binPath;
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, spawn(cmd)];
                case 4:
                    _d.sent();
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _d.sent();
                    console.error(e_1);
                    return [2 /*return*/];
                case 6:
                    bin_dir = path.join(metadata.target_directory, 'res');
                    wit_dir = path.join(metadata.target_directory, 'wit');
                    return [4 /*yield*/, mkdir(bin_dir)];
                case 7:
                    _d.sent();
                    return [4 /*yield*/, mkdir(wit_dir)];
                case 8:
                    _d.sent();
                    _i = 0, members_1 = members;
                    _d.label = 9;
                case 9:
                    if (!(_i < members_1.length)) return [3 /*break*/, 18];
                    _a = members_1[_i], binPath = _a.binPath, libPath = _a.libPath, name = _a.name;
                    return [4 /*yield*/, fs.stat(binPath)];
                case 10:
                    stat = _d.sent();
                    if (!(stat.mtimeMs - now != 0)) return [3 /*break*/, 17];
                    dir = path.join(wit_dir, name.replaceAll('-', '_'));
                    return [4 /*yield*/, mkdir(dir)];
                case 11:
                    _d.sent();
                    args = [witme, 'near', 'wit', '-t', dir, '-o', "".concat(dir, "/index.wit")];
                    if (argv.sdk) {
                        console.log('adding sdk');
                        args.push('--sdk');
                    }
                    if (argv.standards) {
                        args.push('--standards');
                    }
                    return [4 /*yield*/, spawn(args, libPath)];
                case 12:
                    _d.sent();
                    return [4 /*yield*/, spawn([witme, 'near', 'json', '-o', dir, '-i', "".concat(dir, "/index.ts")], libPath)];
                case 13:
                    _d.sent();
                    _c = (_b = JSON).parse;
                    return [4 /*yield*/, fs.readFile(path.join(dir, 'index.schema.json'), 'utf8')];
                case 14:
                    json = _c.apply(_b, [_d.sent()]);
                    return [4 /*yield*/, (0, pinata_1.uploadJSON)(json)];
                case 15:
                    ipfsHash = _d.sent();
                    data = makeLinks(ipfsHash);
                    console.log('uploaded: ', data);
                    return [4 /*yield*/, spawn([
                            witme,
                            'near',
                            'inject',
                            '--name',
                            'json',
                            '--data',
                            data,
                            '--input',
                            binPath,
                            '--output',
                            "".concat(bin_dir, "/").concat(wasmBinName(name)),
                        ])];
                case 16:
                    _d.sent();
                    _d.label = 17;
                case 17:
                    _i++;
                    return [3 /*break*/, 9];
                case 18: return [2 /*return*/];
            }
        });
    }); }).argv;
}
catch (e) {
    console.error(e);
    process.exit(1);
}
function mkdir(s) {
    return __awaiter(this, void 0, void 0, function () {
        var e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.mkdir(s)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_2 = _a.sent();
                    if (e_2.code !== 'EEXIST') {
                        throw e_2;
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// async function packCar(p: string): Promise<{ root: CID; filename: string }> {
//   return await packToFs({
//     input: path.join(p, 'wit'),
//     output: path.join(p, 'wit.car'),
//     wrapWithDirectory: false,
//   });
// }
function makeLinks(s) {
    return "https://".concat(s, ".ipfs.dweb.link");
}
