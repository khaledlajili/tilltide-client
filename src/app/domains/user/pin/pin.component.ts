import { Component, inject, signal, HostListener, OnInit } from '@angular/core'; // Added HostListener
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '@/app/core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { EmployeeCacheService } from '@/app/core/services/employee-cache.service';
import { CachedEmployee } from '@/app/core/db/pos-db';

@Component({
    standalone: true,
    imports: [CommonModule, ButtonModule, ToastModule, FormsModule, SelectModule],
    providers: [MessageService],
    templateUrl: './pin.component.html',
})
export class PinComponent implements OnInit {
    pin = signal<string>('');
    loading = false;
    employees: CachedEmployee[] = [];
    selectedEmployeeId: string | null = null;

    private auth = inject(AuthService);
    private messageService = inject(MessageService);
    private employeeCache = inject(EmployeeCacheService);

    async ngOnInit(): Promise<void> {
        this.employees = await this.employeeCache.getAll();
        if (this.employees.length === 1) {
            this.selectedEmployeeId = this.employees[0].id;
        }
    }

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
            if (!this.selectedEmployeeId) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Select employee',
                    detail: 'Choose an employee before entering the PIN.'
                });
                this.loading = false;
                return;
            }

            const success = await this.auth.loginEmployeeWithPin(this.pin(), this.selectedEmployeeId);
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
