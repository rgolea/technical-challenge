import { Module } from '@nestjs/common';
import { DataAccessModule } from '@technical-challenge/data-access';
import { GroupController } from './group.controller';
import { AggregationCounterController } from './aggregation-counter.controller';

@Module({
    imports: [DataAccessModule],
    controllers: [GroupController, AggregationCounterController],
    providers: [],
})
export class GroupModule {};
