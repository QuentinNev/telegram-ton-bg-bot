"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.startBot = void 0;
require("dotenv/config.js");
var grammy_1 = require("grammy");
var bot = new grammy_1.Bot(process.env.TELEGRAM_BOT_TOKEN || "");
bot.api.setMyCommands([{ command: "claim", description: "Claim your AKATON" }]);
bot.command('claim', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var telegramId, reply_parameters, can, body, result, e_1;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                telegramId = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id;
                reply_parameters = { reply_parameters: { message_id: ((_b = ctx.message) === null || _b === void 0 ? void 0 : _b.message_id) || ((_c = ctx.from) === null || _c === void 0 ? void 0 : _c.id) || 0 } };
                if (!telegramId) return [3 /*break*/, 14];
                _d.label = 1;
            case 1:
                _d.trys.push([1, 11, , 13]);
                return [4 /*yield*/, canClaim(telegramId)];
            case 2:
                can = _d.sent();
                body = JSON.stringify({ telegramId: telegramId });
                if (!can) return [3 /*break*/, 8];
                return [4 /*yield*/, fetch('https://api.shockwaves.ai/claims', {
                        method: 'POST',
                        headers: {
                            'x-api-token': process.env.SW_API_TOKEN || '',
                            'Content-Type': 'application/json'
                        },
                        body: body
                    })];
            case 3:
                result = _d.sent();
                if (!result.ok) return [3 /*break*/, 5];
                return [4 /*yield*/, ctx.reply("You've successfully claimed your AKATON!", reply_parameters)];
            case 4:
                _d.sent();
                return [3 /*break*/, 7];
            case 5:
                console.error("Couldn't get telegram ID", telegramId);
                return [4 /*yield*/, ctx.reply('Something went wrong claiming your AKATON', reply_parameters)];
            case 6:
                _d.sent();
                _d.label = 7;
            case 7: return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, ctx.reply("Sorry, but you've already claimed your AKATON", reply_parameters)];
            case 9: return [2 /*return*/, _d.sent()];
            case 10: return [3 /*break*/, 13];
            case 11:
                e_1 = _d.sent();
                console.error("Error claiming your AKATON", e_1);
                return [4 /*yield*/, ctx.reply('Something went wrong claiming your AKATON', reply_parameters)];
            case 12:
                _d.sent();
                return [3 /*break*/, 13];
            case 13: return [3 /*break*/, 16];
            case 14:
                console.error("Couldn't get telegram ID", telegramId);
                return [4 /*yield*/, ctx.reply('Something went wrong claiming your AKATON', reply_parameters)];
            case 15:
                _d.sent();
                _d.label = 16;
            case 16: return [2 /*return*/];
        }
    });
}); });
var handleGracefulShutdown = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bot.stop()];
            case 1:
                _a.sent();
                process.exit();
                return [2 /*return*/];
        }
    });
}); };
if (process.env.NODE_ENV === "development") {
    // Graceful shutdown handlers
    process.once("SIGTERM", handleGracefulShutdown);
    process.once("SIGINT", handleGracefulShutdown);
}
var startBot = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!bot.isInited()) return [3 /*break*/, 2];
                return [4 /*yield*/, bot.stop()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4 /*yield*/, bot.start()];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.startBot = startBot;
exports.default = bot;
// private functions
/**
 * canClaim
 * @param telegramId Telegran user to check AKATON claim status
 * @returns boolean
 */
var canClaim = function (telegramId) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("https://api.shockwaves.ai/claims?telegramId=".concat(telegramId, "&limit=1"), {
                    method: 'GET'
                }).then(function (res) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!res.ok) return [3 /*break*/, 2];
                                return [4 /*yield*/, res.json()];
                            case 1: return [2 /*return*/, _a.sent()];
                            case 2: return [2 /*return*/, null];
                        }
                    });
                }); })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result && result.length === 0];
        }
    });
}); };
