// @flow
import * as React from "react";

import { connect } from "react-redux";

import { Logo } from "./logos";

import * as selectors from "../../selectors";
import type { AppState } from "../../state";

type TitleBarProps = {
  title: string,
  theme: "light" | "dark",
  onTitleChange?: (title: string) => void,
  logoHref?: string
};

export const TitleBar = (props: TitleBarProps) => (
  <React.Fragment>
    <header>
      <a href={props.logoHref}>
        <Logo height={20} theme={props.theme} />
      </a>
      <p>{props.title}</p>
    </header>
    <style jsx>{`
      header {
        display: flex;
        justify-content: flex-start;
        background-color: var(--theme-title-bar-bg, rgb(250, 250, 250));
        padding: 10px 16px;
      }

      a {
        display: inline-block;
        margin: 0 30px;
      }

      p {
        display: inline-block;
        margin: 0 30px;
      }
    `}</style>
  </React.Fragment>
);

const mapStateToProps = (
  state: AppState,
  ownProps: { logoHref?: string }
): TitleBarProps => ({
  title: selectors
    .currentFilepath(state)
    .split("/")
    .pop()
    .split(".ipynb")
    .shift(),
  theme: selectors.currentTheme(state),
  logoHref: ownProps.logoHref
});

const mapDispatchToProps = dispatch => ({
  onTitleChange: (title: string) => {
    // TODO: Once the content refs PR is finished use the ref to change
    // the filename, noting that the URL path should also change
    console.error("not implemented yet");
  }
});

TitleBar.defaultProps = {
  title: "",
  theme: "light"
};

export default connect(mapStateToProps, mapDispatchToProps)(TitleBar);
