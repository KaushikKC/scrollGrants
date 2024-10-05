"use client";
import { useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import MainLayout from "@/components/layouts/MainLayout";
import { contract } from "@/lib/contract";
import { useWriteContract } from "wagmi";

export default function Page({ params }: { params: { resolveId: string } }) {
  // const resolveId = params?.resolveId
  const resolveId = "0";
  const [projectName, setProjectName] = useState("");
  const [osoName, setOsoName] = useState("");
  const [website, setWebsite] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [teamSize, setTeamSize] = useState("4");
  const [projectDescription, setProjectDescription] = useState("");
  const [createProjectLoading, setCreateProjectLoading] = useState(false);

  const { writeContract, isPending, isSuccess } = useWriteContract();

  const createProject = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setCreateProjectLoading(true);

    const projectData = {
      projectName,
      osoName,
      website,
      twitterUrl,
      logoUrl,
      coverUrl,
      teamSize,
      projectDescription,
      resolveId,
    };

    console.log("Project Data:", JSON.stringify(projectData, null, 2));

    try {
      // Call the contract to create the project
      writeContract({
        address: contract.address as `0x${string}`, // Replace with the actual contract address
        abi: contract.abi,
        functionName: "applyForRound",
        args: [parseInt(projectData.resolveId), JSON.stringify(projectData)],
      });
      console.log("Project created successfully.");
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setCreateProjectLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto my-16">
        <div className="space-y-10 divide-y divide-gray-900/10">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h1 className="text-3xl font-semibold leading-7 text-gray-900">
                Create a new Project
              </h1>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>

            <form
              onSubmit={createProject}
              className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            >
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4"></div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="projectName"
                      className="block text-xl font-medium leading-6 text-gray-900"
                    >
                      <h1>Project Name</h1>
                    </label>
                    <div className="mt-2">
                      <input
                        id="projectName"
                        name="projectName"
                        type="text"
                        placeholder="What's the project name?"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="osoName"
                      className="block text-xl font-medium leading-6 text-gray-900"
                    >
                      <h1>Open Source Observer Name</h1>
                    </label>
                    <div className="mt-2">
                      <input
                        id="osoName"
                        name="osoName"
                        type="text"
                        placeholder="What's the project name on Open Source Observer?"
                        value={osoName}
                        onChange={(e) => setOsoName(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  {/* Other form fields follow a similar pattern */}
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="website"
                      className="block text-xl font-medium leading-6 text-gray-900"
                    >
                      <h1>Website</h1>
                    </label>
                    <div className="mt-2">
                      <input
                        id="website"
                        name="website"
                        type="text"
                        placeholder="www.example.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="twitterUrl"
                      className="block text-xl font-medium leading-6 text-gray-900"
                    >
                      <h1>Twitter URL</h1>
                    </label>
                    <div className="mt-2">
                      <input
                        id="twitterUrl"
                        name="twitterUrl"
                        type="text"
                        placeholder="What's the project Twitter profile URL?"
                        value={twitterUrl}
                        onChange={(e) => setTwitterUrl(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="logoUrl"
                      className="block text-xl font-medium leading-6 text-gray-900"
                    >
                      <h1>Logo URL</h1>
                    </label>
                    <div className="mt-2">
                      <input
                        id="logoUrl"
                        name="logoUrl"
                        type="text"
                        placeholder="What's the project logo URL?"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="coverUrl"
                      className="block text-xl font-medium leading-6 text-gray-900"
                    >
                      <h1>Cover URL</h1>
                    </label>
                    <div className="mt-2">
                      <input
                        id="coverUrl"
                        name="coverUrl"
                        type="text"
                        placeholder="What's the project cover URL?"
                        value={coverUrl}
                        onChange={(e) => setCoverUrl(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="coverUrl"
                      className="block text-xl font-medium leading-6 text-gray-900"
                    >
                      <h1>Project Description</h1>
                    </label>
                    <div className="mt-2">
                      <input
                        id="projectDescription"
                        name="projectDescription"
                        type="text"
                        placeholder="What's the project description?"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="sm:col-span-6">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#FF6B4A] rounded-full text-white font-semibold shadow-md hover:bg-orange-300 transition duration-300 ease-in-out"
                      disabled={createProjectLoading}
                    >
                      {createProjectLoading ? (
                        <RotatingLines width="20" visible={true} />
                      ) : (
                        "Create Project"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
