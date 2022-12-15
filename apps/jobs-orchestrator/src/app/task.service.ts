import { Injectable, CacheStore, Inject, CACHE_MANAGER, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { Group, GroupQuery, Instance, InstanceQuery } from '@technical-challenge/shared-types';
import { combineLatest, concatMap, exhaustMap, from, lastValueFrom, map, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../environment';
import { addMinutes } from 'date-fns';
import { z } from 'zod';
import { CountValidator } from '@technical-challenge/validators';

@Injectable()
export class TaskService {
    constructor(
        private readonly http: HttpService,
        @Inject(CACHE_MANAGER) private cacheService: CacheStore
    ){}

    @Cron(environment.production ? CronExpression.EVERY_MINUTE : CronExpression.EVERY_5_SECONDS, {
        name: 'update-counts'
    })
    async updateCounts(){
      const INSTANCE_CACHE_KEY = 'group-count-key';
      const after = await this.cacheService.get<string>(INSTANCE_CACHE_KEY);
      console.log(this.cacheService);
      const query: GroupQuery = {
        limit: 10,
        sort: 'desc',
        sortBy: 'lastUpdatedAt',
        after: after ?? undefined,
      };

      await lastValueFrom(combineLatest([
        this.http.get<Group[]>('/', {
          params: query
        }).pipe(map(res => res.data)),
        this.http.get<{count: number}>('/count')
      ])
      .pipe(
        switchMap(([groups, count]) => {
          if(!count) return throwError(() => new Error('Count not found'));
          if(!groups?.length) {
            this.cacheService.del?.(INSTANCE_CACHE_KEY);
          }
          return from(groups);
        }),
        exhaustMap(group => this.http.get<z.infer<typeof CountValidator>>(`/${group.group}/count`)),
      )).catch(err => Logger.log(err.message));
    }

    @Cron(environment.production ? CronExpression.EVERY_10_MINUTES : CronExpression.EVERY_5_SECONDS, {
        name: 'update-expired-instances'
    })
    async updateInstances(){
      const INSTANCE_CACHE_KEY = 'last-instance-update';
      const after = await this.cacheService.get<string>(INSTANCE_CACHE_KEY);
      const query: InstanceQuery = {
        limit: 10,
        sort: 'desc',
        sortBy: 'lastUpdatedAt',
        after: after ?? undefined,
        before: addMinutes(new Date(), -environment.EXPIRED_INSTANCES_AGE_IN_MINUTES).toISOString()
      };

      await lastValueFrom(this.http.get<Instance[]>('/instances', {
        params: query
      }).pipe(
        map(res => res.data),
        tap((instances) => {
          const last = instances[instances.length - 1];
          if (last) {
            this.cacheService.set(INSTANCE_CACHE_KEY, last.lastUpdatedAt);
          }
        }),
        switchMap(instances => from(instances)),
        concatMap(instance => this.http.delete(`/${instance.group}/${instance.id}`)),
      )).catch(err => Logger.log(err.message));
    }
}
