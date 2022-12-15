import { Module } from '@nestjs/common';
import { InstancesController } from './instances.controller';
import { DataAccessModule } from '@technical-challenge/data-access';

@Module({
    imports: [DataAccessModule],
    controllers: [InstancesController]
})
export class InstancesModule {};
