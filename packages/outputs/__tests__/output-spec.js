import * as React from "react";
import { shallow } from "enzyme";

import { StreamText, JupyterError } from "../src";
import { Output as OutputSwitch } from "../src";

function OutputTestComponent({ output }) {
  return (
    <OutputSwitch output={output}>
      {/* <ExecuteResult>
        <DataExplorer />
        <JSON />
        <HTML />
        <Plain />
      </ExecuteResult> */}
      <StreamText />
      <JupyterError />
    </OutputSwitch>
  );
}

describe("OutputSwitch component", () => {
  it("handles stream data", () => {
    const output = { outputType: "stream", name: "stdout", text: "hey" };
    const component = shallow(<OutputTestComponent output={output} />);
    expect(component.shallow().type()).toEqual(StreamText);
    expect(component.shallow().length).toEqual(1);
  });

  it("handles errors/tracebacks", () => {
    const output = {
      outputType: "error",
      traceback: ["Yikes, Will is in the upsidedown again!"],
      ename: "NameError",
      evalue: "Yikes!"
    };
    const component = shallow(<OutputTestComponent output={output} />);
    expect(component.shallow().type()).toEqual(JupyterError);

    const outputNoTraceback = {
      outputType: "error",
      ename: "NameError",
      evalue: "Yikes!"
    };

    const component2 = shallow(
      <OutputTestComponent output={outputNoTraceback} />
    );
    expect(component2.shallow().type()).toEqual(JupyterError);
  });
});
