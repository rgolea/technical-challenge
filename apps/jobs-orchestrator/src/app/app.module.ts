import { CacheModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { TaskService } from './task.service';
import { HttpModule } from '@nestjs/axios';
import { environment } from '../environment';

@Module({
  imports: [PrometheusModule.register({
    defaultLabels: {
      serviceName: 'jobs-orchestrator'
    }
  }), ScheduleModule.forRoot(), HttpModule.register({
    baseURL: environment.API_URL
  }), CacheModule.register()],
  controllers: [],
  providers: [TaskService],
})
export class AppModule { }
