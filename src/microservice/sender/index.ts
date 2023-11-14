import axios from 'axios';
import debug from 'debug';
import querystring from 'querystring';

import { WORKER_WHATSAPP_TOKEN, WORKER_WHATSAPP_URL, WORKER_WHATSAPP_INSTANCE_KEY } from '../../constants/whatsapp';
import { CAMPAIGN_DONE, CAMPAIGN_ERROR, CAMPAIGN_PENDING } from '../../constants/campaign';
import CampaignUser from '../../repository/CampaignUser';
import CampaignSchedule from '../../repository/CampaignSchedule';
import Campaigns from '../../resource/Campaigns';

interface Message {
  userId: string;
  scheduleId: string;
  campaignId: string;
  content: string;
  phoneNumber: string;
}

const logger = debug('@campaign');

export async function sender(message: Message) {
  logger(`consumer campaign ${message.campaignId} from user ${message.userId}`);

  const formData = {
    id: `55${message.phoneNumber}`,
    message: message.content,
  };

  const formUrlencoded = querystring.stringify(formData);

  try {
    await axios.post(`${WORKER_WHATSAPP_URL}/message/text?key=${WORKER_WHATSAPP_INSTANCE_KEY}`, formUrlencoded, {
      headers: {
        Authorization: `Bearer ${WORKER_WHATSAPP_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (message.userId) {
      const item = await CampaignUser.findOne({
        where: { campaignId: message.campaignId, userId: message.userId },
      });

      /** update status item */
      if (item) await CampaignUser.update(item, { status: CAMPAIGN_DONE }, {});

      /** update status campaign */
      if (
        (await CampaignUser.count({
          where: { campaignId: message.campaignId, userId: message.userId, status: CAMPAIGN_PENDING },
        })) === 0
      )
        await Campaigns.updateById(message.campaignId, { status: CAMPAIGN_DONE });
    }

    if (message.scheduleId) {
      const item = await CampaignSchedule.findOne({
        where: { campaignId: message.campaignId, scheduleId: message.scheduleId },
      });

      /** update status item */
      if (item) await CampaignUser.update(item, { status: CAMPAIGN_DONE }, {});

      /** update status campaign */
      if (
        (await CampaignSchedule.count({
          where: { campaignId: message.campaignId, scheduleId: message.scheduleId, status: CAMPAIGN_PENDING },
        })) === 0
      )
        await Campaigns.updateById(message.campaignId, { status: CAMPAIGN_DONE });
    }

    return message;
  } catch (error) {
    console.log(error);

    if (message.userId) {
      const item = await CampaignUser.findOne({
        where: { campaignId: message.campaignId, userId: message.userId },
      });

      /** update status item */
      if (item) await CampaignUser.update(item, { status: CAMPAIGN_ERROR }, {});

      /** update status campaign */
      if (
        (await CampaignUser.count({
          where: { campaignId: message.campaignId, userId: message.userId, status: CAMPAIGN_PENDING },
        })) === 0
      )
        await Campaigns.updateById(message.campaignId, { status: CAMPAIGN_DONE });
    }

    if (message.scheduleId) {
      const item = await CampaignSchedule.findOne({
        where: { campaignId: message.campaignId, scheduleId: message.scheduleId },
      });

      /** update status item */
      if (item) await CampaignUser.update(item, { status: CAMPAIGN_ERROR }, {});

      /** update status campaign */
      if (
        (await CampaignSchedule.count({
          where: { campaignId: message.campaignId, scheduleId: message.scheduleId, status: CAMPAIGN_PENDING },
        })) === 0
      )
        await Campaigns.updateById(message.campaignId, { status: CAMPAIGN_DONE });
    }

    return null;
  }
}
