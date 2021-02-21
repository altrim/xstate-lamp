import { assign, createMachine, send } from "xstate";

export enum LampState {
  Off = "Off",
  Low = "Low",
  Bright = "Bright",
}
enum Event {
  Tick = "Tick",
  Reset = "Reset",
}
interface LampContext {
  elapsed: number;
  clockGuard: number;
  interval: number;
}

export const createLampMachine = ({
  elapsed,
  interval,
  clockGuard,
}: LampContext) =>
  createMachine<LampContext>({
    id: "lamp",
    initial: LampState.Off,
    context: {
      elapsed,
      interval,
      clockGuard,
    },

    states: {
      [LampState.Off]: {
        on: {
          click: [LampState.Low],
        },
      },
      [LampState.Low]: {
        entry: send(Event.Reset),
        invoke: {
          src: (context) => (cb) => {
            const interval = setInterval(() => {
              cb(Event.Tick);
            }, 1000 * context.interval);
            return () => {
              clearInterval(interval);
            };
          },
        },
        on: {
          [Event.Tick]: {
            actions: assign({
              elapsed: (context) => context.elapsed + context.interval,
            }),
          },
          click: [
            {
              target: [LampState.Bright],
              cond: ({ elapsed, clockGuard }): boolean => {
                return elapsed < clockGuard;
              },
            },
            {
              target: [LampState.Off],
              cond: ({ elapsed, clockGuard }): boolean => {
                return elapsed >= clockGuard;
              },
            },
          ],
        },
      },
      [LampState.Bright]: {
        on: {
          click: {
            target: [LampState.Off],
          },
        },
      },
    },
    on: {
      [Event.Reset]: {
        actions: assign<LampContext>({
          elapsed: 0,
        }),
      },
    },
  });
