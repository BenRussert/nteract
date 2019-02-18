import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";

import { getDxProps } from "../__mocks__/dx-props";

import DataExplorerProvider from "../src/index";
import { Props } from "../src/index";

import { Bar, Grid, Summary } from "../src/charts/";
import { Toolbar } from "../src/components/Toolbar";
import { Display } from "../src/Display";
import * as Dx from "../src/types";

describe.skip("DataExplorer Metadata props", () => {
  function DataExplorer(props: Props) {
    return (
      <DataExplorerProvider {...props}>
        <Display />
        <Toolbar />
      </DataExplorerProvider>
    );
  }

  let dataExplorerProps;
  beforeEach(() => {
    dataExplorerProps = getDxProps();
  });

  it("creates a data explorer with metadata", () => {
    const wrapper = shallow(<DataExplorer {...dataExplorerProps} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("creates a data explorer without metadata", () => {
    const wrapper = shallow(
      <DataExplorer {...dataExplorerProps} metadata={{}} />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe.only("Toolbar component", () => {
  function DataExplorer(props: Props) {
    return (
      <DataExplorerProvider {...props}>
        <Display />
        <Toolbar />
      </DataExplorerProvider>
    );
  }
  let dataExplorerProps, toolBar;
  beforeEach(() => {
    dataExplorerProps = getDxProps();
  });

  it("Renders a toolbar and a grid view by default", () => {
    const wrapper = mount(<DataExplorer data={dataExplorerProps.data} />);
    expect(wrapper.find(Toolbar)).toHaveLength(1);
    expect(wrapper.find(Grid)).toHaveLength(1);
  });

  it("Renders a bar chart", () => {
    const wrapper = mount(
      <DataExplorer data={dataExplorerProps.data} initialView={"bar"} />
    );
    expect(wrapper.find(Toolbar)).toHaveLength(1);
    expect(wrapper.find(Bar)).toHaveLength(1);
  });

  it("Renders a summary chart", () => {
    const wrapper = mount(
      <DataExplorer data={dataExplorerProps.data} initialView={"summary"} />
    );
    expect(wrapper.find(Toolbar)).toHaveLength(1);
    expect(wrapper.find(Summary)).toHaveLength(1);
  });

  it.skip("Renders a line chart", () => {
    const wrapper = mount(
      <DataExplorer data={dataExplorerProps.data} initialView={"line"} />
    );
    expect(wrapper.find(Toolbar)).toHaveLength(1);
    expect(wrapper.find(Line)).toHaveLength(1);
  });

  it.skip("Renders a hierarchical chart", () => {
    // Need special data setup for this?
    const wrapper = mount(
      <DataExplorer data={dataExplorerProps.data} initialView={"hierarchy"} />
    );
    expect(wrapper.find(Toolbar)).toHaveLength(1);
    expect(wrapper.find(Hierarchical)).toHaveLength(1);
  });

  it.skip("Renders a network chart", () => {
    // Need special data setup for this?
    const wrapper = mount(
      <DataExplorer data={dataExplorerProps.data} initalView={"network"} />
    );
    expect(wrapper.find(Toolbar)).toHaveLength(1);
    expect(wrapper.find(Network)).toHaveLength(1);
  });

  it.skip("Renders an xyplot", () => {
    const wrapper = mount(
      <DataExplorer data={dataExplorerProps.data} initialView={"xyplot"} />
    );
    expect(wrapper.find(Toolbar)).toHaveLength(1);
    expect(wrapper.find(XYPlot)).toHaveLength(1);
  });
});
