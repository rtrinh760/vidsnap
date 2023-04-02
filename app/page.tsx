"use client";
import "./globals.css";
import { KeyboardEvent } from "react";
import useState from "react-usestateref";
import next from "../public/next.svg";
import vercel from "../public/vercel.svg";
import thirteen from "../public/thirteen.svg";
import Image from "next/image";
import YouTube, { YouTubeProps } from "react-youtube";

//import logo from "../public/logo.svg";"Don't have one yet"

enum Messenger {
  User = "User",
  AI = "AI",
}

interface MessageProps {
  text: string;
  messenger: Messenger;
  key: number;
}

interface InputProps {
  onSubmit: (input: string) => void;
  disabled: boolean;
}

interface NavProps {}

const Nav: React.FC<NavProps> = () => {
  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-white body-font font-poppins font-extrabold bg-clip-text bg-gradient-to-r from-grey-100 to-grey-300 text-4xl">
              🧻 vidsnap.ai
            </h1>
          </div>
          <div className="ml-auto">
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300">
              Log In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const ChatMessage = ({ text, messenger }: MessageProps) => {
  const isUser = messenger === Messenger.User;

  return (
    <div
      className={`max-w-2xl mb-4 ${
        isUser ? "ml-auto bg-blue-600 text-white" : "mr-auto bg-gray-200"
      } rounded-lg p-4 flex gap-4 items-center whitespace-pre-wrap`}
    >
      <p className="text-black">{text}</p>
    </div>
  );
};

const ChatInput = ({ onSubmit, disabled }: InputProps) => {
  const [input, setInput] = useState("");

  const submitInput = () => {
    if (!input) return;
    onSubmit(input);
    setInput("");
  };

  const handleEnterKey = (event: KeyboardEvent) => {
    if (event.code === "Enter") {
      submitInput();
    }
  };

  return (
    <div className="bg-white border-2 p-2 rounded-lg flex justify-center h-full">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full px-3 text-gray-800 rounded-lg focus:outline-none"
        type="text"
        placeholder="Enter a prompt"
        onKeyDown={handleEnterKey}
      />
      <button
        onClick={submitInput}
        className="ml-2 py-2 px-4 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 disabled:text-gray-800"
        disabled={!input}
      >
        Send
      </button>
    </div>
  );
};

const VideoPlayer = ({ onReady, opts }: YouTubeProps) => {
  const onPlayerReady: typeof onReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  const videoOptions: typeof opts = {
    height: "365",
    width: "600",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  return (
    <YouTube
      videoId="I14_HrJktIs"
      opts={videoOptions}
      onReady={onPlayerReady}
    />
  );
};

export default function Home() {
  const [messages, setMessages, messagesRef] = useState<MessageProps[]>([]);
  const [loading, setLoading] = useState(false);

  const queryApi = async (input: string) => {
    setLoading(true);

    const userMessage: MessageProps = {
      text: input,
      messenger: Messenger.User,
      key: new Date().getTime(),
    };

    setMessages([...messagesRef.current, userMessage]);
    const gptResponse = await fetch("/api/openaiRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: input }),
    }).then((gptResponse) => gptResponse.json());

    setLoading(false);

    if (gptResponse.text) {
      const gptMessage: MessageProps = {
        text: gptResponse.text,
        messenger: Messenger.AI,
        key: new Date().getTime(),
      };
      setMessages([...messagesRef.current, gptMessage]);
    } else {
      return new Response("Error occurred.", { status: 400 });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <nav className="">
        <Nav />
      </nav>
      <div className="flex-grow flex flex-row">
        <div className="flex-grow-0 flex-shrink-0 w-1/2 py-10 pl-10">
          <VideoPlayer />
        </div>

        <div className="flex-grow flex-shrink-0 max-w-2xl bg-gray-200 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto">
          {messages.map((message: MessageProps) => (
            <ChatMessage
              key={message.key}
              text={message.text}
              messenger={message.messenger}
            />
          ))}
          {messages.length == 0 && (
            <p className="text-center text-2xl font-bold text-gray-500">
              Enter a prompt above to get started!
            </p>
          )}

          <div className="mt-auto">
            <ChatInput
              onSubmit={(input: string) => queryApi(input)}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
