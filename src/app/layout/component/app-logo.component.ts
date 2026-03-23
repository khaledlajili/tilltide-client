// Edited file: src/app/layout/component/app-logo.component.ts
import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-logo',
    standalone: true,
    imports: [NgClass],
    template: `
        <svg viewBox="0 0 93.6 16.6" xmlns="http://www.w3.org/2000/svg" [ngClass]="getSizeClass()" style="overflow:visible;">
            <defs>
                <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="13.8052" y1="35.3131" x2="29.465" y2="19.6533" gradientTransform="matrix(0.999 -0.0442 0.0442 0.999 -14.9085 -18.2135)">
                    <stop offset="0" style="stop-color:#004BBD" />
                    <stop offset="0.5" style="stop-color:#86BEFF" />
                    <stop offset="1" style="stop-color:#004BBD" />
                </linearGradient>
                <linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="-14.0335" y1="688.1217" x2="1.6262" y2="672.462" gradientTransform="matrix(0.9974 0.0726 0.0726 -0.9974 -35.2494 687.2354)">
                    <stop offset="0" style="stop-color:#004BBD" />
                    <stop offset="0.5" style="stop-color:#86BEFF" />
                    <stop offset="1" style="stop-color:#004BBD" />
                </linearGradient>
            </defs>
            <g>
                <g class="fill-surface-900 dark:fill-surface-0">
                    <path d="M25.7,16.3V4.5h-3.8V1.2H33v3.2h-3.9v11.9H25.7z" />
                    <path d="M36.2,4.2c-0.5,0-1-0.2-1.4-0.6c-0.4-0.4-0.6-0.9-0.6-1.4s0.2-1,0.6-1.4c0.4-0.4,0.9-0.6,1.4-0.6 c0.6,0,1,0.2,1.4,0.6c0.4,0.4,0.6,0.9,0.6,1.4s-0.2,1-0.6,1.4C37.2,4,36.8,4.2,36.2,4.2z M34.6,16.3V5.7h3.2v10.6H34.6z" />
                    <path d="M40.5,16.3V0.4h3.2v15.9H40.5z" />
                    <path d="M46.3,16.3V0.4h3.2v15.9H46.3z" />
                    <path d="M55.1,16.3V4.5h-3.8V1.2h11.1v3.2h-3.9v11.9H55.1z" />
                    <path d="M65.7,4.2c-0.5,0-1-0.2-1.4-0.6c-0.4-0.4-0.6-0.9-0.6-1.4s0.2-1,0.6-1.4c0.4-0.4,0.9-0.6,1.4-0.6 c0.6,0,1,0.2,1.4,0.6c0.4,0.4,0.6,0.9,0.6,1.4s-0.2,1-0.6,1.4C66.7,4,66.2,4.2,65.7,4.2z M64.1,16.3V5.7h3.2v10.6H64.1z" />
                    <path
                        d="M74.2,16.5c-1.4,0-2.5-0.5-3.5-1.6c-1-1.1-1.4-2.4-1.4-3.9s0.5-2.8,1.4-3.9c1-1.1,2.1-1.6,3.5-1.6 c1.2,0,2.2,0.4,2.9,1.3V0.4h3.2v15.9h-3.2v-1.1C76.4,16.1,75.4,16.5,74.2,16.5z M73.2,12.9c0.4,0.5,1,0.7,1.8,0.7 c0.7,0,1.3-0.2,1.8-0.7c0.4-0.5,0.7-1.1,0.7-1.9s-0.2-1.4-0.7-1.9c-0.4-0.5-1-0.7-1.8-0.7c-0.7,0-1.3,0.2-1.8,0.7 c-0.4,0.5-0.7,1.1-0.7,1.9S72.7,12.4,73.2,12.9z"
                    />
                    <path
                        d="M87.9,16.5c-1.6,0-3-0.5-4-1.6c-1.1-1-1.6-2.4-1.6-4c0-1.6,0.5-2.9,1.6-4c1.1-1,2.4-1.6,4-1.6 c0.8,0,1.5,0.1,2.2,0.4C90.8,6.1,91.4,6.5,92,7c0.5,0.5,0.9,1.2,1.2,2c0.3,0.8,0.4,1.7,0.4,2.7h-8.2c0.1,0.6,0.3,1.1,0.8,1.5 c0.5,0.4,1.1,0.6,1.9,0.6c0.5,0,0.9-0.1,1.3-0.3c0.4-0.2,0.6-0.4,0.8-0.7h3.4c-0.3,1.1-1,2-2,2.7C90.5,16.2,89.3,16.5,87.9,16.5z M87.9,8c-0.6,0-1.1,0.2-1.5,0.5c-0.4,0.3-0.7,0.7-0.8,1.2h4.5c-0.2-0.6-0.4-1-0.9-1.3C88.8,8.1,88.3,8,87.9,8z"
                    />
                </g>
                <path fill="url(#SVGID_1_)" d="M15.5,0.2l-2.6,0.1C11.3,0.4,10,1.4,9.5,2.8L7.8,7.3c-0.2,0.6-0.8,1-1.4,1L0,8.6l0.3,7.7l1.8-0.1 c1.5-0.1,2.9-1.1,3.4-2.5l1.6-4.5c0.2-0.6,0.8-1,1.4-1l7.3-0.3L15.5,0.2z" />
                <path fill="url(#SVGID_2_)" d="M15.3,16.6l-2.6-0.2c-1.5-0.1-2.9-1.1-3.4-2.6L7.8,9.2c-0.2-0.6-0.7-1-1.4-1.1L0,7.7L0.6,0l1.8,0.1 c1.5,0.1,2.9,1.1,3.4,2.6l1.5,4.5c0.2,0.6,0.7,1,1.4,1.1l7.3,0.5L15.3,16.6z" />
            </g>
        </svg>
    `
})
export class AppLogo {
    @Input() size: 'small' | 'large' = 'large';

    getSizeClass() {
        return this.size === 'small' ? 'h-6 w-auto shrink-0' : 'mb-8 h-12 w-auto shrink-0 mx-auto';
    }
}
