import { hoursToMinutes } from 'date-fns';
import { envsafe, port, str, num } from 'envsafe';

const safeEnv = envsafe({
  NODE_ENV: str({
    choices: ['development', 'production', 'test'],
    devDefault: 'development',
  }),
  PORT: port({ default: 3334 }),
  REDIS_HOST: str({ devDefault: 'localhost' }),
  REDIS_PORT: port({ devDefault: 6379 }),
  API_URL: str({ devDefault: 'http://localhost:3333' }),
  EXPIRED_INSTANCES_AGE_IN_MINUTES: num({ default: hoursToMinutes(24), devDefault: 1 })
});

export const environment = {
  production: safeEnv.NODE_ENV === 'production',
  ...safeEnv,
} as const;
