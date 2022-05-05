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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mkdir = exports.build_cmd = exports.CargoMetadata = exports.wasmBinName = exports.spawn = exports.cargo = exports.exec = exports.compress = exports.compressSchema = void 0;
var child_process = __importStar(require("child_process"));
var path = __importStar(require("path"));
var fs = __importStar(require("fs/promises"));
var util_1 = require("util");
var brotli = __importStar(require("brotli"));
/**
 *
 * @param wit_output_dir output for wit
 */
function compressSchema(wit_output_dir) {
    return __awaiter(this, void 0, void 0, function () {
        var json, _a, _b, json_data, min_file;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, fs.readFile(path.join(wit_output_dir, 'index.schema.json'), 'utf8')];
                case 1:
                    json = _b.apply(_a, [_c.sent()]);
                    json_data = compress(json);
                    min_file = path.join(wit_output_dir, 'index.schema.json.br');
                    return [4 /*yield*/, fs.writeFile(min_file, json_data)];
                case 2:
                    _c.sent();
                    return [2 /*return*/, min_file];
            }
        });
    });
}
exports.compressSchema = compressSchema;
function compress(data) {
    var str = JSON.stringify(data);
    debugger;
    return brotli.compress(Buffer.from(str, 'utf-8'));
}
exports.compress = compress;
exports.exec = (0, util_1.promisify)(child_process.exec);
function cargo(args) {
    return (0, exports.exec)(args.join(' '));
}
exports.cargo = cargo;
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
exports.spawn = spawn;
function wasmBinName(name) {
    return "".concat(name.replaceAll('-', '_'), ".wasm");
}
exports.wasmBinName = wasmBinName;
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
    CargoMetadata.prototype.ensure_output_dirs = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mkdir(this.bin_output_dir)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, mkdir(this.wit_output_dir)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
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
    Object.defineProperty(CargoMetadata.prototype, "bin_output_dir", {
        get: function () {
            return path.join(this.target_directory, 'res');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CargoMetadata.prototype, "wit_output_dir", {
        get: function () {
            return path.join(this.target_directory, 'wit');
        },
        enumerable: false,
        configurable: true
    });
    return CargoMetadata;
}());
exports.CargoMetadata = CargoMetadata;
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
exports.build_cmd = build_cmd;
function mkdir(s) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.mkdir(s)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    if (e_1.code !== 'EEXIST') {
                        throw e_1;
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.mkdir = mkdir;
