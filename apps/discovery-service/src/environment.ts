import { envsafe, port, str } from 'envsafe';

const safeEnv = envsafe({
  NODE_ENV: str({
    choices: ['development', 'production', 'test'],
    devDefault: 'development',
  }),
  PORT: port({ default: 3333 }),
  ENDPOINT_PREFIX: str({ default: '', allowEmpty: true }),
  MONGODB_URI: str({ devDefault: 'mongodb://localhost:27017/discovery-service' })
});

export const environment = {
  production: safeEnv.NODE_ENV === 'production',
  ...safeEnv,
} as const;
