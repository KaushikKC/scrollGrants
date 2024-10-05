"use client";
import { getRoundData } from "@/lib/graphHelper/roundData";
import { getRoundsData } from "@/lib/graphHelper/roundsData";

export default function pages() {
  return (
    <div className="">
      <div className="flex justify-center items-center">
        <button
          className="bg-red-700 p-4"
          onClick={async () => {
            await getRoundsData();
          }}
        >
          Get rounds
        </button>

        <button
          className="bg-red-700 p-4"
          onClick={async () => {
            const data = await getRoundData(2);
            console.log(data);
          }}
        >
          Get round
        </button>
      </div>
    </div>
  );
}
