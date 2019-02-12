import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import React from "react";

import { dataExplorerProps } from "../__mocks__/dx-props";
import DataExplorer from "../src/index";

describe("DataExplorerNoMetadata", () => {
  it("creates a data explorer with metadata", () => {
    const wrapper = shallow(<DataExplorer {...dataExplorerProps} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe("DataExplorerMetadata", () => {
  it("creates a data explorer without metadata", () => {
    const wrapper = shallow(
      <DataExplorer {...dataExplorerProps} metadata={{}} />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
