import { mount } from "enzyme"
import { WhiteButton } from "lib/Components/Buttons"
import React from "react"
import { HoursCollapsible } from "../HoursCollapsible"

describe("HoursCollapsible", () => {
  const hours = `
    Monday: Foo - Bar
    Tuesday: Bar - Baz
    Wednesday - Friday: Closed
  `

  it("renders properly", () => {
    const comp = mount(<HoursCollapsible hours={hours} />)

    expect(comp.find(WhiteButton).props().text).toBe("Tap to Expand")
    expect(comp.text()).toContain("Hours")
  })

  it("expands when pressed", () => {
    const comp = mount(<HoursCollapsible hours={hours} />)

    comp
      .find(WhiteButton)
      .props()
      .onPress()

    expect(comp.text()).toContain(hours)
  })
})
