import { Box, Flex, Sans, space } from "@artsy/palette"
import { WhiteButton } from "lib/Components/Buttons"
import { Markdown } from "lib/Components/Markdown"
import React from "react"
import styled from "styled-components/native"

const Button = styled(WhiteButton)`
  padding-left: ${space(2)};
  padding-right: ${space(2)};
`

interface Props {
  hours: string
}

interface State {
  isExpanded: boolean
}

export class HoursCollapsible extends React.Component<Props, State> {
  state = { isExpanded: false }

  handleToggleIsExpanded = () => {
    this.setState({ isExpanded: !this.state.isExpanded })
  }

  render() {
    const { isExpanded } = this.state
    const { hours } = this.props
    return (
      <Box>
        <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
          <Sans size="4">Hours</Sans>
          <Button text={isExpanded ? "Tap to Close" : "Tap to Expand"} onPress={this.handleToggleIsExpanded} />
        </Flex>
        {isExpanded && <Markdown size="3">{hours}</Markdown>}
      </Box>
    )
  }
}
