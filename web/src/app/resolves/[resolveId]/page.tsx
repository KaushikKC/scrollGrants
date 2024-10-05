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
import { daysLeftToDate } from "../page";

const projects = [
  {
    network: "Ethereum",
    name: "MesonFi",
    openSourceObserverName: "MesonFi",
    website: "https://meson.fi/",
    projectLogoUrl:
      "https://docs.meson.fi/~gitbook/image?url=https%3A%2F%2F1966107664-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FWJ9Xuoax4XwtI4AskpIb%252Ficon%252FL1gVbDPzMVPwHEi51o4W%252Flogo192.png%3Falt%3Dmedia%26token%3D4f3d4d82-dd19-4ddb-b9ce-eaa23cfdb32f&width=32&dpr=1&quality=100&sign=a1a21306&sv=1",
    projectCoverUrl:
      "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    description:
      "MesonFi is a decentralized finance platform that allows users to earn interest on their crypto assets.",
    createdDate: "2024-07-16T00:00:00.000Z",
    twitterUrl: "https://twitter.com/mesonfi",
    ownerAddress: "0xD1Ffeuo47briwgyfwi7b4749gbwig979bh6Caa",
    fundingSources: "None",
    teamSize: 1,
  },
  {
    network: "Ethereum",
    name: "Mean Finance",
    openSourceObserverName: "Mean Finance",
    website: "https://www.meanfi.com/",
    projectLogoUrl:
      "https://firebasestorage.googleapis.com/v0/b/standards-site-beta.appspot.com/o/documents%2Foeiyd2iaxj1%2Fn6qzjbhgm41%2FInstagram%20post%20-%202_1703711275815_1000x1000.png?alt=media&token=evthxq3nrct",
    projectCoverUrl:
      "https://firebasestorage.googleapis.com/v0/b/standards-site-beta.appspot.com/o/documents%2Foeiyd2iaxj1%2Fn6qzjbhgm41%2FBackground%20m%20(11)_1703709966262_1000x1000.png?alt=media&token=qdeg1w8omym",
    description:
      "Mean Finance is a financial ecosystem of products, platforms, and people coming together around a common goal: To accelerate the world’s transition to decentralized finance ecosystems and bring economic equality and opportunity to individuals and organizations everywhere.",
    createdDate: "2024-07-16T00:00:00.000Z",
    twitterUrl: "https://twitter.com/meanfinance",
    ownerAddress: "0xD1Ffeuo47briwgyfwi7b4749gbwig979bh6Caa",
    fundingSources: "Google",
    teamSize: 45,
  },
  {
    network: "Ethereum",
    name: "Maverick",
    openSourceObserverName: "Maverick",
    website: "https://www.mav.xyz/",
    projectLogoUrl:
      "https://docs.mav.xyz/~gitbook/image?url=https%3A%2F%2F3522878855-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F1irpxOULWWoYXAKrwP4H%252Ficon%252Fb8lZ7Er8bK0ImnSi5Pun%252Fmav-symbol-color.png%3Falt%3Dmedia%26token%3Dd3007dee-7574-473e-9713-c1647a08f2f5&width=32&dpr=1&quality=100&sign=8c64fb19&sv=1",
    projectCoverUrl:
      "https://docs.mav.xyz/~gitbook/image?url=https%3A%2F%2F3522878855-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F1irpxOULWWoYXAKrwP4H%252Fuploads%252Ffbh8VV1ftsODHaUwxGXQ%252FUpdated%2520Litepaper%2520Banner.png%3Falt%3Dmedia%26token%3D76b414ee-cc2d-4893-88aa-93e57be52f6f&width=768&dpr=1&quality=100&sign=423de1ed&sv=1",
    description:
      "Maverick Protocol offers a new infrastructure for decentralized finance, built to facilitate the most liquid markets for traders, liquidity providers, DAO treasuries, and developers, powered by a revolutionary Automated Market Maker (AMM).",
    createdDate: "2024-07-16T00:00:00.000Z",
    twitterUrl: "https://x.com/mavprotocol",
    ownerAddress: "0xD1Ffeuo47briwgyfwi7b4749gbwig979bh6Caa",
    fundingSources: "Coinbase",
    teamSize: 76,
  },
];

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
  const [show, setShow] = useState(false);
  const [chatResponse, setChatResponse] = useState(null);
  const [gaiaLoading, setGaiaLoading] = useState(false);
  const [query, setQuery] = useState("");
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
                    {data && data.endDate
                      ? daysLeftToDate(data.endDate)
                      : "N/A"}{" "}
                    Days
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
          <DistributeFunds resolveId={resolveId} />
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

        <div className="fixed bottom-5 right-5">
          <button
            onClick={() => setShow(true)}
            className="px-5 py-3 flex items-center justify-center gap-x-2 bg-primary-600 rounded-full"
          >
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
            <span className="text-white font-semibold text-lg">OnlyChat</span>
          </button>
        </div>

        {/* Chat popup start */}
        <div
          aria-live="assertive"
          className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
        >
          <div className="flex w-full flex-col items-center space-y-4 sm:items-end absolute bottom-5 right-5 z-50">
            <Transition show={show}>
              <div className="pointer-events-auto w-full h-[500px] max-w-sm rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
                <div className="p-4 relative">
                  <div className="absolute -top-4 -right-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShow(false);
                      }}
                      className="p-1 inline-flex bg-white text-gray-400 border border-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Chat UI start */}
                  <div className="flex flex-col h-[470px]">
                    <div className="flex-1 overflow-y-scroll">
                      {!gaiaLoading ? (
                        chatResponse ? (
                          <div>
                            <div className="flex items-start gap-2.5">
                              <img
                                className="w-8 h-8 rounded-full"
                                src="https://docs.gaianet.ai/img/icon-white.png"
                                alt="Gaia"
                              />
                              <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl">
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                  <span className="text-sm font-semibold text-gray-900">
                                    GaiaNet
                                  </span>
                                  <span className="text-xs font-normal text-gray-500">
                                    {new Date().toLocaleTimeString()}
                                  </span>
                                </div>
                                <div className="text-sm font-normal py-2.5 text-gray-900">
                                  <Markdown>{chatResponse}</Markdown>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2.5">
                            <img
                              className="w-8 h-8 rounded-full"
                              src="https://docs.gaianet.ai/img/icon-white.png"
                              alt="Gaia"
                            />
                            <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl">
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <span className="text-sm font-semibold text-gray-900">
                                  GaiaNet
                                </span>
                                <span className="text-xs font-normal text-gray-500">
                                  {new Date().toLocaleTimeString()}
                                </span>
                              </div>
                              <div className="text-sm font-normal py-0.5 text-gray-900">
                                Hi! How can I help you today?
                              </div>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="flex items-start gap-2.5">
                          <img
                            className="w-8 h-8 rounded-full"
                            src="https://docs.gaianet.ai/img/icon-white.png"
                            alt="Gaia"
                          />
                          <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <span className="text-sm font-semibold text-gray-900">
                                GaiaNet
                              </span>
                              <span className="text-xs font-normal text-gray-500">
                                {new Date().toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="text-sm font-normal pt-0.5 px-1 text-gray-900">
                              <ThreeDots
                                visible={true}
                                height="30"
                                width="30"
                                color="#16a34a"
                                radius="9"
                                wrapperStyle={{}}
                                ariaLabel="rotating-lines-loading"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-col items-center gap-2.5 justify-center">
                      <input
                        type="text"
                        className="flex-1 rounded-md border border-gray-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full"
                        placeholder="Ask the GaiaGenie to suggest you projects to fund !"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
        {/* Chat popup end */}
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
