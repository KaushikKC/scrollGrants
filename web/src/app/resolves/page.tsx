"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useReadContract } from "wagmi";
import { contract } from "@/lib/contract";
import MainLayout from "@/components/layouts/MainLayout";
import { getRoundsData } from "@/lib/graphHelper/roundsData";

export function daysLeftToDate(futureDate: any) {
  const currentDate = new Date();
  const targetDate = new Date(futureDate);

  // Calculate the difference in milliseconds
  const diffTime = targetDate.getTime() - currentDate.getTime();

  // Convert milliseconds to days (1000 ms/s * 60 s/min * 60 min/hr * 24 hr/day)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

const Card = ({
  name,
  network,
  startDate,
  endDate,
  matchingPool,
  description,
  projectsCount,
  active,
  resolveId,
}: {
  name: string | undefined;
  network: string | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
  matchingPool: number | undefined;
  description: string | undefined;
  projectsCount: number | undefined;
  active: boolean | undefined;
  resolveId: string | undefined;
}) => (
  <div className="bg-white shadow-none overflow-hidden a > { hover:opacity-90 transition hover:shadow-lg } w-full">
    <Link
      href={`/resolves/${resolveId}`}
      data-testid="round-card"
      data-track-event="round-card"
      rel="noreferrer"
    >
      <div className="w-full relative">
        <div className="overflow-hidden h-32">
          <div
            className="bg-black blur w-[120%] h-[120%] -mt-4 -ml-4 brightness-[40%] object-cover"
            style={{
              backgroundImage: `url(/stock-photos/${Math.floor(
                Math.random() * 8
              )}.jpg)`,
            }}
          />
        </div>
        <div className="font-mono text-xs text-gray-900 whitespace-nowrap inline-flex max-w-full w-fit items-center justify-center px-2 py-1.5 bg-orange-100 rounded-full absolute top-3 right-3">
          {active ? "Active" : "Completed"}
        </div>
        <div
          data-testid="round-name"
          className="ml-2 w-full text-[24px] font-medium truncate pb-1 absolute bottom-1 px-2 text-white"
        >
          {name?.toLowerCase()}
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div
          data-testid="round-description"
          className="text-sm md:text-base text-ellipsis line-clamp-4 text-gray-400 leading-relaxed min-h-[96px]"
        >
          {description?.toLowerCase()}
        </div>
        <div className="flex gap-2 justfy-between items-center">
          <div className="flex-1">
            <div
              data-testid="apply-days-left"
              className="text-xs w-full font-mono whitespace-nowrap"
            >
              Round Start Date: {startDate && startDate.toLocaleString()}
            </div>
            <div
              data-testid="days-left"
              className="text-xs w-full font-mono whitespace-nowrap"
            >
              {daysLeftToDate(endDate)} Days Left to Apply
            </div>
          </div>
          <div
            color="blue"
            data-testid="round-badge"
            className="font-mono text-xs text-gray-900 whitespace-nowrap inline-flex max-w-full w-fit items-center justify-center px-2 py-1.5 bg-orange-100 rounded-lg"
          >
            QF
          </div>
        </div>
        <div className="border-t" />
        <div className="flex justify-between">
          <div className="flex gap-2">
            <div
              data-testid="approved-applications-count"
              className="text-xs text-gray-900 whitespace-nowrap inline-flex max-w-full w-fit items-center justify-center px-2 py-1.5 bg-gray-100 rounded-lg"
            >
              {projectsCount} projects
            </div>
            <div className="font-mono text-xs text-gray-900 whitespace-nowrap inline-flex max-w-full w-fit items-center justify-center px-2 py-1.5 bg-gray-100 rounded-lg">
              <span className="mr-1" data-testid="match-amount">
                <NumericFormat
                  value={matchingPool ? matchingPool : 0}
                  displayType="text"
                  thousandSeparator=","
                />
              </span>
              <span data-testid="match-token">ETH match</span>
            </div>
          </div>
          <div>
            <img
              className="w-8"
              src="blob:https://explorer.gitcoin.co/fa4da5dc-b789-48e6-a867-c2a54717d23a"
              alt=""
            />
          </div>
        </div>
      </div>
    </Link>
  </div>
);

const RoundCard = ({
  id,
  owner,
  matchingPool,
}: {
  id: string | undefined;
  owner: string | undefined;
  matchingPool: number | undefined;
}) => {
  console.log(id, owner, matchingPool);

  // const { data, isLoading } = useReadContract({
  //     address: contract.address as `0x${string}`,
  //     abi: contract.abi,
  //     functionName: "rounds",
  //     args: [id],
  // })

  const data = null;
  const isLoading = false;

  return isLoading && !data ? (
    <div>Loading...</div>
  ) : (
    <div>
      <div className="rounded-6xl bg-white shadow-none overflow-hidden a > { hover:opacity-90 transition hover:shadow-lg } w-full">
        <Link
          href={`/resolves/${id}`}
          data-testid="round-card"
          data-track-event="round-card"
          rel="noreferrer"
        >
          {/* {JSON.stringify(data)} */}
          <div className="w-full relative">
            <div className="overflow-hidden h-32">
              <div
                className="bg-black blur w-[120%] h-[120%] -mt-4 -ml-4 brightness-[40%] object-cover"
                style={{
                  backgroundImage: `url('https://picsum.photos/500')`,
                }}
              />
            </div>
            <div
              color="green"
              className="font-mono text-xs text-gray-900 whitespace-nowrap inline-flex max-w-full w-fit items-center justify-center px-2 py-1.5 bg-green-100 rounded-full absolute top-3 right-3"
            >
              {data && data?.[2]
                ? JSON.parse(data?.[2] as any)?.chain
                : "Chain not available"}
            </div>
            <div
              data-testid="round-name"
              className="w-full text-[24px] font-medium truncate pb-1 absolute bottom-1 px-2 text-white"
            >
              {JSON.parse(data?.[2] as any)?.projectName || "No name available"}
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div
              data-testid="round-description"
              className="text-sm md:text-base text-ellipsis line-clamp-4 text-gray-400 leading-relaxed min-h-[96px]"
            >
              {JSON.parse(data?.[2] as any)?.description ||
                "No description available"}
            </div>
            <div className="flex gap-2 justfy-between items-center">
              <div className="flex-1">
                <div
                  data-testid="apply-days-left"
                  className="text-xs w-full font-mono whitespace-nowrap"
                >
                  Round Start Date:
                  {JSON.parse(data?.[2] as any)?.startDate &&
                    JSON.parse(data?.[2] as any)?.startDate.toLocaleString()}
                </div>
                <div
                  data-testid="days-left"
                  className="text-xs w-full font-mono whitespace-nowrap"
                >
                  {daysLeftToDate(JSON.parse(data?.[2] as any)?.endDate)} Days
                  Left to Apply
                </div>
              </div>
              <div
                color="blue"
                data-testid="round-badge"
                className="font-mono text-xs text-gray-900 whitespace-nowrap inline-flex max-w-full w-fit items-center justify-center px-2 py-1.5 bg-blue-100 rounded-lg"
              >
                Quadratic Funding
              </div>
            </div>
            <div className="border-t" />
            <div className="flex justify-between">
              <div className="flex gap-2">
                <div
                  data-testid="approved-applications-count"
                  className="text-xs text-gray-900 whitespace-nowrap inline-flex max-w-full w-fit items-center justify-center px-2 py-1.5 bg-gray-100 rounded-lg"
                >
                  {0} projects
                </div>
                <div className="font-mono text-xs text-gray-900 whitespace-nowrap inline-flex max-w-full w-fit items-center justify-center px-2 py-1.5 bg-gray-100 rounded-lg">
                  <span className="mr-1" data-testid="match-amount">
                    <NumericFormat
                      value={JSON.parse(data?.[2] as any)?.matchingPool || 0}
                      displayType="text"
                      thousandSeparator=","
                    />
                  </span>
                  <span data-testid="match-token">USDC match</span>
                </div>
              </div>
              <div>
                <img
                  className="w-8"
                  src="blob:https://explorer.gitcoin.co/fa4da5dc-b789-48e6-a867-c2a54717d23a"
                  alt=""
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default function Index() {
  const [rounds, setRounds] = useState<
    {
      id: string;
      owner: string;
      matchingPool: number;
    }[]
  >([]);
  const [data, setData] = useState<any[]>([]);
  const getData = async () => {
    const data = await getRoundsData();
    setData(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <MainLayout>
      <div className="mb-5">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100">
            explore resolves
          </h1>
          <Link href="/resolves/create" passHref>
            <button className="px-6 py-3 bg-[#FF6B4A] rounded-full text-white font-semibold shadow-md hover:bg-orange-300 transition duration-300 ease-in-out">
              Create resolve{" "}
              <svg
                className="pb-1 inline-block w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </Link>
        </div>
        <div className="mt-5 mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {data.map((project, index) => (
            <Card
              key={index}
              name={project.roundName}
              network="Ethereum"
              startDate={new Date(project.startDate)}
              endDate={new Date(project.endDate)}
              matchingPool={parseInt(project.matchingAmount) / 10 ** 18}
              description={project.roundDescription}
              projectsCount={project.projects.length}
              active={project.isActive}
              resolveId={project.id}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
