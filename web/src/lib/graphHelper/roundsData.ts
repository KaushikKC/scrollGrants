import { request, gql } from "graphql-request";
import { SUBGRAPH_URL } from "../const";
export const getRoundsData = async () => {
  try {
    const data = await request(
      SUBGRAPH_URL,
      gql`
        query MyQuery {
          rounds {
            id
            isActive
            matchingAmount
            metadata
            projects {
              id
            }
          }
        }
      `
    );
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
