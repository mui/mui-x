import { ChatBox } from '@mui/x-chat';

const adapter = {
  async sendMessage() {
    return new ReadableStream();
  },
};

export default function App() {
  return <ChatBox adapter={adapter} sx={{ height: 500 }} />;
}
