import { GameRenderer, GameRenderElement } from "./GameRenderer";
import InputFileHandler from "./InputFileHandler";
import GameLogParser from "./GameLogParser";
import { GameLog, GameLogEvent } from "./GameLog";

export type ReplayerChanges = Map<string, Partial<GameRenderElement>>;
export type ReplayeStepState = Map<string, GameRenderElement>;

export default abstract class Replayer {
    protected renderer: GameRenderer;
    private current_step: number = 0;
    private current_step_progress: number = 0;

    constructor(private states: Array<ReplayeStepState>) {
        this.renderer = this.create_renderer();
    }

    public async run() {
        this.renderer.run();
        let last_update = performance.now();
        let loop = (time: number) => {
            const diff = time - last_update;
            console.log(diff);
            last_update = time;
            this.current_step_progress += diff / 100;
            while (this.current_step_progress >= 1) {
                this.current_step++;
                this.current_step_progress -= 1;
            }
            if (this.current_step < this.states.length - 1) {
                const state = this.get_interpolated_state();
                this.renderer.update_state(state);
                const replay_progress = this.current_step / this.states.length;
                this.renderer.update_element(
                    'replay_progress_bar',
                    new GameRenderElement('replay_progress_bar',
                        false, 'orange',
                        400 * replay_progress, 550,
                        800 * replay_progress
                    )
                );
                console.log(this.current_step);
                requestAnimationFrame(loop);
            }
        };
        requestAnimationFrame(loop);
    }

    protected get_interpolated_state(): ReplayeStepState {
        return this.states[this.current_step];
    }

    protected create_renderer() {
        return new GameRenderer(false);
    }
}