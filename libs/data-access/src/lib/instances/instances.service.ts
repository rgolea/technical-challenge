import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InstanceDefinition, InstanceDocument } from './instances.model';
import { Instance, InstanceQuery, Register } from '@technical-challenge/shared-types';
import { z } from 'zod';
import { GroupIDValidator, ParametersValidator } from '@technical-challenge/validators';
import { GroupsService } from '../groups/groups.service';
import { buildQuery } from '@technical-challenge/mongoose-query-builder';

@Injectable()
export class InstancesService {
    constructor(
        @InjectModel(InstanceDefinition.name) private readonly instanceModel: Model<InstanceDocument>,
        private readonly groupService: GroupsService
    ) { }

    async register(instance: Register): Promise<Instance> {
        const { ok, value, lastErrorObject } = await this.instanceModel.findOneAndUpdate({
            id: instance.id,
            group: instance.group
        }, {
            $set: {
                ...instance
            }
        }, {
            upsert: true,
            new: true,
            rawResult: true
        });

        if (ok && value) {
            if (!lastErrorObject?.updatedExisting) {
                await this.groupService.updateGroup(instance.group, 'INCREMENT');
            }

            return value.toObject();
        } else {
            throw new Error("Unknown error");
        }
    }

    async query(query: InstanceQuery = {}): Promise<Array<Instance>> {
      return await this.instanceModel.find(buildQuery<Instance>(query));
    }

    async list(group: z.infer<typeof GroupIDValidator>) {
      this.instanceModel.find({
        group: {
          $in: group
        }
      })
        return this.instanceModel.find({ group });
    }

    async remove(options: z.infer<typeof ParametersValidator>): Promise<number> {
        const removed = await this.instanceModel.deleteOne({
            id: options.instance,
            group: options.group
        });

        await this.groupService.updateGroup(options.group, 'DECREMENT');
        return removed.deletedCount;
    }
}
