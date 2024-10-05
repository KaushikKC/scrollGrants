import { request, gql } from "graphql-request";
import { SUBGRAPH_URL } from "../const";
export const getRoundsData = async () => {
  try {
    const data: any = await request(
      SUBGRAPH_URL,
      gql`
        query MyQuery {
          rounds {
            endDate
            id
            isActive
            matchingAmount
            owner
            roundDescription
            roundName
            startDate
            totalDistributed
            projects {
              id
            }
          }
        }
      `
    );
    console.log(data);
    return data.rounds;
  } catch (error) {
    console.log(error);
  }
};
