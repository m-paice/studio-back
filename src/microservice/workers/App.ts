import Schedule from 'node-schedule';

import Job from './interfaces/Job';

export default class App {
  protected jobs: [string, Job][] = [];

  protected runningJobs: Schedule.Job[];

  async onStart() {}

  async onDeath() {}
}
