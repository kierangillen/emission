import { Sans, Serif, Spacer } from "@artsy/palette"
import { get, take } from "lodash"
import React from "react"
import { TouchableOpacity } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import { ArtistListItem } from "./Components/ArtistListItem"

import { Artists_show } from "__generated__/Artists_show.graphql"
import { ArtistsFollowArtistMutation } from "__generated__/ArtistsFollowArtistMutation.graphql"

interface Props {
  show: Artists_show
  relay: RelayProp
}

interface State {
  isFollowedChanging: { [id: string]: boolean }
}

export class Artists extends React.Component<Props, State> {
  state = {
    isFollowedChanging: {},
  }

  handleFollowArtist = ({ id, __id, is_followed }) => {
    const { relay } = this.props
    const { isFollowedChanging } = this.state
    this.setState(
      {
        isFollowedChanging: {
          ...isFollowedChanging,
          [id]: true,
        },
      },
      () => {
        commitMutation<ArtistsFollowArtistMutation>(relay.environment, {
          onCompleted: () => {
            this.setState({
              isFollowedChanging: {
                ...this.state.isFollowedChanging,
                [id]: false,
              },
            })
          },
          mutation: graphql`
            mutation ArtistsFollowArtistMutation($input: FollowArtistInput!) {
              followArtist(input: $input) {
                artist {
                  __id
                  is_followed
                }
              }
            }
          `,
          variables: {
            input: {
              artist_id: id,
              unfollow: is_followed,
            },
          },
          optimisticResponse: {
            followArtist: {
              artist: {
                __id,
                is_followed: !is_followed,
              },
            },
          },
          updater: store => {
            store.get(__id).setValue(!is_followed, "is_followed")
          },
        })
      }
    )
  }

  render() {
    const { isFollowedChanging } = this.state
    const { show } = this.props
    const artistsShown = 5

    const artists = get(show, "artists", [])
    const items: Artists_show["artists"] = take(artists, artistsShown)

    const viewAllArtists = () => {
      // TODO: Add button functionality
      console.log("View all artists pressed")
    }

    return (
      <>
        <Serif size="8">Artists</Serif>
        <Spacer m={1} />
        {items.map((artist, idx, arr) => {
          const { name, id, is_followed, nationality, birthday, deathday } = artist
          const { url } = artist.image
          return (
            <React.Fragment key={id}>
              <ArtistListItem
                name={name}
                nationality={nationality}
                birthday={birthday}
                deathday={deathday}
                isFollowed={is_followed}
                url={url}
                onPress={() => this.handleFollowArtist(artist)}
                isFollowedChanging={isFollowedChanging[id]}
              />
              {idx < arr.length - 1 && <Spacer m={1} />}
            </React.Fragment>
          )
        })}
        {artists.length > artistsShown && (
          <>
            <Spacer m={1} />
            <TouchableOpacity onPress={() => viewAllArtists()}>
              <Sans size="3" my={2} weight="medium">
                View all artists
              </Sans>
            </TouchableOpacity>
          </>
        )}
      </>
    )
  }
}

export const ArtistsContainer = createFragmentContainer(
  Artists,
  graphql`
    fragment Artists_show on Show {
      artists {
        __id
        id
        name
        is_followed
        nationality
        birthday
        deathday
        image {
          url
        }
      }
    }
  `
)
