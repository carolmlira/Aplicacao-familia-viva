"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileInterceptor = void 0;
const common_1 = require("@nestjs/common");
const Busboy = require("busboy");
const crypto_1 = require("crypto");
let FileInterceptor = class FileInterceptor {
    fieldName;
    maxCount;
    options;
    constructor(fieldName, maxCount, options = {}) {
        this.fieldName = fieldName;
        this.maxCount = maxCount;
        this.options = options;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        return new Promise((resolve, reject) => {
            const busboy = Busboy({
                headers: request.headers,
                limits: this.options.limits ?? { fileSize: 1024 * 1024 * 10 },
            });
            const fields = {};
            const files = [];
            let count = 0;
            busboy.on('file', (name, file, info) => {
                const id = (0, crypto_1.randomUUID)();
                if (name !== this.fieldName) {
                    file.resume();
                    return;
                }
                if (typeof this.maxCount !== 'undefined' && count++ >= this.maxCount) {
                    file.resume();
                    throw new common_1.BadRequestException('Too many files...');
                }
                file.on('data', (data) => {
                    const existing = files.find((v) => v.id === id);
                    if (existing) {
                        existing.buffer = Buffer.concat([
                            existing.buffer ?? Buffer.alloc(0),
                            data,
                        ]);
                        existing.size = (existing.size || 0) + data.length;
                    }
                    else {
                        files.push({
                            id,
                            fieldname: name,
                            originalname: info.filename,
                            encoding: info.encoding,
                            mimetype: info.mimeType,
                            size: data.length,
                            buffer: data,
                        });
                    }
                });
            });
            busboy.on('field', (name, value) => {
                fields[name] = value;
            });
            busboy.on('finish', () => {
                request.body = fields;
                const data = files.map((file) => {
                    delete file.id;
                    return file;
                });
                if (this.maxCount === 1)
                    request.file = data[0];
                else
                    request.files = data;
                resolve(next.handle());
            });
            busboy.on('error', (err) => {
                reject(err);
            });
            if (request.rawBody)
                busboy.end(request.rawBody);
            else
                request.pipe(busboy);
        });
    }
};
exports.FileInterceptor = FileInterceptor;
exports.FileInterceptor = FileInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String, Number, Object])
], FileInterceptor);
//# sourceMappingURL=file.interceptor.js.map