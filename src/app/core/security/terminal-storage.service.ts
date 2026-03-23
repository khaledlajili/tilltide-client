import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TerminalStorageService {

    private dbName = 'tilltide-terminal';

    async saveTerminalContext(data: any) {
        localStorage.setItem(this.dbName, JSON.stringify(data));
    }

    loadTerminalContext() {
        const raw = localStorage.getItem(this.dbName);
        return raw ? JSON.parse(raw) : null;
    }

    clear() {
        localStorage.removeItem(this.dbName);
    }
}
