import * as React from "react";
import styled from "styled-components";

import { Metadata } from "../types";

const MetadataWarningWrapper = styled.div`
  & {
    font-family: Source Sans Pro, Helvetica Neue, Helvetica, Arial, sans-serif;
  }
`;

const MetadataWarningContent = styled.div`
  & {
    backgroundcolor: #cce;
    padding: 10px;
    paddingleft: 20px;
  }
`;

export const MetadataWarning = ({ metadata }: { metadata: Metadata }) => {
  const warning =
    metadata && metadata.sampled ? (
      <span>
        <b>NOTE:</b> This data is sampled
      </span>
    ) : null;

  return (
    <MetadataWarningWrapper>
      {warning ? (
        <MetadataWarningContent>{warning}</MetadataWarningContent>
      ) : null}
    </MetadataWarningWrapper>
  );
};
