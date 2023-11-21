import Schedule from 'node-schedule';

import { handleCampaigns } from './campaigns';

type Job = () => void;

const cronJobs: [string, Job][] = [['* * * * *', handleCampaigns]];

export const cronStart = () => {
  cronJobs.forEach((item) => {
    const [rule, job] = item;

    Schedule.scheduleJob(rule, job);
  });
};
