"use client";
import { useState, useEffect } from "react";
import { RotatingLines } from "react-loader-spinner";
import DatePicker from "react-datepicker";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useWriteContract } from "wagmi";
import { toast } from "react-toastify";
import MainLayout from "@/components/layouts/MainLayout";
import { contract } from "@/lib/contract";
import { parseEther } from "viem";

import "react-datepicker/dist/react-datepicker.css";

export default function CreateRound() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const {
    writeContract,
    isPending: isLoading,
    isSuccess,
    isError,
    error,
  } = useWriteContract();

  const handleCreateRound = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.currentTarget);
    const roundData = {
      roundName: formData.get("roundName") as string,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      matchingPool: formData.get("matchingPool") as string,
      description: formData.get("description") as string,
    };

    console.log(roundData);

    try {
      writeContract({
        address: contract.address as `0x${string}`, // Replace with the actual contract address
        abi: contract.abi,
        functionName: "createRound",
        args: [parseEther(roundData.matchingPool), JSON.stringify(roundData)],
        value: parseEther(roundData.matchingPool), // Send the matching pool amount as value
      });
    } catch (error) {
      console.error("Error creating round:", error);
    }
  };

  // Add useEffect to handle contract write states
  useEffect(() => {
    if (isSuccess) {
      toast.success("Round created successfully!");
      alert("Round created successfully!");
      // Optionally, reset form or redirect user
    }
    if (isError) {
      toast.error(
        `Failed to create round: ${error?.message || "Unknown error"}`
      );
      alert(`Failed to create round: ${error?.message || "Unknown error"}`);
    }
  }, [isSuccess, isError, error]);

  return (
    <MainLayout>
      <div className="mx-auto">
        <div className="space-y-10 divide-y divide-gray-900/10">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h1 className="text-3xl font-semibold leading-7 text-gray-900">
                Create a new resolve
              </h1>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>

            <form
              onSubmit={handleCreateRound}
              className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            >
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="roundName"
                      className="block text-xl font-medium leading-6 text-gray-900"
                    >
                      <h1>Resolve Name</h1>
                    </label>
                    <div className="mt-2">
                      <input
                        id="roundName"
                        name="roundName"
                        type="text"
                        placeholder="What's the project name?"
                        className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="website"
                      className="block text-xl font-medium leading-6 text-gray-900"
                    >
                      <h1>Timeline</h1>
                    </label>
                    <div className="sm:mt-0 w-full grid grid-cols-2 gap-x-5">
                      <div className="mt-2">
                        <label
                          htmlFor="startDate"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Start Date
                        </label>
                        <div className="relative mt-2 sm:mt-0 w-full">
                          <DatePicker
                            selected={startDate}
                            onChange={(date: any) =>
                              setStartDate(date || new Date())
                            }
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            className=" pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <label
                          htmlFor="endDate"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          End Date
                        </label>
                        <div className="relative mt-2 sm:col-span-2 sm:mt-0 sm:max-w-md">
                          <DatePicker
                            selected={endDate}
                            onChange={(date: any) =>
                              setEndDate(date || new Date())
                            }
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="matchingPool"
                      className="block text-xl font-medium leading-6 text-gray-900"
                    >
                      <h1>Matching Pool (USDC)</h1>
                    </label>
                    <div className="mt-2">
                      <input
                        id="matchingPool"
                        name="matchingPool"
                        type="string"
                        placeholder="Enter matching pool amount"
                        className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="description"
                      className="block text-xl font-medium leading-6 text-gray-900"
                    >
                      <h1>Resolve Description</h1>
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        defaultValue={""}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      Write a few sentences about the resolve.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#FF6B4A] rounded-full text-white font-semibold shadow-md hover:bg-orange-300 transition duration-300 ease-in-out"
                >
                  {isLoading ? (
                    <div>
                      <span>Creating resolve</span>
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
                    <span>Create resolve</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
