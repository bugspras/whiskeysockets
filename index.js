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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var fs_1 = require("fs");
var express = require("express");
var http = require("http");
var qrcode = require("qrcode");
var socket_io_1 = require("socket.io");
var path = require("path");
var baileys_1 = require("@whiskeysockets/baileys");
var port = 3000;
var app = express();
var server = http.createServer(app);
var io = new socket_io_1.Server(server);
var sock = {};
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use('/assets', express.static(path.join(__dirname, '/assets/')));
var sessions = [];
var SESSIONS_FILE = './sessions/whatsapp.json';
var createSessionsFileIfNotExists = function () {
    if (!(0, fs_1.existsSync)(SESSIONS_FILE)) {
        try {
            (0, fs_1.writeFileSync)(SESSIONS_FILE, JSON.stringify([]));
            console.log('Sessions file created successfully');
        }
        catch (err) {
            console.log('Failed to create sessions file: ', err);
        }
    }
};
createSessionsFileIfNotExists();
var getSessionsFile = function () {
    try {
        return JSON.parse((0, fs_1.readFileSync)(SESSIONS_FILE).toString());
    }
    catch (error) {
        return [];
    }
};
var setSessionsFile = function (sessions) {
    (0, fs_1.writeFile)(SESSIONS_FILE, JSON.stringify(sessions), function (err) {
        if (err) {
            console.log(err);
        }
    });
};
var deleteFolderRecursive = function (directoryPath) {
    if ((0, fs_1.existsSync)(directoryPath)) {
        (0, fs_1.readdirSync)(directoryPath).forEach(function (file, index) {
            var curPath = path.join(directoryPath, file);
            if ((0, fs_1.lstatSync)(curPath).isDirectory()) {
                // recurse
                deleteFolderRecursive(curPath);
            }
            else {
                // delete file
                (0, fs_1.unlinkSync)(curPath);
            }
        });
        (0, fs_1.rmdirSync)(directoryPath);
    }
};
var startSock = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, state_1, saveCreds, savedSessions, sessionIndex, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                console.log("ObjectID: ".concat(id));
                return [4 /*yield*/, (0, baileys_1.useMultiFileAuthState)("./sessions/".concat(id))];
            case 1:
                _a = _b.sent(), state_1 = _a.state, saveCreds = _a.saveCreds;
                sock[id] = (0, baileys_1.default)({
                    connectTimeoutMs: 10000,
                    defaultQueryTimeoutMs: 10000000,
                    keepAliveIntervalMs: 10000000,
                    printQRInTerminal: true,
                    auth: state_1
                });
                sock[id].ev.on('connection.update', function (update) { return __awaiter(void 0, void 0, void 0, function () {
                    var connection, lastDisconnect, qr, savedSessions_1, sessionIndex_1;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        try {
                            connection = update.connection, lastDisconnect = update.lastDisconnect, qr = update.qr;
                            if (qr) {
                                qrcode.toDataURL(qr, function (err, url) {
                                    io.emit('qr', { id: id, src: url });
                                });
                            }
                            if (connection === 'close') {
                                console.log("connection: close");
                                if (((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut) {
                                    console.log('run close not logout');
                                    setTimeout(function () {
                                        try {
                                            startSock(id);
                                        }
                                        catch (error) { }
                                    }, 15000);
                                }
                                else {
                                    if ((0, fs_1.existsSync)("./sessions/".concat(id))) {
                                        deleteFolderRecursive("./sessions/".concat(id));
                                        console.log("successfully deleted session ".concat(id));
                                        savedSessions_1 = getSessionsFile();
                                        sessionIndex_1 = savedSessions_1.findIndex(function (e) { return e.id == id; });
                                        savedSessions_1.splice(sessionIndex_1, 1);
                                        setSessionsFile(savedSessions_1);
                                    }
                                }
                            }
                            else if (connection === 'open') {
                                console.log("connection: open");
                                io.emit('name', { id: id, name: state_1.creds.me.name, status: 'open' });
                            }
                        }
                        catch (error) { }
                        return [2 /*return*/];
                    });
                }); });
                sock[id].ev.on('creds.update', saveCreds);
                savedSessions = getSessionsFile();
                sessionIndex = savedSessions.findIndex(function (sess) { return sess.id == id; });
                if (sessionIndex == -1) {
                    savedSessions.push({
                        id: id,
                    });
                    setSessionsFile(savedSessions);
                }
                return [2 /*return*/, false];
            case 2:
                error_1 = _b.sent();
                console.log('error: startSock');
                console.log(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var init = function (socket) { return __awaiter(void 0, void 0, void 0, function () {
    var savedSessions;
    return __generator(this, function (_a) {
        savedSessions = getSessionsFile();
        console.log('run init');
        savedSessions.forEach(function (e) {
            try {
                console.log("init :".concat(e.id));
                startSock(e.id);
            }
            catch (error) { }
        });
        return [2 /*return*/];
    });
}); };
init();
io.on('connection', function (socket) {
    init(socket);
    socket.on('create-session', function (data) {
        if (data.id) {
            try {
                console.log('io connection: ' + data.id);
                startSock(data.id);
            }
            catch (error) { }
        }
    });
});
app.get('/', function (req, res) {
    res.sendFile('views/index.html', {
        root: __dirname
    });
});
app.post('/send-message', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sender, number, message, timeout;
    return __generator(this, function (_a) {
        sender = req.body.sender;
        number = "".concat(req.body.number, "@s.whatsapp.net");
        message = req.body.message;
        timeout = 5000;
        setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
            var sendMessage, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, sock[sender].sendMessage(number, { text: message })];
                    case 1:
                        sendMessage = _a.sent();
                        timeout = 5000;
                        res.status(200).json({
                            status: true,
                            response: sendMessage
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        timeout = 10000;
                        res.status(500).json({
                            status: false,
                            response: error_2,
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }, timeout);
        return [2 /*return*/];
    });
}); });
server.listen(port, function () {
    console.log("http://localhost:".concat(port, "/?id=123&as=noname"));
});
server.timeout = 99999999;
