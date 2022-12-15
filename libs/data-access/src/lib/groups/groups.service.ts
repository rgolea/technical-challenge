import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group, GroupQuery } from '@technical-challenge/shared-types';
import { GroupIDValidator, CountValidator } from '@technical-challenge/validators';
import { Model } from 'mongoose';
import { z } from 'zod';
import { InstanceDefinition, InstanceDocument } from '../instances/instances.model';
import { GroupDefinition, GroupDocument } from './groups.model';
import { buildQuery } from '@technical-challenge/mongoose-query-builder';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(GroupDefinition.name) private readonly groupModel: Model<GroupDocument>,
    @InjectModel(InstanceDefinition.name) private readonly instanceModel: Model<InstanceDocument>,
  ) { }

  async list(query?: GroupQuery): Promise<Array<Group>> {
    const q = query ? buildQuery<Group>(query) : {};
    return await this.groupModel.find(q);
  }

  async updateGroup(group: z.infer<typeof GroupIDValidator>, action: "INCREMENT" | "DECREMENT"): Promise<Group> {
    return (await this.groupModel.findOneAndUpdate({
      group
    }, {
      $set: {
        group
      },
      $inc: {
        instances: action === 'INCREMENT' ? 1 : -1
      }
    }, {
      upsert: true,
      new: true
    })).toObject();
  }

  async count(): Promise<number>{
    return await this.groupModel.countDocuments();
  }

  async countGroupInstances(group: z.infer<typeof GroupIDValidator>): Promise<z.infer<typeof CountValidator>> {
    const [count, estimatedDocumentCount] = await Promise.all([
      this.instanceModel.countDocuments({
        group
      }), this.instanceModel.estimatedDocumentCount()]);

    if (count) {
      await this.groupModel.findOneAndUpdate({
        group
      }, {
        $set: {
          group,
          instances: count
        }
      }, {
        upsert: true
      });
    } else {
      await this.groupModel.findOneAndDelete({
        group
      });
    }
    return { count, estimatedDocumentCount };
  }

  async countAggregation(group?: z.infer<typeof GroupIDValidator>) {
    // db.instances.aggregate([ { $match: {group: "particle-detector"} }, { $group: { _id: "$group", instances: { $sum: 1 }, lastUpdatedAt: {$max: "$lastUpdatedAt"}, createdAt: {$min: "$createdAt"} } }, {$project: { _id: 0, instances: 1, lastUpdatedAt: 1, createdAt: 1, group: "$_id" }}]).pretty()
    return this.instanceModel.aggregate([
      ...group ? [{
        $match: {
          group
        }
      }] : [],
      {
        $group: {
          _id: "$group",
          instances: {
            $sum: 1
          },
          lastUpdatedAt: {
            $max: "$lastUpdatedAt"
          },
          createdAt: {
            $min: "$createdAt"
          }
        }
      },
      {
        $project: {
          _id: 0,
          instances: 1,
          lastUpdatedAt: 1,
          createdAt: 1,
          group: "$_id"
        }
      }
    ]);
  }
}
