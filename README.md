# Technical challenge

### Introduction

This project was made using the [NX Workspace](https://nx.dev) monorepository tool. It consists of 2 applications based on [NestJS](https://docs.nestjs.com) and 6 shared libraries. The two applications are the `discovery-service` and the `job-orchestrator` and you can find shared libraries named `data-access`, `logging-interceptor`, `mongoose-query-builder`, `shared-types`, `validators` and `zod-validation-pipe`.

Install dependencies with `pnpm` and if this is not available, you can also use `yarn` but you will get a `yarn.lock` file in your project.

Use the following command to run the applications in development mode:
```
$ pnpm nx run <application_name>:serve
# In parallel
$ pnpm nx run-many --target=serve --all
```

For building the applications for production, you need to set the environment variables (see below) and then you can use the following command and find them in the `dist` folder:
```
$ pnpm nx run <application_name>:build:production
# In parallel
$ pnpm nx run-many --target=build --configuration=production --all
```

### Discovery Service
This is the API endpoint. It's the only one that connects to the database. It has several endpoints, most of them required by the definition and maybe a bit enhanced with some query parameters, and it also has a few extra ones and you can find all of them in the different controllers.

### Job Orchestrator

This is the application that will be running in the background and it will be responsible for updating the count of the groups and the age of the instances. This was intended to be also a scalable solution by bringing in the `bull` library and using it to create a queue of jobs that will be processed by the workers. However after playing with this solution for a while, due to time constraints, it was not implemented and this microservice is not as scalable.

When using the `bull` library, the `job-orchestrator` would have been the responsible service for creating the jobs and adding them to the queue. The workers would have been responsible for processing the jobs and updating the database. The difficult part here is actually to split the jobs and separate the data into different parts. Probably the best way to achieve this would have been to use some sort of random `uuid` and trigger jobs based on that virtual cursor. The problem here would have been making sure the counters are updated frequently so that cursor would also request the oldest data first. 

### Approaches

There are two possible approaches for this functionality and they are both implemented in the code. The simpler one is to query the database and group the instances by the `group` property and sum all the items into the `count` property. This is the approach, is quite simple and it's one that, even if it's quite straight forward, it's not the most efficient one because of the delay of the necessary query. You can find this approach in the `aggregation-counter.controller.ts` file and you can even call it at the `/--aggregation-counter--` endpoints with both the `/--aggregation-counter--`and the `/--aggregation-counter--/:group` endpoints.


The second approach is to use two collections. One for the instances and one for the groups. However, this approach requires the presence of the job orchestrator as there can be a delay between updating the application instance and updating of the group and with a horizontal scalable approach, you find that there are quite a few race conditions. This is the approach, **even if it's not entirely finished** is a better equipped version for a real production environment and you can find it in the `group-counter.controller.ts` file and you can call it at the `/--group-counter--` endpoints with both the `/--group-counter--`and the `/--group-counter--/:group` endpoints.


### Shared Libraries

#### Data Access
Here you can find the services and the models for the database. It's a simple library that uses the `mongoose` library to connect to the database. Everything related to data handling is inside it.

#### Logging Interceptor
This is a simple interceptor that logs the requests and the responses and gives them a unique id. It's a simple interceptor that can be used in any NestJS application.

#### Mongoose Query Builder
This is a library that takes a query object and builds a mongoose query from it. It's a library that is designed to make the queries more flexible and it's used in the controllers inside the `discovery-service` application and the `Query` type is being set in the http `job-orchestrator`` service.

#### Validators
This is a library that contains the validators for the different types. It's a library that is used in the `shared-types` library and it's used to generate some of the typescript types.

#### Shared types
This is a library that contains the shared types between the applications. The library generates new types from the validators that are created in the `validators` library.

#### Zod Validation Interceptor
This is an interceptor that is being used to make sure the data that is being sent from the API is valid, purged and serialized so no extra data is being sent.

### Metrics visualizer.

The metrics visualizer is a simple application that uses the `prom-client` library to collect the metrics and the `prometheus` library to visualize them. Both the services contain metrics and the endpoint for them are `/metrics` for both. The configuration file for the `prometheus` is located in the `prometheus.dev.yml` file and you can run it with the following command:

```
docker run \
    -p 9090:9090 \
    -v $(pwd)/prometheus.dev.yml:/etc/prometheus/prometheus.yml \
    prom/prometheus
```

__NOTE:__ If you are about to use this in production mode, you should probably adjust
the `prometheus.dev.yml` file to your needs and probably set a new `prometheus.yml` one.

### Environment Variables

The environment variables are located in the `environment.ts` files in both the `discovery-service` and the `job-orchestrator` applications. We set the environment variables with `envsafe` which is a typescript based library that ensures that the environment variables are set and that they are of the correct type. If the variables are not set, an error would appear in the terminal.
