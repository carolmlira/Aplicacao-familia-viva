"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNestServer = createNestServer;
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const app_1 = require("firebase-admin/app");
async function createNestServer(expressInstance) {
    const app = expressInstance
        ? await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressInstance))
        : await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Familia Viva Project')
        .setDescription('Backend NestJS via Firebase')
        .setVersion('1.0')
        .addBearerAuth()
        .addServer('/')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('/api', app, document);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    await app.init();
    if (!(0, app_1.getApps)().length) {
        (0, app_1.initializeApp)();
    }
    if (!expressInstance) {
        const PORT = parseInt(process.env.PORT ?? '8080');
        await app.listen(PORT);
    }
    if (process.env.NODE_ENV === 'development') {
        const router = app.getHttpAdapter().getInstance();
        router._router.stack.forEach(printRoutes);
    }
    return app;
}
function printRoutes(layer) {
    if (layer.route) {
        console.log(`${layer.route.stack[0].method.toUpperCase()} ${layer.route.path}`);
    }
}
//# sourceMappingURL=main.js.map