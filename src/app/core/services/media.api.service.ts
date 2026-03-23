import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, switchMap } from 'rxjs';
import { Media, MediaUploadRequest, MediaUploadResponse } from '../models/catalog.model';

@Injectable({ providedIn: 'root' })
export class MediaApiService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/api/media`;

    uploadAndConfirm(file: File, request: MediaUploadRequest): Observable<Media> {
        // 1. Get SAS URL from Backend
        return this.http.post<MediaUploadResponse>(`${this.baseUrl}/upload-url`, request).pipe(
            switchMap(res =>
                // 2. Direct PUT to Azure Blob Storage
                this.http.put(res.uploadUrl, file, {
                    headers: { 'x-ms-blob-type': 'BlockBlob', 'Content-Type': file.type }
                }).pipe(
                    // 3. Confirm upload to Backend to save in DB
                    switchMap(() => this.http.post<Media>(`${this.baseUrl}/confirm`, request, {
                        params: { blobPath: res.blobPath, containerName: res.containerName }
                    }))
                )
            )
        );
    }
}
