"use client";
import "./globals.css";
import { KeyboardEvent } from "react";
import useState from "react-usestateref";
import next from "../public/next.svg";
import vercel from "../public/vercel.svg";
import thirteen from "../public/thirteen.svg";
import Image from "next/image";
import YouTube, { YouTubeProps } from "react-youtube";

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

const ChatMessage = ({ text, messenger }: MessageProps) => {
  return (
    <>
      {messenger == Messenger.User && (
        <div className="bg-white p-4 rounded-lg flex gap-4 items-center whitespace-pre-wrap">
          <Image src={next} alt="next" height={32} width={32} />
          <p className="text-black">{text}</p>
        </div>
      )}
      {messenger == Messenger.AI && (
        <div className="bg-gray-200 p-4 rounded-lg flex gap-4 items-center whitespace-pre-wrap">
          <Image src={vercel} alt="vercel" height={32} width={32} />
          <p className="text-black">{text}</p>
        </div>
      )}
    </>
  );
};

const ChatInput = ({ onSubmit, disabled }: InputProps) => {
  const [input, setInput] = useState("");

  const submitInput = () => {
    onSubmit(input);
    setInput("");
  };

  const handleEnterKey = (event: KeyboardEvent) => {
    if (event.code === "Enter") {
      submitInput();
    }
  };

  return (
    <div className="bg-white border-2 p-2 rounded-lg flex justify-center">
      <input
        value={input}
        onChange={(e) => setInput((e.target as HTMLInputElement).value)}
        className="w-full px-3 text-gray-800 rounded-lg focus:outline-none"
        type="text"
        placeholder="Enter Prompt"
        disabled={disabled}
        onKeyDown={(e: KeyboardEvent) => handleEnterKey(e)}
      />
      {/* { disabled && (
        <svg></svg>
      )} */}
    </div>
  );
};

const VideoPlayer = ({ onReady, opts }: YouTubeProps) => {
  const onPlayerReady: typeof onReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  const videoOptions: typeof opts = {
    height: "292",
    width: "480",
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
    // <div class="relative grid w-full h-full overflow-hidden bg-gray-800 place-items-center">
    //   <div class="z-10 w-full h-full p-12 backdrop-blur-5xl">
    //     <!-- your content here -->
    //   </div>
      
    //   <div class="absolute top-0 right-0 h-full w-full mix-blend-soft-light contrast-150 brightness-200 saturate-75 bg-gradient-to-tl from-violet-600 via-violet-700 to-sky-600">
    //   </div>
    // ,
    //   <div class="absolute top-0 right-0 h-full w-full mix-blend-soft-light contrast-150 brightness-200 saturate-75 bg-gradient-to-bl from-indigo-700 via-blue-600 to-blue-500">
    //   </div>
    // </div>
    <main className="relative mx-auto">
      <nav className="sticky w-screen py-2 px-4 mix-blend-soft-light brightness-150 saturate-75 bg-gradient-to-tl from-violet-600 via-violet-700 to-sky-600 flex items-center justify-center">
        <div className="flex">
          <Image src={thirteen} alt="thirteen" height={128} width={128} />
        </div>
      </nav>
      <div className="flex justify-center pb-4">
        <VideoPlayer />
      </div>
      <div className="flex mx-auto justify-center py-4">
        <ChatInput
          onSubmit={(input: string) => queryApi(input)}
          disabled={loading}
        />
      </div>
      <div className="max-w-2xl justify-center">
        <div className="mt-5 px-4">
          {messages.map((message: MessageProps) => (
            <ChatMessage
              key={message.key}
              text={message.text}
              messenger={message.messenger}
            />
          ))}
          {messages.length == 0 && (
            <p className="text-center text-2xl text-bold text-black">
              Enter a prompt above or upload a pdf to get started!
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
