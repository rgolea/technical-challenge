import { Test } from '@nestjs/testing';
import { InstancesService } from './instances.service';
import { connection } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { InstanceDefinition, InstanceSchema } from './instances.model';

describe('Instances Test suite', () => {
    let instancesService: InstancesService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [],
            providers: [InstancesService, {
                provide: getModelToken(InstanceDefinition.name),
                useValue: InstanceSchema
            }],
        }).compile();

        instancesService = module.get<InstancesService>(InstancesService);
    });

    it('should be defined', () => {
        expect(instancesService).toBeDefined();
    });
});
