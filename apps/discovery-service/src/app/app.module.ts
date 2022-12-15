import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggingInterceptorModule } from '@technical-challenge/logging-interceptor';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { environment } from '../environment';
import { GroupModule } from './groups/group.module';
import { InstancesModule } from './instances/instances.module';

@Module({
  imports: [
    PrometheusModule.register({
      defaultLabels: {
        serviceName: 'discovery-service'
      }
    }),
    LoggingInterceptorModule,
    MongooseModule.forRoot(environment.MONGODB_URI, {
      useNewUrlParser: true,
    }),
    GroupModule,
    InstancesModule,
  ]
})
export class AppModule {}
