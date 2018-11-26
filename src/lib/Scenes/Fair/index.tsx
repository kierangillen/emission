import { Box, Separator, Theme } from "@artsy/palette"
import { Fair_fair } from "__generated__/Fair_fair.graphql"
import React from "react"
import { FlatList, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { LocationMapContainer as LocationMap } from "lib/Components/LocationMap"
import { FairHeaderContainer as FairHeader } from "./Components/FairHeader"
import { HoursCollapsible } from "lib/Components/HoursCollapsible"

interface Props extends ViewProperties {
  fair: Fair_fair
}

export class Fair extends React.Component<Props> {
  state = {
    sections: [],
  }

  componentDidMount() {
    const { fair } = this.props
    const sections = []

    sections.push({
      type: "hours",
      data: {
        hours: fair.hours,
      },
    })

    sections.push({
      type: "location",
      data: {
        location: fair.location,
        partnerName: fair.organizer.profile.name,
      },
    })

    this.setState({ sections })
  }

  renderItemSeparator = () => (
    <Box py={2} px={2}>
      <Separator />
    </Box>
  )

  renderItem = ({ item: { data, type } }) => {
    switch (type) {
      case "location":
        return <LocationMap partnerType="Fair" {...data} />
      case "hours":
        return <HoursCollapsible {...data} />
      default:
        return null
    }
  }

  render() {
    const { fair } = this.props

    return (
      <Theme>
        <FlatList
          data={this.state.sections}
          ListHeaderComponent={
            <>
              <FairHeader fair={fair} />
              {this.renderItemSeparator()}
            </>
          }
          renderItem={item => <Box px={2}>{this.renderItem(item)}</Box>}
          ItemSeparatorComponent={this.renderItemSeparator}
          keyExtractor={(item, index) => item.type + String(index)}
        />
      </Theme>
    )
  }
}

export default createFragmentContainer(
  Fair,
  graphql`
    fragment Fair_fair on Fair {
      ...FairHeader_fair

      hours
      location {
        ...LocationMap_location
      }

      organizer {
        profile {
          name
        }
      }
    }
  `
)
