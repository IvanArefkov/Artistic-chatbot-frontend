
import Title from "./ui/title";
import Chatbot from "./ui/chatbot";

export default function Home() {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-600">
      <Title />
      <Chatbot />
    </div>
  );
}
