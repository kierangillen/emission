import { Box, Flex, Sans, Spacer, space } from "@artsy/palette"
import { WhiteButton } from "lib/Components/Buttons"
import { Markdown } from "lib/Components/Markdown"
import React from "react"
import styled from "styled-components/native"
import { isString, isArray, uniqBy } from "lodash"
import moment from "moment"

const Button = styled(WhiteButton)`
  padding-left: ${space(2)};
  padding-right: ${space(2)};
`

interface Props {
  hours: string | Array<{ day_of_week: string; start_time: number; end_time: number }>
}

interface State {
  isExpanded: boolean
}

export function formatTime(time) {
  const hourMoment = moment().hour(time / 60 / 60)
  const minutesMoment = moment().minutes(time / 60)
  const pm = hourMoment.hour() > 12 ? "pm" : ""
  return hourMoment.format("h") + (minutesMoment.format("mm") === "00" ? "" : minutesMoment.format(":mm")) + pm
}

export class HoursCollapsible extends React.Component<Props, State> {
  state = { isExpanded: false }

  handleToggleIsExpanded = () => {
    this.setState({ isExpanded: !this.state.isExpanded })
  }

  renderHours() {
    const { hours } = this.props
    if (isString(hours)) {
      return <Markdown size="3">{hours}</Markdown>
    } else if (isArray(hours)) {
      return uniqBy(hours, "day_of_week").map(({ start_time, end_time, day_of_week }, idx, arr) => {
        return (
          <>
            <Sans size="3" weight="medium">
              {day_of_week}
            </Sans>
            <Sans size="3">
              {formatTime(start_time)} - {formatTime(end_time)}
            </Sans>
            {idx < arr.length - 1 && <Spacer m={1} />}
          </>
        )
      })
    }
  }

  render() {
    const { isExpanded } = this.state
    return (
      <Box>
        <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
          <Sans size="4">Hours</Sans>
          <Button text={isExpanded ? "Tap to Close" : "Tap to Expand"} onPress={this.handleToggleIsExpanded} />
        </Flex>
        {isExpanded && this.renderHours()}
      </Box>
    )
  }
}
