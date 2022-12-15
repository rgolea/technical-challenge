import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Instance } from '@technical-challenge/shared-types';

export type InstanceDocument = HydratedDocument<InstanceDefinition>;

@Schema({
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'lastUpdatedAt'
    },
    autoIndex: true,
    collection: 'instances'
})
export class InstanceDefinition implements Instance {
  @Prop({ required: true, unique: true, type: String })
  id!: string;

  @Prop({ required: true, type: String, index: 'hashed' })
  group!: string;

  @Prop({ required: true, type: Date })
  createdAt!: string;

  @Prop({ required: true, type: Date })
  lastUpdatedAt!: string;

  @Prop({ type: Object })
  meta?: Record<string, unknown>;
}

export const InstanceSchema = SchemaFactory.createForClass(InstanceDefinition);

export const InstanceImport = MongooseModule.forFeature([{
  name: InstanceDefinition.name,
  schema: InstanceSchema
}]);
