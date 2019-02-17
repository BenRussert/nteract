import * as React from "react";
import {
  ResponsiveNetworkFrame,
  ResponsiveOrdinalFrame,
  ResponsiveXYFrame
} from "semiotic";
import styled from "styled-components";

import { Bar, Grid, Line, Summary } from "./charts/";
import { SemioticWrapper } from "./css/semiotic-wrapper";
import * as Dx from "./types";
export interface DisplayProps {
  metrics: Dx.Metric[];
  dimensions: Dx.Dimension[];
  chart: Dx.Chart[];
  colors: string[];
  height: number;
  lineType: Dx.LineType;
  areaType: Dx.AreaType;
  selectedDimensions: Dx.Dimension[];
  selectedMetrics: Dx.Metric[];
  pieceType: Dx.PieceType;
  summaryType: Dx.SummaryType;
  networkType: Dx.NetworkType;
  hierarchyType: Dx.HierarchyType;
  primaryKey: Dx.Schema["primaryKey"];
  setColor: (color: string) => void;
}

import { DxConsumer, DxContextValues } from "./index";
export interface DisplayState {}

const FlexItem = styled.div`
  flex: 1;
`;

export class Display extends React.Component<{}, DisplayState> {
  render() {
    return (
      <DxConsumer>
        {({
          data,
          schema,
          metadata,
          view,
          chart,
          responsiveSize,
          ...otherChartProps
        }: DxContextValues) => {
          return (
            <FlexItem>
              {view === "grid" ? (
                <Grid data={data} schema={schema} metadata={metadata} />
              ) : null}

              {
                <SemioticWrapper>
                  {view === "bar" ? <Bar /> : null}
                  {view === "summary" ? <Summary /> : null}
                  {view === "line" ? <Line /> : null}
                </SemioticWrapper>
              }
            </FlexItem>
          );
        }}
      </DxConsumer>
    );
  }
}
