"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEventsDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_events_dto_1 = require("../create-events.dto/create-events.dto");
class UpdateEventsDto extends (0, mapped_types_1.PartialType)(create_events_dto_1.CreateEventDto) {
}
exports.UpdateEventsDto = UpdateEventsDto;
//# sourceMappingURL=update-events.dto.js.map