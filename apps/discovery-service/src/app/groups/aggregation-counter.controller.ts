import { Controller, Get, Param } from "@nestjs/common";
import { GroupsService } from "@technical-challenge/data-access";

@Controller('--aggregation-counter--')
export class AggregationCounterController {
  constructor(
    private groupService: GroupsService
  ){}

  @Get(':group')
  async getRealCounter(
    @Param('group') group: string
  ) {
    return (await this.groupService.countAggregation(group))[0];
  }

  @Get()
  async getRealCounters() {
    return this.groupService.countAggregation();
  }
}
