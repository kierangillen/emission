import { ConnectionData, createPaginationContainer, graphql } from "react-relay"
import InfiniteScrollArtworksGrid from "lib/Components/ArtworkGrids/InfiniteScrollGrid

const ShowArtworksGrid = createPaginationContainer(
  InfiniteScrollArtworksGrid,
  {
    filtered_artworks: graphql`
      fragment ShowArtworksGrid_filtered_artworks on FilterArtworks
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String", defaultValue: "" }
        sort: { type: "String" }
      ) {
        __id       
        artworks: artworks_connection(first: $count, after: $cursor, sort: $sort)
          @connection(key: "ShowArtworksGrid_artworks") {
          pageInfo {
            hasNextPage  
            startCursor
            endCursor
          }
          edges {
            node {
              id
              __id
              image {
                aspect_ratio
              }
              ...Artwork_artwork
            }
          }
        }
      }
    `
  }
)
