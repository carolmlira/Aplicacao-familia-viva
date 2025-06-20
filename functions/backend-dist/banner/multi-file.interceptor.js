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
exports.MultiFileInterceptor = void 0;
const common_1 = require("@nestjs/common");
const Busboy = require("busboy");
let MultiFileInterceptor = class MultiFileInterceptor {
    fields;
    constructor(fields) {
        this.fields = fields;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        return new Promise((resolve, reject) => {
            const busboy = Busboy({
                headers: request.headers,
                limits: { fileSize: 10 * 1024 * 1024 },
            });
            const fieldCounts = {};
            const files = {};
            const fields = {};
            busboy.on('file', (fieldname, file, info) => {
                const fieldConfig = this.fields.find((f) => f.name === fieldname);
                if (!fieldConfig) {
                    file.resume();
                    return;
                }
                fieldCounts[fieldname] = (fieldCounts[fieldname] || 0) + 1;
                if (fieldConfig.maxCount &&
                    fieldCounts[fieldname] > fieldConfig.maxCount) {
                    file.resume();
                    throw new common_1.BadRequestException(`Too many files for field ${fieldname}`);
                }
                const fileData = {
                    fieldname,
                    originalname: info.filename,
                    encoding: info.encoding,
                    mimetype: info.mimeType,
                    buffer: Buffer.alloc(0),
                    size: 0,
                };
                file.on('data', (data) => {
                    fileData.buffer = Buffer.concat([fileData.buffer, data]);
                    fileData.size = (fileData.size || 0) + data.length;
                });
                file.on('end', () => {
                    files[fieldname] = files[fieldname] || [];
                    files[fieldname].push(fileData);
                });
            });
            busboy.on('field', (name, value) => {
                fields[name] = value;
            });
            busboy.on('finish', () => {
                request.body = fields;
                request.files = files;
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
exports.MultiFileInterceptor = MultiFileInterceptor;
exports.MultiFileInterceptor = MultiFileInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Array])
], MultiFileInterceptor);
//# sourceMappingURL=multi-file.interceptor.js.map