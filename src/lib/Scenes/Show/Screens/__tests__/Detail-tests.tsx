import React from "react"
import { graphql } from "react-relay"

import { MockRelayRenderer } from "../../../../tests/MockRelayRenderer"
import { renderUntil } from "../../../../tests/renderUntil"
import { ShowFixture } from "../../__fixtures__"

import { ShowHeader } from "../../Components/ShowHeader"
import { DetailContainer } from "../Detail"

jest.unmock("react-relay")

jest.mock("../../../../Components/LocationMap/index.tsx", () => "LocationMap")

xit("Renders the Show Detail Screen", async () => {
  const tree = await renderUntil(
    wrapper => {
      return wrapper.find(ShowHeader).length > 0
    },
    <MockRelayRenderer
      Component={DetailContainer}
      query={graphql`
        query DetailTestsQuery {
          show(id: "anderson-fine-art-gallery-flickinger-collection") {
            ...Detail_show
          }
        }
      `}
      mockResolvers={{
        Show: () => ({
          ...ShowFixture,
          artists: () => ShowFixture.show.artists,
        }),
      }}
    />
  )

  expect(tree.text()).toContain("Flickinger Collection")
})
