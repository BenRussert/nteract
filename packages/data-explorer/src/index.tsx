import * as React from "react";

import { MetadataWarning } from "./components/MetadataWarning";
import { Toolbar } from "./components/Toolbar";
import { defaultColors } from "./settings";
import VizControls from "./VizControls";

export { Display } from "./Display";
export { Toolbar } from "./components/Toolbar";

const mediaType = "application/vnd.dataresource+json";

import styled from "styled-components";
import { Context } from "tern";
import * as Dx from "./types";

import {
  AreaType,
  Chart,
  HierarchyType,
  LineType,
  NetworkType,
  PieceType,
  SummaryType,
  View
} from "./types";

export interface Props {
  data: Dx.DataProps;
  expanded?: boolean;
  height?: number;
  initialView: View;
  mediaType: "application/vnd.dataresource+json";
  metadata: Dx.Metadata;
  models?: {};
  theme?: string;
  onMetadataChange?: (
    { dx }: { dx: Dx.dxMetaProps },
    mediaType: string
  ) => void;
}
export interface State {
  areaType: AreaType;
  colors: string[];
  hierarchyType: HierarchyType;
  lineType: LineType;
  networkType: NetworkType;
  pieceType: PieceType;
  summaryType: SummaryType;
  //
  data: Dx.Datapoint[];
  dimensions: Dx.Dimension[];
  schema: Dx.Schema;
  metrics: Dx.Metric[];
  primaryKey: Array<Dx.Field["name"]>;
  //
  selectedDimensions: string[];
  selectedMetrics: string[];
  //
  view: View;
  chart: Chart;
  metadata: Dx.Metadata;
  //
  updateChart: (valuesToUpdate: Partial<State>) => void;
  responsiveSize: number[];
}

const FlexWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
`;

export interface DxContextValues {
  updateChart: (updatedState: Partial<State>) => void;
  setColor: (newColors: string[]) => void;
  setGrid: () => void;
  setView: (view: Dx.View) => void;
  areaType: Dx.AreaType;
  chart: Dx.Chart;
  colors: string[];
  data: State["data"];
  dimensions: Dx.Dimension[];
  hierarchyType: Dx.HierarchyType;
  lineType: Dx.LineType;
  metadata: Dx.Metadata;
  metrics: Dx.Metric[];
  networkType: Dx.NetworkType;
  pieceType: Dx.PieceType;
  primaryKey: Array<Dx.Field["name"]>;
  responsiveSize: number[];
  schema: Dx.Schema;
  selectedDimensions: string[];
  selectedMetrics: string[];
  summaryType: Dx.SummaryType;
  view: Dx.View;
}

const defaultResponsiveSize = [500, 300];
const DxContext = React.createContext<DxContextValues>({
  setColor: (newColors = defaultColors) => null,
  setGrid: () => null,
  setView: (view = "grid") => null,
  updateChart: updatedState => null,
  chart: {
    dim1: "none",
    dim2: "none",
    dim3: "none",
    metric1: "none",
    metric2: "none",
    metric3: "none",
    timeseriesSort: "array-order",
    networkLabel: "none"
  },
  areaType: "hexbin",
  data: [{}],
  dimensions: [],
  hierarchyType: "dendrogram",
  lineType: "line",
  metadata: { dx: {} },
  networkType: "force",
  pieceType: "bar",
  primaryKey: [],
  schema: { fields: [], pandas_version: "", primaryKey: [] },
  summaryType: "violin",
  view: "grid",
  responsiveSize: defaultResponsiveSize,
  colors: defaultColors,
  selectedDimensions: [],
  selectedMetrics: [],
  metrics: []
});

const DxConsumer = DxContext.Consumer;
export { DxConsumer };

class DataExplorerProvider extends React.PureComponent<Partial<Props>, State> {
  static MIMETYPE = mediaType;

  static defaultProps = {
    metadata: {
      dx: {}
    },
    height: 500,
    mediaType,
    initialView: "grid"
  };

  constructor(props: Props) {
    super(props);

    const { metadata, initialView } = props;

    // Handle case of metadata being empty yet dx not set
    const dx = metadata.dx || {};
    const chart = dx.chart || {};
    const schema = props.data.schema;
    const { fields = [], primaryKey = [] } = schema;

    const dimensions = fields.filter(
      field =>
        field.type === "string" ||
        field.type === "boolean" ||
        field.type === "datetime"
    ) as Dx.Dimension[];

    // Should datetime data types be transformed into js dates before getting to this resource?
    const data = props.data.data.map(datapoint => {
      const mappedDatapoint: Dx.Datapoint = {
        ...datapoint
      };
      fields.forEach(field => {
        if (field.type === "datetime") {
          mappedDatapoint[field.name] = new Date(mappedDatapoint[field.name]);
        }
      });
      return mappedDatapoint;
    });

    const metrics = fields
      .filter(
        field =>
          field.type === "integer" ||
          field.type === "number" ||
          field.type === "datetime"
      )
      .filter(
        field => !primaryKey.find(pkey => pkey === field.name)
      ) as Dx.Metric[];

    this.state = {
      view: initialView,
      selectedDimensions: [],
      selectedMetrics: [],
      lineType: "line",
      areaType: "hexbin",
      pieceType: "bar",
      summaryType: "violin",
      networkType: "force",
      hierarchyType: "dendrogram",
      dimensions,
      metrics,
      colors: defaultColors,
      chart: {
        metric1: (metrics[0] && metrics[0].name) || "none",
        metric2: (metrics[1] && metrics[1].name) || "none",
        metric3: "none",
        dim1: (dimensions[0] && dimensions[0].name) || "none",
        dim2: (dimensions[1] && dimensions[1].name) || "none",
        dim3: "none",
        timeseriesSort: "array-order",
        networkLabel: "none",
        ...chart
      },
      primaryKey,
      data,
      schema,
      metadata,

      ...dx,
      updateChart: this.updateChart,
      responsiveSize: [500, 300]
    };
  }

  updateChart = (updatedState: Partial<State>) => {
    const {
      areaType,
      chart,
      colors,
      hierarchyType,
      lineType,
      networkType,
      pieceType,
      selectedDimensions,
      selectedMetrics,
      summaryType,
      view
    } = { ...this.state, ...updatedState };

    if (!this.props.data && !this.props.metadata && !this.props.initialView) {
      return;
    }

    // If you pass an onMetadataChange function, then fire it and pass the updated dx settings so someone upstream can update the metadata or otherwise use it
    if (this.props.onMetadataChange) {
      this.props.onMetadataChange(
        {
          ...this.props.metadata,
          dx: {
            areaType,
            chart,
            colors,
            hierarchyType,
            lineType,
            networkType,
            pieceType,
            selectedDimensions,
            selectedMetrics,
            summaryType,
            view
          }
        },
        mediaType
      );
    }

    this.setState({
      areaType,
      chart,
      colors,
      hierarchyType,
      lineType,
      networkType,
      pieceType,
      selectedDimensions,
      selectedMetrics,
      summaryType,
      view
    });
  };
  setView = (view: View) => {
    this.updateChart({ view });
  };

  setGrid = () => {
    this.setState({ view: "grid" });
  };

  setColor = (newColorArray: string[]) => {
    this.updateChart({ colors: newColorArray });
  };

  setLineType = (selectedLineType: LineType) => {
    this.updateChart({ lineType: selectedLineType });
  };

  setAreaType = (selectedAreaType: AreaType) => {
    this.updateChart({ areaType: selectedAreaType });
  };

  updateDimensions = (selectedDimension: string) => {
    const oldDims = this.state.selectedDimensions;
    const newDimensions =
      oldDims.indexOf(selectedDimension) === -1
        ? [...oldDims, selectedDimension]
        : oldDims.filter(dimension => dimension !== selectedDimension);
    this.updateChart({ selectedDimensions: newDimensions });
  };
  updateMetrics = (selectedMetric: string) => {
    const oldMetrics = this.state.selectedMetrics;
    const newMetrics =
      oldMetrics.indexOf(selectedMetric) === -1
        ? [...oldMetrics, selectedMetric]
        : oldMetrics.filter(metric => metric !== selectedMetric);
    this.updateChart({ selectedMetrics: newMetrics });
  };

  render() {
    const contextValues: DxContextValues = {
      areaType: this.state.areaType,
      chart: this.state.chart,
      colors: this.state.colors,
      data: this.state.data,
      dimensions: this.state.dimensions,
      hierarchyType: this.state.hierarchyType,
      lineType: this.state.lineType,
      metadata: this.state.metadata,
      metrics: this.state.metrics,
      networkType: this.state.networkType,
      pieceType: this.state.pieceType,
      primaryKey: this.state.primaryKey,
      responsiveSize: this.state.responsiveSize,
      schema: this.state.schema,
      selectedDimensions: this.state.selectedDimensions,
      selectedMetrics: this.state.selectedMetrics,
      setColor: this.setColor,
      setGrid: this.setGrid,
      setView: this.setView,
      summaryType: this.state.summaryType,
      updateChart: this.state.updateChart,
      view: this.state.view
    };
    return (
      <React.Fragment>
        <MetadataWarning metadata={this.props.metadata!} />
        <FlexWrapper>
          <DxContext.Provider value={contextValues}>
            {this.props.children}
          </DxContext.Provider>
        </FlexWrapper>
      </React.Fragment>
    );
  }
}

export default DataExplorerProvider;
