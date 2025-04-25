import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

class SessionManagerHub {
    private connection: HubConnection;

    constructor() {
        this.connection = new HubConnectionBuilder()
            .withUrl('https://localhost:7204/realtime')
            .withAutomaticReconnect()
            .build();
    }

    get connectionState(): string {
        return this.connection.state;
    }

    async startConnection(): Promise<void> {
        try {
            if (this.connection.state === 'Disconnected') {
                await this.connection.start();
            }
        } catch (err) {
            console.error('Error connecting to SignalR hub:', err);
        }
    }

    async joinSession(sessionCode: string): Promise<void> {
        try {
            if (this.connection.state === 'Connected') {
                await this.connection.invoke('JoinSession', sessionCode);
            } else {
                console.error('Cannot join session: Connection is not in the "Connected" state.');
            }
        } catch (err) {
            console.error('Error joining session:', err);
        }
    }

    stopConnection(): void {
        if (this.connection.state === 'Connected') {
            this.connection.stop();
        }
    }

    async notifyPlayerJoined(sessionCode: string): Promise<void> {
        try {
            if (this.connection.state === 'Connected') {
                await this.connection.invoke('PlayerJoined', sessionCode);
            } else {
                console.error('Cannot notify hub: Connection is not in the "Connected" state.');
            }
        } catch (err) {
            console.error('Error notifying hub about player joining:', err);
        }
    }

    onPlayerJoined(callback: (sessionCode: string) => void): void {
        this.connection.on('playerJoined', callback);
    }

    onVoteCast(callback: (sessionCode: string) => void): void {
        this.connection.on('voteCast', callback);
    }
}

export default new SessionManagerHub();
