import axios from 'axios';

interface Message {
  content: string;
  phoneNumber: string;
}

const BASE_URL = process.env.WORKER_WHATSAPP_URL || 'http://localhost:3001';

export async function sender(message: Message) {
  await axios.post(`${BASE_URL}/send-text`, {
    phone: message.phoneNumber,
    data: message.content,
  });

  return message;
}
