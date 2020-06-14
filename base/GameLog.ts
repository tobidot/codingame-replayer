export interface GameLogEvent {
    step: number;
    channel: string;
    message: string;
}

export class GameLog {
    private channels: string[];
    private events: GameLogEvent[];
    private current_step: number = 0;

    constructor(builder: GameLogBuilder) {
        this.channels = builder.channels;
        this.events = builder.log;
    }
    public get_channels(): Array<string> {
        return this.channels;
    }
    public for_step(index: number): GameLogEvent[] {
        this.current_step = index;
        return this.events.filter(event => event.step == index);
    }
    public next() {
        return this.for_step(this.current_step++);
    }
}

export class GameLogBuilder {
    public channels: string[] = []
    public log: GameLogEvent[] = [];
    public current_step: number = 0;
    public set_step(step: number): this {
        this.current_step = step;
        return this;
    }

    public add_event(channel: string, message: string): this {
        if (this.channels.indexOf(channel) === -1) {
            this.channels.push(channel);
        }
        this.log.push({
            step: this.current_step,
            channel,
            message
        });
        return this;
    }

}