import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { GroupsService } from '@technical-challenge/data-access';
import { GroupQueryDTO } from '@technical-challenge/shared-types';
import {
  CountValidator,
  GroupValidator,
} from '@technical-challenge/validators';
import { ZodValidationInterceptor } from '@technical-challenge/zod-validation-interceptor';

@Controller()
@UsePipes(ZodValidationPipe)
export class GroupController {
  constructor(private readonly groupService: GroupsService) {}

  @Get()
  @UseInterceptors(new ZodValidationInterceptor(GroupValidator.array()))
  list(@Query() query?: GroupQueryDTO) {
    return this.groupService.list(query);
  }

  @Get('count')
  async count() {
    return {
      count: await this.groupService.count(),
    };
  }

  @Get(':group/count')
  @UseInterceptors(new ZodValidationInterceptor(CountValidator))
  countGroupInstances(@Param('group') group: string) {
    return this.groupService.countGroupInstances(group);
  }
}
