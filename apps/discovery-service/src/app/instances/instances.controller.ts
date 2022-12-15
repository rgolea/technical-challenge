import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseInterceptors,
  Body,
  UsePipes,
  Query,
} from '@nestjs/common';
import { ZodValidationInterceptor } from '@technical-challenge/zod-validation-interceptor';
import { InstancesService } from '@technical-challenge/data-access';
import {
  InstanceQueryDTO,
  ParametersDTO,
  RegisterDTO,
} from '@technical-challenge/shared-types';
import { InstanceValidator } from '@technical-challenge/validators';

@Controller()
@UsePipes(ZodValidationPipe)
export class InstancesController {
  constructor(private readonly instanceService: InstancesService) {}

  @Get('instances')
  @UseInterceptors(new ZodValidationInterceptor(InstanceValidator.array()))
  query(@Query() query?: InstanceQueryDTO) {
    return this.instanceService.query(query);
  }

  @Get(':group')
  @UseInterceptors(new ZodValidationInterceptor(InstanceValidator.array()))
  list(@Param('group') group: string) {
    return this.instanceService.list(group);
  }

  @Post(':group/:instance')
  @UseInterceptors(new ZodValidationInterceptor(InstanceValidator))
  async register(@Param() params: ParametersDTO, @Body() body: RegisterDTO) {
    return this.instanceService.register({
      meta: body,
      id: params.instance,
      group: params.group,
    });
  }

  @Delete(':group/:instance')
  remove(@Param() params: ParametersDTO) {
    return this.instanceService.remove({
      instance: params.instance,
      group: params.group,
    });
  }
}
