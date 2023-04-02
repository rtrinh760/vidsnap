"use client";
import "./globals.css";
import { KeyboardEvent } from "react";
import useState from "react-usestateref";
import user from "../public/user.svg";
import Image from "next/image";
import botImage from "../public/openai-logo.svg";
import YouTube, { YouTubeProps } from "react-youtube";
import getVideoId from "get-video-id";

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
  disabled?: boolean;
}

interface ButtonProps {
  onClick: () => void;
  disabled: boolean;
}

interface NavProps {}

const Nav: React.FC<NavProps> = () => {
  return (
    <nav className="bg-gray-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tl from-purple-400 via-blue-400 to-blue-600">
              🔥 vidsnap.ai
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

export type Message = {
  prompt: string;
};

export type Link = {
  link: string;
};

const ChatMessage = ({ text, messenger }: MessageProps) => {
  const isUser = messenger === Messenger.User;

  if (isUser) {
    return (
      <div
        className={`max-w-2xl mb-4 ${
          isUser
            ? "ml-auto bg-blue-600 text-white"
            : "mr-auto bg-violet-600 text-white"
        } rounded-lg p-3 flex gap-4 items-center whitespace-pre-wrap`}
      >
        <Image src={user} alt="user-profile" width={25} height={25} />
        <p className="text-white">{text}</p>
      </div>
    );
  } else {
    return (
      <div
        className={`max-w-2xl mb-4 ${
          isUser
            ? "ml-auto bg-blue-600 text-white"
            : "mr-auto bg-violet-600 text-white"
        } rounded-lg p-3 flex gap-4 items-center whitespace-pre-wrap`}
      >
        <Image src={botImage} alt="user-profile" width={25} height={25} />
        <p className="text-white">{text}</p>
      </div>
    );
  }
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

  // post link to openai to get transcript
  // set messages to empty
  // use custom types to detect if it is a link or message
  // set the post type in this case

  return (
    <div className="bg-white border-2 p-2 rounded-lg flex justify-center h-full">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full px-3 text-gray-800 rounded-lg focus:outline-none font-semibold py-2 border shadow mr-1"
        type="text"
        placeholder="Enter Prompt"
        onKeyDown={handleEnterKey}
      />
      <button
        onClick={submitInput}
        className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
        disabled={!input}
      >
        Send
      </button>
    </div>
  );
};

const QuizButton = ({ onClick, disabled }: ButtonProps) => {
  return (
    <div>
      <button
        onClick={onClick}
        disabled={disabled}
        className="pl-4 text-white bg-yellow-500 hover:bg-yellow-600 font-semibold py-2 px-4 border border-gray-400 rounded shadow transition-colors duration-300"
      >
        Quiz me!
      </button>
    </div>
  );
};

const MCButton = ({ onClick, disabled }: ButtonProps) => {
  return (
    <div>
      <button
        onClick={onClick}
        disabled={disabled}
        className="pl-4 text-white bg-green-500 hover:bg-green-600 font-semibold py-2 px-4 border border-gray-400 rounded shadow transition-colors duration-300"
      >
        Quiz me! (MC)
      </button>
    </div>
  );
};

const SummarizeButton = ({ onClick, disabled }: ButtonProps) => {
  return (
    <div>
      <button
        onClick={onClick}
        disabled={disabled}
        className="pl-4 text-white bg-orange-500 hover:bg-orange-600 font-semibold py-2 px-4 border border-gray-400 rounded shadow transition-colors duration-300"
      >
        Summarize!
      </button>
    </div>
  );
};

const LinkInput = ({ onSubmit }: InputProps) => {
  const [input, setInput] = useState("");

  const submitInput = () => {
    if (!input) return;

    const videoId = getVideoId(input).id;

    if (!videoId) return;

    onSubmit(videoId);
    setInput("");
  };

  const handleEnterKey = (event: KeyboardEvent) => {
    if (event.code === "Enter") {
      submitInput();
    }
  };

  return (
    <div className="bg-white border-2 p-2 rounded-lg flex justify-center w-full">
      <input
        value={input}
        onChange={(e) => setInput((e.target as HTMLInputElement).value)}
        className="w-full px-3 text-gray-800 rounded-lg focus:outline-none font-semibold py-2 border shadow mr-1"
        type="text"
        placeholder="Enter YouTube Link"
        onKeyDown={(e: KeyboardEvent) => handleEnterKey(e)}
      />
      <button
        onClick={submitInput}
        className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 mr-1"
        disabled={!input}
      >
        Send
      </button>
    </div>
  );
};

const VideoPlayer = ({ videoId, onReady, opts }: YouTubeProps) => {
  const onPlayerReady: typeof onReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  const videoOptions: typeof opts = {
    height: "327",
    width: "538",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <YouTube videoId={videoId} opts={videoOptions} onReady={onPlayerReady} />
  );
};

export default function Home() {
  const [messages, setMessages, messagesRef] = useState<MessageProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [videoId, setVideoId] = useState("");

  const queryApi = async (input: string, isLink: boolean=false) => {
    setLoading(true);

    const userMessage: MessageProps = {
      text: input,
      messenger: Messenger.User,
      key: new Date().getTime(),
    };

    if(!isLink) {
      setMessages([...messagesRef.current, userMessage]);
    }
    const gptResponse = await fetch("/api/openaiRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: input, isLink: isLink }),
    }).then((gptResponse) => gptResponse.json());

    setLoading(false);

    if (gptResponse.text) {
      const gptMessage: MessageProps = {
        text: gptResponse.text,
        messenger: Messenger.AI,
        key: new Date().getTime(),
      };

      if(!isLink) {
        setMessages([...messagesRef.current, gptMessage]);
      }

    } else {
      return new Response("Error occurred.", { status: 400 });
    }
  };

  const queryApiOnQuizButton = async () => {
    setLoading(true);
    const prompt: string = `Please generate a question from the information of the video transcript that 
          tests my knowledge. I will give you my answer in the next request.`;

    const gptResponse = await fetch("/api/openaiRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
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

  const queryApiOnMCButton = async () => {
    setLoading(true);
    const prompt: string = `Please generate a multiple-choice question with 4 options that 
          tests my knowledge about the video. I will give you my answer in the next request.`;

    const gptResponse = await fetch("/api/openaiRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
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

  const queryApiOnSummarizeButton = async () => {
    setLoading(true);
    const prompt: string = `Please generate a summary of the transcript that highlights 5 key points.`;

    const gptResponse = await fetch("/api/openaiRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
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

  const queryYouTube = async (input: string) => {
    setLoading(true);

    setVideoId(input);

    queryApi(input, true)

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 h-screen overflow-auto">
      <nav>
        <Nav />
      </nav>
      <div className="flex-grow flex flex-row h-full overflow-auto">
        <div className="flex-grow-0 flex-shrink-0 w-1/2 pl-10 mr-10 flex justify-center items-center">
          {videoId.length == 0 && (
            <LinkInput onSubmit={(input: string) => queryYouTube(input)} />
          )}
          {videoId.length != 0 && <VideoPlayer videoId={videoId} />}
        </div>

        <div className="shadow-lg bg-gray-200 rounded-md p-4  flex flex-col gap-4 overflow-x-hidden pl-10 h-full overflow-y-scroll">
          <div className="flex flex-row space-x-1 justify-center">
            {videoId.length != 0 && (
              <>
                <QuizButton
                  onClick={() => queryApiOnQuizButton()}
                  disabled={loading}
                />
                <MCButton
                  onClick={() => queryApiOnMCButton()}
                  disabled={loading}
                />
                <SummarizeButton
                  onClick={() => queryApiOnSummarizeButton()}
                  disabled={loading}
                />
              </>
            )}
          </div>
          {messages.map((message: MessageProps) => (
            <ChatMessage
              key={message.key}
              text={message.text}
              messenger={message.messenger}
            />
          ))}
          <div className="flex h-screen justify-center items-center">
            {messages.length == 0 && videoId.length != 0 && (
              <p className="text-center text-2xl text-extrabold text-black">
                Enter a prompt below or click one of the buttons above to get
                started!
              </p>
            )}
            {videoId.length == 0 && (
              <p className="text-center text-2xl text-extrabold text-black
              ">
                Enter a link on the left to access the AI assistant.
              </p>
            )}
          </div>
          <div className="mt-auto">
            {videoId.length != 0 && (
              <ChatInput
                onSubmit={(input: string) => queryApi(input)}
                disabled={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
