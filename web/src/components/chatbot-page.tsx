"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ChatbotPageComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hello! How can I assist you today?", isUser: false },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, isUser: true }])
      setInputMessage("")
      // Simulate bot response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Thank you for your message. How else can I help you?", isUser: false },
        ])
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Our Website</h1>
      <p className="mb-4">This is a dummy page to demonstrate the chatbot feature.</p>
      
      <Button 
        onClick={() => setIsModalOpen(true)} 
        className="fixed bottom-4 right-4 z-10"
        aria-label="Open chat"
      >
        &#128172; Open Chat
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-primary p-4 text-white flex justify-between items-center">
              <h2 className="text-lg font-semibold">Chat with us</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsModalOpen(false)} 
                className="text-white hover:text-gray-200"
                aria-label="Close chat"
              >
                &times;
              </Button>
            </div>
            <ScrollArea className="h-80 p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    message.isUser ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      message.isUser
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {message.text}
                  </span>
                </div>
              ))}
            </ScrollArea>
            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex space-x-2"
              >
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit" aria-label="Send message">
                  Send
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}