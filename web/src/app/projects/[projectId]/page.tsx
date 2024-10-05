/* eslint-disable @next/next/no-img-element */
"use client";

import {
  CalendarIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

import MainLayout from "@/components/layouts/MainLayout";
import Link from "next/link";
import { RotatingLines } from "react-loader-spinner";
import { use, useEffect, useState } from "react";

import { useAccount, useWriteContract } from "wagmi";
import { contract } from "@/lib/contract";
import { useSearchParams } from "next/navigation";
import { getProjectData } from "@/lib/graphHelper/project";
import { daysLeftToDate } from "@/app/resolves/page";
import { parseEther } from "viem";
import { client } from "@/lib/viem";
// import { client } from "@/lib/viem";

function ClaimFundsButton({
  resolveId,
  projectId,
}: {
  resolveId: string;
  projectId: string;
}) {
  const {
    writeContract,
    isPending: isLoading,
    isSuccess,
    isError,
    error,
  } = useWriteContract();

  const claimFunds = async () => {
    try {
      writeContract({
        address: contract.address as `0x${string}`,
        abi: contract.abi,
        functionName: "withdrawProjectFunds",
        args: [BigInt(resolveId as string), BigInt(projectId as string)],
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={claimFunds}
        disabled={isLoading}
        className={` w-full flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#FF6B4A] text-gray-700 hover:bg-gray-50"
        }`}
      >
        {isLoading ? "Claiming..." : "Claim Rewards"}
      </button>
      {isSuccess && (
        <p className="mt-2 text-sm text-green-600">
          Funds claimed successfully!
        </p>
      )}
      {isError && (
        <p className="mt-2 text-sm text-red-600">Error: {error?.message}</p>
      )}
    </div>
  );
}

function TopUpButton({ topUpAmount }: { topUpAmount: string }) {
  const {
    writeContract,
    isPending: isLoading,
    isSuccess,
    isError,
    error,
  } = useWriteContract();

  const claimFunds = async () => {
    try {
      writeContract({
        address: contract.address as `0x${string}`,
        abi: contract.abi,
        functionName: "topUpBalance",
        value: parseEther(topUpAmount),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={claimFunds}
        disabled={isLoading}
        className={`bg-[#FF6B4A] w-full flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#FF6B4A] text-gray-700 hover:bg-gray-50"
        }`}
      >
        {isLoading ? "processing..." : "Top Up"}
      </button>
      {isSuccess && (
        <p className="mt-2 text-sm text-green-600">TopUp successfully!</p>
      )}
      {isError && (
        <p className="mt-2 text-sm text-red-600">Error: {error?.message}</p>
      )}
    </div>
  );
}

function ContributeButton({
  contributeAmount,
  projectId,
  roundId,
}: {
  contributeAmount: string;
  projectId: string;
  roundId: string;
}) {
  const {
    writeContract,
    isPending: isLoading,
    isSuccess,
    isError,
    error,
  } = useWriteContract();

  const contribute = async () => {
    try {
      writeContract({
        address: contract.address as `0x${string}`,
        abi: contract.abi,
        functionName: "donate",
        args: [
          BigInt(roundId),
          BigInt(projectId),
          parseEther(contributeAmount),
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={contribute}
        disabled={isLoading}
        className={`bg-[#FF6B4A] w-full flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#FF6B4A] text-gray-700 hover:bg-gray-50"
        }`}
      >
        {isLoading ? "processing..." : "Contribute"}
      </button>
      {isSuccess && (
        <p className="mt-2 text-sm text-green-600">Contributed successfully!</p>
      )}
      {isError && (
        <p className="mt-2 text-sm text-red-600">Error: {error?.message}</p>
      )}
    </div>
  );
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Page({ params }: { params: { projectId: string } }) {
  const searchParams = useSearchParams();
  const resolveId = searchParams.get("resolveId");

  const [currentTab, setCurrentTab] = useState("Project Details");
  const [tabs, setTabs] = useState([
    { name: "Project Details", current: true },
    { name: "Code Metrics", current: false },
    { name: "On-Chain Metrics", current: false },
  ]);
  const [projectOSOData, setProjectOSOData] = useState<any>({});
  const [projectOSODataLoading, setProjectOSODataLoading] = useState(false);
  const [contributeLoading, setContributeLoading] = useState(false);

  // Update current tab based on the currentTab state
  useEffect(() => {
    // update current tab based on the currentTab state
    setTabs((tabs) =>
      tabs.map((tab) => {
        if (tab.name === currentTab) {
          return {
            ...tab,
            current: true,
          };
        }
        return {
          ...tab,
          current: false,
        };
      })
    );
  }, [currentTab]);

  const { projectId } = params;
  const ids = splitString(projectId as string);

  const {
    writeContract,
    isPending: isLoading,
    isSuccess,
    isError,
    error,
  } = useWriteContract();

  const [amount, setAmount] = useState("0");
  function splitString(input: string, delimiter: string = "-"): string[] {
    return input.split(delimiter);
  }
  const contribute = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setContributeLoading(true);
    console.log("Creating project...");
    const ids = splitString(projectId as string);
    try {
      writeContract({
        address: contract.address as `0x${string}`, // Replace with the actual contract address
        abi: contract.abi,
        functionName: "donate",
        args: [
          BigInt(ids[0] as string), // roundId
          BigInt(ids[1]), // projectId - replace with actual project ID
          BigInt(100), // amount - replace with actual amount
        ],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setContributeLoading(false);
    }
  };

  // Getting project data from graph
  const [project, setProject] = useState<any>({});
  const getProjectDataFromGraph = async () => {
    console.log();
    const data = await getProjectData(projectId.toString());
    setProject(data);
    console.log(data);
  };
  useEffect(() => {
    getProjectDataFromGraph();
  }, [projectId]);

  // Top up

  const [topUpAmount, setTopUpAmount] = useState("0");

  //Fetch Balance
  const [balance, setBalance] = useState("0");

  //   const account = "0xd69a4dd0dfb261a8EF37F45925491C077EF1dBFb";
  const account = useAccount().address;
  const BalanceFetching = async () => {
    const fetchBalance = await client.readContract({
      address: contract.address as `0x${string}`,
      abi: contract.abi,
      functionName: "balances",
      args: [account],
    });
    if (fetchBalance) {
      console.log(fetchBalance);
      setBalance(fetchBalance.toString());
    }
  };

  useEffect(() => {
    if (account) {
      BalanceFetching();
    }
  }, [account]);

  //   useEffect(() => {
  //     console.log(error);
  //   }, [isError]);

  return (
    <MainLayout>
      <div className="max-w-7xl">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="relative h-64 sm:h-80 md:h-96">
            <img
              src={project && project.coverUrl}
              alt="Project cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end">
              <img
                src={
                  project && project.logoUrl
                    ? project.logoUrl
                    : "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80"
                }
                alt={project && project.projectName}
                className="h-20 w-20 rounded-full border-4 border-white mr-4"
              />
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {project && project.projectName}
                </h1>
                <p className="text-lg text-gray-200">
                  {project && project.projectDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 784.37 1277.39"
                  className="mr-2"
                >
                  {/* ... (keep the existing SVG content) */}
                </svg>
                <span className="text-gray-700">
                  {project && project.owner
                    ? `${project.owner.slice(0, 6)}...${project.owner.slice(
                        -6
                      )}`
                    : "Owner information not available"}
                </span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-700">Created on: July 16, 2024</span>
              </div>
              <div className="flex items-center">
                <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-2" />
                <Link
                  href={`https://metaverse.career/home`}
                  target="_blank"
                  passHref
                  className="text-primary-600 hover:underline"
                >
                  {project && project.website}
                </Link>
              </div>
              <div className="flex items-center">
                <svg
                  fill="#9ca3af"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 mr-2"
                >
                  <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
                </svg>
                <Link
                  href={`https://x.com/metaverseai`}
                  target="_blank"
                  passHref
                  className="text-primary-600 hover:underline"
                >
                  {project && project.twitterUrl}
                </Link>
              </div>
              {project && project.round && !project.round.isActive && (
                <ClaimFundsButton resolveId={"0"} projectId={"1"} />
              )}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setCurrentTab(tab.name)}
                    className={classNames(
                      tab.current
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                      "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                    )}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Project Details */}
                {currentTab === "Project Details" && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">
                      About {project && project.projectName}
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {project && project.projectDescription}
                    </p>
                    <h3 className="text-xl font-semibold mb-4">
                      Additional Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700">
                          Funding Sources
                        </h4>
                        <p className="text-gray-600">None</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Team Size</h4>
                        <p className="text-gray-600">
                          {(project && project.teamSize) || 1}
                        </p>
                      </div>
                    </div>
                    <div className="mt-8 font-bold">
                      ** Kidly Top up first to Contribute to a project **
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="topUpAmount"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Top Up Amount
                      </label>
                      <div className="relative rounded-md shadow-sm mb-4">
                        <input
                          type="text"
                          name="topUpAmount"
                          id="topUpAmount"
                          className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md h-6"
                          placeholder="0.00"
                          aria-describedby="topUpAmount-currency"
                          value={topUpAmount}
                          onChange={(e) => setTopUpAmount(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span
                            className="text-gray-500 sm:text-sm"
                            id="topUpAmount-currency"
                          >
                            ETH
                          </span>
                        </div>
                      </div>
                      <TopUpButton topUpAmount={topUpAmount} />
                    </div>
                  </div>
                )}

                {/* Code Metrics */}
                {currentTab === "Code Metrics" && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">
                      Code Metrics
                    </h2>
                    {!projectOSODataLoading && projectOSOData && (
                      <div className="grid grid-cols-2 gap-6">
                        {/* ... (keep the existing code metrics content) */}
                      </div>
                    )}
                  </div>
                )}

                {/* On-Chain Metrics */}
                {currentTab === "On-Chain Metrics" && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">
                      On-Chain Metrics
                    </h2>
                    {!projectOSODataLoading && projectOSOData && (
                      <div className="grid grid-cols-2 gap-6">
                        {/* ... (keep the existing on-chain metrics content) */}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Contribute Section */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">Contribute</h2>
                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">
                        Funding received in current round
                      </p>
                      <p className="text-2xl font-bold text-primary-600">
                        {project && parseInt(project.totalDonations) / 10 ** 18}{" "}
                        ETH
                      </p>
                    </div>
                    {/* <div>
                      <p className="text-sm text-gray-500">Contributors</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {project && project.donors ? project.donors.length : 0}
                      </p>
                    </div> */}
                    <div>
                      <p className="text-sm text-gray-500">Time remaining</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {project && project.round && project.round.endDate
                          ? `${daysLeftToDate(project.round.endDate)} days`
                          : "0 days"}
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Contribution Amount
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="text"
                        name="amount"
                        id="amount"
                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                        aria-describedby="amount-currency"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span
                          className="text-gray-500 sm:text-sm"
                          id="amount-currency"
                        >
                          ETH
                        </span>
                      </div>
                    </div>

                    <div>
                      Available Balance : {parseInt(balance) / 10 ** 18} ETH
                    </div>
                  </div>
                  <button
                    type="submit"
                    onClick={contribute}
                    className="w-full flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 mb-2"
                  >
                    {contributeLoading ? (
                      <div className="flex items-center justify-center">
                        <span>Contributing...</span>
                        <RotatingLines
                          visible={true}
                          width="20"
                          strokeColor="#ffffff"
                          strokeWidth="5"
                          animationDuration="0.75"
                          ariaLabel="rotating-lines-loading"
                        />
                      </div>
                    ) : (
                      <span>Contribute</span>
                    )}
                  </button>
                  <ContributeButton
                    projectId={ids[1]}
                    roundId={ids[0]}
                    contributeAmount={amount.toString()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
