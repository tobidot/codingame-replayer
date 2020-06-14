import { GameLog, GameLogBuilder } from "./GameLog";

export default class GameLogParser {
    private log: GameLog | null = null;
    private resolver: Array<(log: GameLog) => void> = [];
    private rejecter: Array<(message: string) => void> = [];

    constructor(file: File) {
        file.text().then((text: string) => {
            const log = this.parse_string(text);
            this.log = log;
            this.resolver.forEach(resolve => resolve(log));
        }).catch((message: string) => {
            this.rejecter.forEach(rejecter => rejecter(message));
        });
    }

    private parse_string(text: string): GameLog {
        let builder = new GameLogBuilder();
        text.split("\n").map((line: string) => {
            let channel_message = line.split('>>>');
            let channel = channel_message.shift();
            if (!channel) return null;
            if (channel_message.length === 0) return null;
            channel = channel.trim();
            let message = channel_message.join('').trim();
            return {
                channel,
                message,
            };
        }).filter(
            event => event !== null
        ).forEach((event) => {
            if (!event) throw new Error();
            const { channel, message } = event;
            if (channel === "STEP") {
                const content = (message.replace(/#/g, '')
                    .replace('Step', '')
                    .trim());
                const step_number = parseInt(content);
                builder.set_step(step_number);
            } else {
                builder.add_event(channel, message);
            }
        });
        return new GameLog(builder);
    }

    public async get_log(): Promise<GameLog> {
        if (this.log) return Promise.resolve(this.log);
        return new Promise((resolve, reject) => {
            this.resolver.push(resolve);
            this.rejecter.push(reject);
        });
    }
}