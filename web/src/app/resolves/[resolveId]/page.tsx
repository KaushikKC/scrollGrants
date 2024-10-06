/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import MainLayout from "@/components/layouts/MainLayout";
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { usePopup } from "@/components/PopUpContext";
import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import Markdown from "react-markdown";
import { ThreeDots } from "react-loader-spinner";
import { contract } from "@/lib/contract";
import { useReadContract, useWriteContract } from "wagmi";
import { getRoundData } from "@/lib/graphHelper/roundData";
import { daysLeftToDate } from "../../../lib/daysLeft";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ORAAI_ABI, ORAAI_CONTRACT_ADDRESS } from "@/lib/const";
import { opSepoliaClient, opSepoliaPublicClient } from "@/lib/viem";

function DistributeFunds({ resolveId }: { resolveId: string }) {
  const { writeContract, isPending, isSuccess } = useWriteContract();

  const distributeFunds = async () => {
    writeContract({
      address: contract.address as `0x${string}`,
      abi: contract.abi,
      functionName: "distributeFunds",
      args: [parseInt(resolveId)],
    });
  };

  return (
    <button
      className={`text-white font-bold py-2 px-4 rounded ${
        isPending
          ? "bg-gray-400 cursor-not-allowed"
          : isSuccess
          ? "bg-green-500 hover:bg-green-600"
          : "bg-orange-500 hover:bg-orange-600"
      }`}
      onClick={distributeFunds}
      disabled={isPending}
    >
      {isPending ? (
        <div className="flex items-center">
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </div>
      ) : isSuccess ? (
        "Funds Distributed!"
      ) : (
        "Distribute Funds"
      )}
    </button>
  );
}

