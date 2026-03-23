import { Component, inject, signal, HostListener } from '@angular/core'; // Added HostListener
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
    standalone: true,
    imports: [CommonModule, ButtonModule, ToastModule],
    providers: [MessageService],
    templateUrl: './pin.component.html',
})
export class PinComponent {
    pin = signal<string>('');
    loading = false;

    private auth = inject(AuthService);
    private messageService = inject(MessageService);

    // This listens for any keydown event on the page
    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        // 1. Check if the key is a number (0-9)
        if (/^\d$/.test(event.key)) {
            this.addDigit(event.key);
        }
        // 2. Check if the key is Backspace
        else if (event.key === 'Backspace') {
            this.backspace();
        }
        // 3. Optional: Clear on Escape
        else if (event.key === 'Escape') {
            this.pin.set('');
        }
    }

    async addDigit(digit: string) {
        if (this.loading || this.pin().length >= 4) return;

        this.pin.update(v => v + digit);

        if (this.pin().length === 4) {
            await this.verify();
        }
    }

    async verify() {
        this.loading = true;
        // Small delay for UI feedback
        setTimeout(async () => {
            const success = await this.auth.loginWithPin(this.pin());
            if (!success) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Invalid PIN'
                });
                this.pin.set('');
                this.loading = false;
            }
        }, 100);
    }

    backspace() {
        if (this.loading) return;
        this.pin.update(v => v.slice(0, -1));
    }

    logout() {
        this.auth.logout();
    }
}
