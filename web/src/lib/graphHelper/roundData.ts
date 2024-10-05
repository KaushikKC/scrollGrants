import { request, gql } from "graphql-request";
import { SUBGRAPH_URL } from "../const";
import { stringToJsonObject } from "../stringToJsonObject";
export const getRoundData = async (id: number) => {
  try {
    const data: any = await request(
      SUBGRAPH_URL,
      gql`
        query MyQuery {
          round(id: ${id}) {
            id
            matchingAmount
            isActive
            metadata
            owner
            totalDistributed
            projects {
              id
              metadata
              totalDonations
            }
          }
        }
      `
    );
    // console.log(data.round);
    const metadata = stringToJsonObject(data.round.metadata);
    // console.log(metadata);
    return {
      ...data.round,
      metadata,
    };
  } catch (error) {
    console.log(error);
  }
};
