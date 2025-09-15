import Title from "./ui/title";
import dynamic from "next/dynamic";


export default function Home() {
  const Chatbot = dynamic(()=> import("./ui/chatbot"))
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-600">
      
      <Title />
      <Chatbot />
    </div>
  );
}