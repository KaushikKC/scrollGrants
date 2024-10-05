import { request, gql } from "graphql-request";
import { SUBGRAPH_URL } from "../const";
import { stringToJsonObject } from "../stringToJsonObject";
export const getRoundData = async (id: number) => {
  try {
    const data: any = await request(
      SUBGRAPH_URL,
      gql`
        query MyQuery {
          round(id: "${id}") {
            id
            endDate
            isActive
            matchingAmount
            owner
            roundName
            startDate
               roundDescription
            projects {
              id
              logoUrl
              osoName
              owner
              projectDescription
              projectName
              teamSize
              totalDonations
              twitterUrl
              website
              coverUrl
            }
          }
        }
      `
    );

    // console.log(metadata);
    return data.round;
  } catch (error) {
    console.log(error);
  }
};
