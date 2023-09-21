import { Expo, ExpoPushMessage } from 'expo-server-sdk';

const expo = new Expo();

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
    const receipts = await expo.sendPushNotificationsAsync([payload]);

    console.log({ receipts });
  } catch (error) {
    console.log({ error });
  }
}
