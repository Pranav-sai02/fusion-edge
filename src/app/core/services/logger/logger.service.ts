import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  logError(error: any, context?: string): void {
    console.error(`[ERROR] [${context || 'Unknown Context'}]`, error);
    // Optional: send to external logging tool (Sentry, LogRocket, etc.)
  }

  logInfo(message: string, context?: string): void {
    console.info(`[INFO] [${context || 'General'}]: ${message}`);
  }

  logWarning(message: string, context?: string): void {
    console.warn(`[WARNING] [${context || 'General'}]: ${message}`);
  }
}