export default function Page({ params }: { params: { resolveId: string } }) {
  const [data, setData] = useState<any>(null);

  const { resolveId } = params;

  const fetchRoundData = async () => {
    const value = await getRoundData(parseInt(resolveId));
    console.log(value);
    setData(value);
  };
  useEffect(() => {
    fetchRoundData();
  }, []);

  const isDataLoading = false;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    [
      {
        text: "Hello! I am your Grant assistant.Lemme get you the projects in this round for you !",
        isUser: false,
      },
    ]
  );
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, isUser: true }]);
      const prompt = inputMessage;
      setInputMessage("");
      // Simulate bot response
      setLoading(true);
      const gasFee = await opSepoliaPublicClient.readContract({
        address: ORAAI_CONTRACT_ADDRESS,
        abi: ORAAI_ABI,
        functionName: "estimateFee",
        args: [11],
      });
      console.log(gasFee);

      const appendedMessage = JSON.stringify(data) + " " + prompt;
      const txHash = await opSepoliaClient.writeContract({
        address: ORAAI_CONTRACT_ADDRESS,
        abi: ORAAI_ABI,
        functionName: "calculateAIResult",
        args: [11, appendedMessage],
        value: gasFee as bigint,
      });

      const pollResult = async () => {
        const result = await opSepoliaPublicClient.readContract({
          address: ORAAI_CONTRACT_ADDRESS,
          abi: ORAAI_ABI,
          functionName: "getAIResult",
          args: [11, appendedMessage],
        });

        console.log(result);
        if (
          result &&
          result !== "" &&
          result !== undefined &&
          result !== null
        ) {
          setLoading(false);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: result as string,
              isUser: false,
            },
          ]);

          clearInterval(pollingInterval);
        } else {
          console.log("Result not ready, continuing to poll...");
        }
      };

      // Start polling every 5 seconds
      const pollingInterval = setInterval(pollResult, 5000);
    }
  };

  if (isDataLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-orange-500">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-white mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading resolve...</p>
        </div>
      </div>
    );
  } else {
    return (
      <MainLayout>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-x-2 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {data && data.roundName ? data.roundName : "Resolve Name"}
              </h1>
              <div className="mt-5 flex items-center mb-6">
                <span className="text-base font-medium text-gray-900">
                  on Scroll Network
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center space-x-2">
            <div className="col-span-2 flex justify-between items-stretch mb-6 space-x-2">
              <div className="bg-gray-200 rounded-lg p-6 flex flex-col justify-between">
                <span className="text-2xl font-semibold text-gray-900">
                  {data && data.matchingAmount
                    ? parseInt(data.matchingAmount) / 10 ** 18
                    : 0}
                  ETH
                </span>
                <span className="mt-2 block text-base text-gray-900">
                  Matching Pool
                </span>
              </div>
              <div className="rounded-lg text-sm bg-gray-200 text-gray-600 text-center flex flex-col justify-center p-6">
                <div>
                  Applications close in{" "}
                  <span className="font-semibold">
                    {data && !data.isActive
                      ? "closed"
                      : data && data.endDate
                      ? `${daysLeftToDate(data.endDate)}Days`
                      : "N/A"}{" "}
                  </span>
                </div>
              </div>
              <Link
                href={`/projects/create?resolveId=${resolveId}`}
                className="bg-orange-200 rounded-lg p-6 text-orange-800 font-semibold flex items-center justify-center"
              >
                Apply now!
              </Link>
            </div>
          </div>
        </div>

        <div className="col-span-8 mb-6">
          <div className="flex items-center mb-2">
            <svg
              className="w-5 h-5 text-gray-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm text-gray-600">Apply</span>
            <span className="mx-2">
              <CalendarIcon className="w-5 h-5 text-gray-500 ml-auto" />
            </span>
            <span className="text-sm text-gray-900 font-medium">
              {data && data.startDate && data.endDate ? (
                <>
                  {new Date(data.startDate).toLocaleDateString()} -{" "}
                  {new Date(data.endDate).toLocaleDateString()}
                </>
              ) : (
                "N/A"
              )}
            </span>
          </div>

          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-gray-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm text-gray-600">Donate</span>
            <span className="mx-2">
              <CalendarIcon className="w-5 h-5 text-gray-500 ml-auto" />
            </span>
            <span className="text-sm text-gray-900 font-medium">
              {data && data.startDate && data.endDate ? (
                <>
                  {new Date(data.startDate).toLocaleDateString()} -{" "}
                  {new Date(data.endDate).toLocaleDateString()}
                </>
              ) : (
                "N/A"
              )}
            </span>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            Quadratic Funding
          </span>
          {data && data.isActive ? (
            <DistributeFunds resolveId={resolveId} />
          ) : (
            <div className="text-white font-bold py-2 px-4 rounded bg-green-400 cursor-not-allowed">
              Funds Distributed
            </div>
          )}
        </div>

        <p className="text-base text-gray-900 mb-6 mt-3">
          {data && data.roundDescription
            ? data.roundDescription
            : "No description available"}
        </p>

        <div className="my-10 w-full border-b border-gray-200" />

        <div>
          <h1 className="text-2xl">Explore Projects</h1>
          <div className="mx-auto mt-5 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {data &&
              data.projects.map((project: any, index: any) => (
                <Card key={index} {...project} />
              ))}
          </div>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-4 right-4 z-10"
          aria-label="Open chat"
        >
          &#128172; Open Chat
        </Button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-md rounded-lg shadow-lg overflow-hidden bg-black">
              <div className=" p-4  flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">ORA Genie</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsModalOpen(false)}
                  className=" hover:text-white hover:bg-red-500 text-white"
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
                          ? "bg-gray-400 text-white"
                          : "bg-stone-500 text-white"
                      }`}
                    >
                      {message.text}
                    </span>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start mb-2">
                    <div className="bg-stone-500 text-white p-2 rounded-lg flex items-center space-x-2">
                      <span>Thinking</span>
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: "0s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
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
      </MainLayout>
    );
  }
}

const Card: React.FC<any> = ({
  projectName,
  logoUrl,
  coverUrl,
  projectDescription,
  id,
}) => {
  const { setPopupData, togglePopupVisibility } = usePopup();

  const handleClick = () => {
    setPopupData(projectName || "");
    togglePopupVisibility(true); // Show the popup
  };

  return (
    <Link
      href={`/projects/${id}`}
      className="bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative overflow-hidden" onClick={handleClick}>
        <img
          className="w-full h-48 object-cover"
          src={coverUrl}
          alt="Project Banner"
        />
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <img
          className="absolute top-4 left-4 w-16 h-16 rounded-full border-4 border-white shadow-lg"
          src={logoUrl}
          alt="Profile"
        />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white truncate">
            {projectName}
          </h3>
        </div>
      </div>
      <div className="p-4">
        <div className="text-sm text-gray-600 line-clamp-3 h-18 overflow-hidden">
          {projectDescription}
        </div>
      </div>
    </Link>
  );
};
