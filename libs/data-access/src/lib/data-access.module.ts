import { Module } from '@nestjs/common';
import { GroupImport } from './groups/groups.model';
import { GroupsService } from './groups/groups.service';
import { InstanceImport } from './instances/instances.model';
import { InstancesService } from './instances/instances.service';

@Module({
  imports: [InstanceImport, GroupImport],
  controllers: [],
  providers: [InstancesService, GroupsService],
  exports: [InstancesService, GroupsService],
})
export class DataAccessModule {}
