import { request, gql } from "graphql-request";
import { SUBGRAPH_URL } from "../const";
export const getProjectData = async (id: string) => {
  try {
    const data: any = await request(
      SUBGRAPH_URL,
      gql`
        query MyQuery {
          project(id: "${id}") {
            id
            coverUrl
            donors
            logoUrl
            osoName
            owner
            pendingPayout
            projectDescription
            projectName
            round {
              endDate
              startDate
              isActive
            }
            teamSize
            totalDonations
            twitterUrl
            website
          }
        }
      `
    );

    // console.log(metadata);
    return data.project;
  } catch (error) {
    console.log(error);
  }
};
