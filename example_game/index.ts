import InputFileHandler from "../base/InputFileHandler";
import GameLogParser from "../base/GameLogParser";
import { GameRenderer, GameRenderElement } from "../base/GameRenderer";
import Replayer, { ReplayeStepState } from "../base/Replayer";
import GameRendererStatesGenerator from "../base/GameRendererStatesGenerator";
import { GameLog, GameLogEvent } from "../base/GameLog";
import ExampleGameRenderStatesGenerator from "./ExampleGameRenderStatesGenerator";


class ExampleGameReplayer extends Replayer {

}

(async () => {
    const log = await (new InputFileHandler()).get_file().then((file) => {
        let parser = new GameLogParser(file);
        return parser.get_log();
    });
    let states = (new ExampleGameRenderStatesGenerator(log)).get_states();
    let replayer = new ExampleGameReplayer(states);
    replayer.run();
})();