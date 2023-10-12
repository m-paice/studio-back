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
    await expo.sendPushNotificationsAsync([payload]);
  } catch (error) {
    console.error({ error });
  }
}
