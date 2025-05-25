"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMinistryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_ministry_dto_1 = require("../create-ministry.dto/create-ministry.dto");
class UpdateMinistryDto extends (0, mapped_types_1.PartialType)(create_ministry_dto_1.CreateMinistriesDto) {
}
exports.UpdateMinistryDto = UpdateMinistryDto;
//# sourceMappingURL=update-ministry.dto.js.map