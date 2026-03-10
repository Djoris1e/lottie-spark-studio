const GRAPHQL_ENDPOINT = 'https://graphql.lottiefiles.com/2022-08';

export interface LottieFilesResult {
  id: string;
  name: string;
  lottieUrl: string;
  gifUrl: string | null;
  createdBy: { name: string } | null;
}

const SEARCH_QUERY = `
  query SearchAnimations($query: String!, $first: Int!) {
    featuredPublicAnimations(
      filters: { query: $query }
      first: $first
    ) {
      edges {
        node {
          id
          name
          lottieUrl
          gifUrl
          createdBy { name }
        }
      }
    }
  }
`;

const FEATURED_QUERY = `
  query FeaturedAnimations($first: Int!) {
    featuredPublicAnimations(first: $first) {
      edges {
        node {
          id
          name
          lottieUrl
          gifUrl
          createdBy { name }
        }
      }
    }
  }
`;

async function gqlRequest(query: string, variables: Record<string, unknown>): Promise<LottieFilesResult[]> {
  const resp = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await resp.json();
  const edges = json?.data?.featuredPublicAnimations?.edges;
  if (!Array.isArray(edges)) return [];
  return edges.map((e: any) => e.node);
}

export async function searchLottieFiles(query: string, count = 20): Promise<LottieFilesResult[]> {
  return gqlRequest(SEARCH_QUERY, { query, first: count });
}

export async function getFeaturedLottieFiles(count = 20): Promise<LottieFilesResult[]> {
  return gqlRequest(FEATURED_QUERY, { first: count });
}
