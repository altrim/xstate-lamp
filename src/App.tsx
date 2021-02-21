import * as React from "react";
import { atom, Provider, useAtom } from "jotai";
import { atomWithMachine } from "jotai/xstate";
import styles from "./App.module.css";
import { Automaton } from "./Automaton";
import { createLampMachine, LampState } from "./LampMachine";
import { LightBulb } from "./LightBulb";
import { Switch } from "./Switch";

const defaultAtom = atom({ elapsed: 0, interval: 0.1, clockGuard: 3 });
const lampMachineAtom = atomWithMachine((get) =>
  createLampMachine(get(defaultAtom))
);

const Lamp: React.FC = () => {
  const [state, send] = useAtom(lampMachineAtom);
  const { elapsed, clockGuard } = state.context;

  const getLampState = () => {
    if (state.matches(LampState.Off)) {
      return LampState.Off;
    }
    if (state.matches(LampState.Low)) {
      return LampState.Low;
    }
    if (state.matches(LampState.Bright)) {
      return LampState.Bright;
    }
    return LampState.Off;
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.switch}>
          <Switch onClick={send}>{getLampState()}</Switch>
          <h2 className={styles.counter}>t={elapsed.toFixed(1)}s</h2>
        </div>
        <Automaton
          light={getLampState()}
          clockGuard={clockGuard}
          elapsed={elapsed}
        />
        <LightBulb light={getLampState()} />
      </div>
    </>
  );
};

const App: React.FC = () => (
  <Provider>
    <Lamp />
    <footer className={styles.footer}>
      lightbulb Icon made by{" "}
      <a href="https://www.flaticon.com/authors/srip" title="srip">
        srip{" "}
      </a>
      from{" "}
      <a href="https://www.flaticon.com/" title="Flaticon">
        www.flaticon.com
      </a>
    </footer>
  </Provider>
);

export default App;
