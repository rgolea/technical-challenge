import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Group } from '@technical-challenge/shared-types';

export type GroupDocument = HydratedDocument<GroupDefinition>;

@Schema({
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'lastUpdatedAt'
    },
    autoIndex: true,
    collection: 'groups',
    optimisticConcurrency: true
})
export class GroupDefinition implements Group {
  @Prop({ required: true, type: String, index: 'hashed' })
  group!: string;

  @Prop({ required: true, type: Date })
  createdAt!: string;

  @Prop({ required: true, type: Date })
  lastUpdatedAt!: string;

  @Prop({ type: Number, default: 0, min: 0 })
  instances!: number;
}

export const GroupSchema = SchemaFactory.createForClass(GroupDefinition);

export const GroupImport = MongooseModule.forFeature([{
  name: GroupDefinition.name,
  schema: GroupSchema
}]);
