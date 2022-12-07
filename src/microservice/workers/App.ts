import Schedule from 'node-schedule';

import Job from './interfaces/Job';
import { handle } from './JobScheduleSendWarningMessage';

export default class App {
  protected jobs = [
    ['* * * * * *', handle], // Every minute
  ];

  async onStart() {
    this.jobs.map(([rule, jobClass]) => {
      return Schedule.scheduleJob(rule, jobClass);
    });
  }

  async onDeath() {}
}
