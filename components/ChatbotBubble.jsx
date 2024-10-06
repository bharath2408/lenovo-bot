"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";

export default function ChatbotBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const nodeRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setShowIframe(false);
  };

  const startChat = () => {
    setShowIframe(true);
  };
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          title="Retail Bot"
          onClick={toggleChatbot}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-[#d40029] w-16 h-16 rounded-full shadow-lg"
          aria-label="Open chatbot"
        >
          <MessageCircle className="w-8 h-8" />
        </Button>
      )}
      {isOpen && (
        <Draggable nodeRef={nodeRef} handle=".drag-handle">
          <div
            ref={nodeRef}
            className="drag-handle bg-white rounded-lg shadow-xl w-96 h-[600px] flex flex-col"
          >
            <div className=" flex justify-between items-center p-4 border-b cursor-move">
              <div>
                <h2 className="text-sm font-semibold">
                  AskAI : Your Digital Companion
                </h2>
                <p className="text-sm">Expert Help at Your Fingertips</p>
              </div>
              <Button
                onClick={toggleChatbot}
                variant="ghost"
                size="icon"
                aria-label="Close chatbot"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="flex-grow overflow-auto">
              {!showIframe ? (
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">
                    Welcome to our Chatbot!
                  </h3>
                  <p className="text-gray-600">
                    Our chatbot is here to assist you with any questions you may
                    have about our products and services. It can help you with:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Finding the right product for your needs</li>
                    <li>Answering frequently asked questions</li>
                    <li>Providing 24/7 customer support</li>
                  </ul>
                  <p className="text-gray-600">
                    Feel free to ask anything, and our chatbot will do its best
                    to assist you!
                  </p>
                  <Button
                    onClick={startChat}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-[#d40029] w-full mt-4"
                  >
                    Start Chatting <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <iframe
                    className="drag-handle"
                    src="https://d7xzwy4q8c7yd.cloudfront.net/index.html"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="microphone"
                    title="Chatbot"
                  />
                </>
              )}
            </div>
          </div>
        </Draggable>
      )}
    </div>
  );
}
