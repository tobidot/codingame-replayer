export class GameRenderElement {

    constructor(
        public object_id: string,
        public is_text: boolean = false,
        public image_id: string | null = null,
        public x: number = 0,
        public y: number = 0,
        public width: number = 10,
        public height: number = 10,
        public rotation: number = 0,
        public active: boolean = true,
    ) {

    }
}

export class GameRenderer {
    private background: HTMLImageElement;
    private images: Map<string, HTMLImageElement>;
    private elements: Array<GameRenderElement> = [];
    private elements_by_name: Map<string, GameRenderElement> = new Map();
    private context: CanvasRenderingContext2D;

    constructor(smooth: boolean = true) {
        this.context = this.create_context(smooth);
        this.images = this.create_images();
        let background = this.images.get('background');
        if (!background) throw new Error('Could not find any background image');
        this.background = background;
    }

    private create_context(smooth: boolean): CanvasRenderingContext2D {
        const target = document.getElementById('replay-target');
        if (!target) throw new Error('No replay target found');
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        target.appendChild(canvas);
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Could not create context');
        context.imageSmoothingEnabled = smooth;
        return context;
    }

    private create_images(): Map<string, HTMLImageElement> {
        let assets_element = document.getElementById('replay-assets');
        if (!assets_element) throw new Error('No Assets found');
        let images: Array<[string, HTMLImageElement]> = [];
        for (let i = 0; i < assets_element.children.length; ++i) {
            let image = assets_element.children.item(i);
            if (image instanceof HTMLImageElement) {
                images.push([image.id, image]);
            }
        }
        return new Map(images);
    }

    public run = async () => {
        return new Promise(() => {
            let update = () => {
                this.render();
                requestAnimationFrame(update);
            };
            update();
        });
    }

    public update_state(state: Map<string, GameRenderElement>) {
        for (let [object_id, element] of state.entries()) {
            this.update_element(object_id, element);
        }
    }

    public update_element(object_id: string, new_element: Partial<GameRenderElement>) {
        let old_element: Partial<GameRenderElement> | undefined = this.elements_by_name.get(object_id);
        if (!old_element) {
            const element = old_element = new GameRenderElement(object_id);
            this.elements_by_name.set(object_id, element);
            this.elements.push(element);
        }
        Object.assign(old_element, new_element);
    }

    public render() {
        // background
        const smooth = this.context.imageSmoothingEnabled;
        this.context.imageSmoothingEnabled = true;
        this.context.drawImage(this.background, 0, 0, 800, 600);
        this.context.imageSmoothingEnabled = smooth;
        // normal elements
        this.elements.forEach((element) => {
            if (element.is_text) this.render_text(element);
            else this.render_image(element);
            this.context.resetTransform();
        })
    }

    protected render_text(element: GameRenderElement) {
        if (element.image_id === null || element.active === false) return;
        // this.context.translate(element.x - element.width / 2, element.y - element.height / 2);
        // this.context.rotate(element.rotation);
        // let image = this.images.get(element.image_id);
        this.context.font = element.height + "px monospace";
        this.context.fillStyle = "black";
        this.context.fillText(element.image_id, element.x, element.y, element.width);
    }

    protected render_image(element: GameRenderElement) {
        if (element.image_id === null || element.active === false) return;
        this.context.translate(element.x - element.width / 2, element.y - element.height / 2);
        this.context.rotate(element.rotation);
        let image = this.images.get(element.image_id);
        if (image) {
            this.context.drawImage(image, 0, 0, element.width, element.height);
        } else {
            this.context.fillStyle = "purple";
            this.context.fillRect(0, 0, element.width, element.height);
        }
    }
}