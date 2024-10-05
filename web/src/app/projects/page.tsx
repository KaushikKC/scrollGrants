/* eslint-disable @next/next/no-img-element */
"use client";

import MainLayout from "@/components/layouts/MainLayout"
import { contract } from "@/lib/contract"
import { usePopup } from "@/components/PopUpContext";

interface Project {
    network: string;
    name: string;
    openSourceObserverName: string;
    website: string;
    projectLogoUrl: string;
    projectCoverUrl: string;
    description: string;
    createdDate: string; // ISO 8601 format date
    twitterUrl: string;
    ownerAddress: string;
    fundingSources: string;
    teamSize: number;
}

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
];

const Card: React.FC<Project> = ({
    name,
    projectLogoUrl,
    projectCoverUrl,
    description,
}) => {
    const { setPopupData, togglePopupVisibility } = usePopup();

    const handleClick = () => {
        setPopupData(name || "");
        togglePopupVisibility(true); // Show the popup
    };

    return (
        <div className="bg-white shadow-lg overflow-hidden w-full hover:opacity-90 transition hover:shadow-none hover:cursor-pointer">
            <div onClick={handleClick}>
                <div className="w-full relative">
                    <div>
                        <img
                            className="bg-black h-[120px] w-full object-cover rounded-t"
                            src={projectCoverUrl}
                            alt="Project Banner"
                        />
                    </div>
                </div>
                <div className="p-4 space-y-4 relative">
                    <img
                        className="object-cover rounded-full border-solid border-2 border-white absolute -top-[24px]"
                        src={projectLogoUrl}
                        alt="Profile"
                        style={{ height: 48, width: 48 }}
                    />
                    <div className="truncate mt-4">{name}</div>
                    <div className="text-sm md:text-base text-ellipsis line-clamp-4 text-grey-400 leading-relaxed min-h-[96px]">
                        <div className="text-sm line-clamp-4">{description}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ProjectsIndex() {
    return (
        <MainLayout>
            <div className="my-10">
                <h1 className="text-5xl font-bold">Explore Projects</h1>
                <div className="mx-auto mt-5 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {projects.map((project, index) => (
                        <Card key={index} {...project} />
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
