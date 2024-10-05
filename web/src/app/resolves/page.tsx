'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useReadContract } from "wagmi"
import { contract } from "@/lib/contract"
import MainLayout from "@/components/layouts/MainLayout"

const data = [
    {
        id: 1,
        title: "Sustainable Energy Solutions",
        href: "/grants/sustainable-energy",
        description:
            "Supporting innovative projects that promote renewable energy sources and reduce carbon footprint in local communities.",
        imageUrl:
            "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        date: "Apr 15, 2023",
        datetime: "2023-04-15",
        category: { title: "Environment", href: "#environment" },
        author: {
            name: "Emma Green",
            role: "Environmental Scientist",
            href: "#emma-green",
            imageUrl:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
    {
        id: 2,
        title: "Digital Literacy for Seniors",
        href: "/grants/digital-literacy-seniors",
        description:
            "Empowering senior citizens with essential digital skills to bridge the generational technology gap and improve their quality of life.",
        imageUrl:
            "https://images.unsplash.com/photo-1532635241-17e820acc59f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        date: "May 22, 2023",
        datetime: "2023-05-22",
        category: { title: "Education", href: "#education" },
        author: {
            name: "David Chen",
            role: "Education Technologist",
            href: "#david-chen",
            imageUrl:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
        },
    },
    {
        id: 3,
        title: "Urban Garden Initiative",
        href: "/grants/urban-garden-initiative",
        description:
            "Creating green spaces in urban areas to promote sustainable food production, community engagement, and improved mental health.",
        imageUrl:
            "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        date: "Jun 10, 2023",
        datetime: "2023-06-10",
        category: { title: "Community", href: "#community" },
        author: {
            name: "Sophia Rodriguez",
            role: "Urban Planner",
            href: "#sophia-rodriguez",
            imageUrl:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
    {
        id: 4,
        title: "Mental Health Awareness Campaign",
        href: "/grants/mental-health-awareness",
        description:
            "Launching a comprehensive mental health awareness program to reduce stigma, provide resources, and support those in need within the community.",
        imageUrl:
            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        date: "Jul 5, 2023",
        datetime: "2023-07-05",
        category: { title: "Health", href: "#health" },
        author: {
            name: "Dr. Alex Johnson",
            role: "Clinical Psychologist",
            href: "#alex-johnson",
            imageUrl:
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
    {
        id: 5,
        title: "Youth Entrepreneurship Program",
        href: "/grants/youth-entrepreneurship",
        description:
            "Fostering innovation and business skills in young adults through mentorship, workshops, and seed funding for startup ideas.",
        imageUrl:
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        date: "Aug 18, 2023",
        datetime: "2023-08-18",
        category: { title: "Business", href: "#business" },
        author: {
            name: "Michael Torres",
            role: "Business Incubator Director",
            href: "#michael-torres",
            imageUrl:
                "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
];

function daysLeftToDate(futureDate: any) {
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
}: {
    name: string | undefined;
    network: string | undefined;
    startDate: Date | undefined;
    endDate: Date | undefined;
    matchingPool: number | undefined;
    description: string | undefined;
    projectsCount: number | undefined;
}) => (
    <div className="bg-white shadow-none overflow-hidden a > { hover:opacity-90 transition hover:shadow-lg } w-full">
        <Link
            href={`/resolves/${name}`}
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
                <div

                    className="font-mono text-xs text-gray-900 whitespace-nowrap inline-flex max-w-full w-fit items-center justify-center px-2 py-1.5 bg-orange-100 rounded-full absolute top-3 right-3"
                >
                    active
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
    console.log(id, owner, matchingPool)

    // const { data, isLoading } = useReadContract({
    //     address: contract.address as `0x${string}`,
    //     abi: contract.abi,
    //     functionName: "rounds",
    //     args: [id],
    // })

    const data = null
    const isLoading = false


    return isLoading && !data ? <div>Loading...</div> :
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
                            {data && data?.[2] ? JSON.parse(data?.[2] as any)?.chain : 'Chain not available'}
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
                            {JSON.parse(data?.[2] as any)?.description || "No description available"}
                        </div>
                        <div className="flex gap-2 justfy-between items-center">
                            <div className="flex-1">
                                <div
                                    data-testid="apply-days-left"
                                    className="text-xs w-full font-mono whitespace-nowrap"
                                >
                                    Round Start Date:
                                    {JSON.parse(data?.[2] as any)?.startDate && JSON.parse(data?.[2] as any)?.startDate.toLocaleString()}
                                </div>
                                <div
                                    data-testid="days-left"
                                    className="text-xs w-full font-mono whitespace-nowrap"
                                >
                                    {daysLeftToDate(JSON.parse(data?.[2] as any)?.endDate)} Days Left to Apply
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
            </div></div>
}

export default function Index() {
    const [rounds, setRounds] = useState<{
        id: string;
        owner: string;
        matchingPool: number;
    }[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rounds`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setRounds(data);
            });
    }, []);


    return (
        <MainLayout>
            <div className="mb-5">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100">explore resolves</h1>
                    <Link href="/resolves/create" passHref>
                        <button className="px-6 py-3 bg-[#FF6B4A] rounded-full text-white font-semibold shadow-md hover:bg-orange-300 transition duration-300 ease-in-out">
                            Create resolve <svg className="pb-1 inline-block w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        </button>
                    </Link>
                </div>
                <div className="mt-5 mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {data.map((project, index) => (
                        <Card
                            key={index}
                            name={project.title}
                            network="Ethereum"
                            startDate={new Date()}
                            endDate={new Date()}
                            matchingPool={1000}
                            description={project.description}
                            projectsCount={3}
                        />
                    ))}
                    {rounds.map((round, index) => (
                        <RoundCard
                            key={index}
                            id={round.id}
                            owner={round.owner}
                            matchingPool={round.matchingPool}
                        />
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}