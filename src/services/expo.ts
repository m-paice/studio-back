import debug from 'debug';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

const logger = debug('@expo');

const expo = new Expo({ accessToken: 'M2g4pYkkCQ6zuJDM_NrsVTdtaX9yVA0unWdHVXa3' });

// const expoPushCredentials = {
//   accessToken: 'SEU_ACCESS_TOKEN',
// };

export async function sendNotification({ token, title, message }) {
  const payload: ExpoPushMessage = {
    to: token,
    sound: 'default',
    title,
    body: message,
    data: { anyData: 'you want' },
  };

  try {
    logger(`payload: ${JSON.stringify(payload, null, 2)}`);
    const [chunk] = expo.chunkPushNotifications([payload]);
    const response = await expo.sendPushNotificationsAsync(chunk);
    logger(`response notification: ${JSON.stringify(response, null, 2)}`);
  } catch (error) {
    logger(`erro send notification: ${error}`);
  }
}
