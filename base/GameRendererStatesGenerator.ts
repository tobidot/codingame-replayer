import { GameRenderElement } from "./GameRenderer";
import { ReplayeStepState } from "./Replayer";
import { GameLog } from "./GameLog";

export default abstract class GameRendererStatesGenerator {
    constructor() {

    }

    public get_states(): Array<ReplayeStepState> {
        let buffer = new Array<ReplayeStepState>();
        let state: ReplayeStepState | null = this.get_initial_state();
        while (state !== null) {
            buffer.push(state);
            state = this.get_next_state();
        }
        return buffer;
    }

    protected abstract get_initial_state(): ReplayeStepState;
    protected abstract get_next_state(): ReplayeStepState | null;
}