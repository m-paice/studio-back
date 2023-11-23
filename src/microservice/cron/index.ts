import Schedule from 'node-schedule';

import { handleCampaigns } from './campaigns';
import { handleAccountExpired } from './accountExpired';

type Job = () => void;

const cronJobs: [string, Job][] = [
  ['* * * * *', handleCampaigns], // every minute
  ['0 0 * * *', handleAccountExpired], // every day at 00:00
];

export const cronStart = () => {
  cronJobs.forEach((item) => {
    const [rule, job] = item;

    Schedule.scheduleJob(rule, job);
  });
};
