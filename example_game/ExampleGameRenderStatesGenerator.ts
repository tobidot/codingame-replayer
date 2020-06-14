import GameRendererStatesGenerator from "../base/GameRendererStatesGenerator"; import { ReplayeStepState } from "../base/Replayer"; import { GameLog, GameLogEvent } from "../base/GameLog"; import { GameRenderElement, GameRenderer } from "../base/GameRenderer";


export default class ExampleGameRenderStatesGenerator extends GameRendererStatesGenerator {
    private readonly player_gui_position = [[50, 100], [650, 100], [50, 400], [650, 400]];
    private step: number = 0;
    private current_state: ReplayeStepState = new Map();
    constructor(private log: GameLog) {
        super();
    }
    protected get_initial_state(): ReplayeStepState {
        for (let i = 0; i < 2; i++) {
            const player_prefix = 'player_' + i.toString() + '_';
            const position = this.player_gui_position[i];
            const background_element = new GameRenderElement(player_prefix, false, "image_2", position[0], position[1], 200, 50);
            this.current_state.set(player_prefix + 'background', background_element);
        }
        return this.current_state;
    }
    protected get_next_state(): ReplayeStepState | null {
        if (this.step > 200) return null;
        const next_state = new Map<string, GameRenderElement>(this.current_state);
        let messages = this.log.for_step(this.step);
        this.current_state = messages.reduce(this.apply_message, next_state);
        this.step++;
        return this.current_state;
    }
    private apply_message = (state: ReplayeStepState, { channel, message }: GameLogEvent): ReplayeStepState => {
        if (channel === '1' || channel === '2') {
            const output = parseFloat(message);
            const object_id = "player_" + channel + '_output';
            const position = this.player_gui_position[parseInt(channel)];
            const object = new GameRenderElement(object_id, true, output.toString(), position[0], position[1], 100, 24, 0);
            state.set(object_id, object);
        }
        return state;
    }
}