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
var fs = __importStar(require("fs/promises"));
var path = __importStar(require("path"));
var getBinary_1 = require("witme/dist/getBinary");
var util_1 = require("./util");
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
        var metadata, cmd, now, members, binary, witme, e_1, bin_dir, wit_dir, _i, members_1, _a, binPath, libPath, name, stat, dir, args, json_args, min_file;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, util_1.CargoMetadata.fetch({ release: argv.release })];
                case 1:
                    metadata = _b.sent();
                    return [4 /*yield*/, metadata.ensure_output_dirs()];
                case 2:
                    _b.sent();
                    cmd = (0, util_1.build_cmd)(argv);
                    now = Date.now();
                    members = metadata.workspace_members;
                    return [4 /*yield*/, (0, getBinary_1.getBinary)()];
                case 3:
                    binary = _b.sent();
                    witme = binary.binPath;
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, (0, util_1.spawn)(cmd)];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _b.sent();
                    console.error(e_1);
                    return [2 /*return*/];
                case 7:
                    bin_dir = metadata.bin_output_dir;
                    wit_dir = metadata.wit_output_dir;
                    _i = 0, members_1 = members;
                    _b.label = 8;
                case 8:
                    if (!(_i < members_1.length)) return [3 /*break*/, 16];
                    _a = members_1[_i], binPath = _a.binPath, libPath = _a.libPath, name = _a.name;
                    return [4 /*yield*/, fs.stat(binPath)];
                case 9:
                    stat = _b.sent();
                    if (!(stat.mtimeMs - now != 0)) return [3 /*break*/, 15];
                    dir = path.join(wit_dir, name.replaceAll('-', '_'));
                    return [4 /*yield*/, (0, util_1.mkdir)(dir)];
                case 10:
                    _b.sent();
                    args = [witme, 'near', 'wit', '-t', dir, '-o', "".concat(dir, "/index.wit"), '-i', "".concat(libPath, "/src/lib.rs"), "--sdk"];
                    if (argv.standards) {
                        args.push('--standards');
                    }
                    return [4 /*yield*/, (0, util_1.spawn)(args)];
                case 11:
                    _b.sent();
                    json_args = [witme, 'near', 'json', '-o', dir, '-i', "".concat(dir, "/index.ts")];
                    return [4 /*yield*/, (0, util_1.spawn)(json_args)];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, (0, util_1.compressSchema)(dir)];
                case 13:
                    min_file = _b.sent();
                    return [4 /*yield*/, (0, util_1.spawn)([
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
                            "".concat(bin_dir, "/").concat((0, util_1.wasmBinName)(name)),
                        ])];
                case 14:
                    _b.sent();
                    _b.label = 15;
                case 15:
                    _i++;
                    return [3 /*break*/, 8];
                case 16: return [2 /*return*/];
            }
        });
    }); }).argv;
}
catch (e) {
    console.error(e);
    process.exit(1);
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
