export default class InputFileHandler {
    private file: File | null = null;
    private resolver: Array<(file: File) => void> = [];

    constructor() {
        let file_input = document.getElementById('replay-source');
        if (!(file_input instanceof HTMLInputElement)) throw new Error();
        file_input.addEventListener('change', (event) => {
            const file_list = (<HTMLInputElement>event.target).files;
            if (file_list) {
                let file = file_list.item(0);
                if (file) {
                    this.file = file;
                    this.resolver.forEach((resolver) => {
                        resolver(file as File);
                    });
                }
            }
        });
    }
    public async get_file(): Promise<File> {
        if (this.file) return Promise.resolve(this.file);
        return new Promise((resolve) => {
            this.resolver.push(resolve);
        });
    }
}