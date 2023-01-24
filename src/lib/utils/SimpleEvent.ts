
export type SimpleEventListener<TEvent> = (eventName: TEvent) => void;

export class SimpleEventDispatcher<TEvent> {
    private readonly listeners = new Set<SimpleEventListener<TEvent>>();

    register(listener: SimpleEventListener<TEvent>) {
        this.listeners.add(listener);
    }

    unregister(listener: SimpleEventListener<TEvent>) {
        this.listeners.delete(listener);
    }

    unregisterAll() {
        this.listeners.clear();
    }

    dispatch(eventName: TEvent) {
        this.listeners.forEach(listen => listen(eventName));
    }

}