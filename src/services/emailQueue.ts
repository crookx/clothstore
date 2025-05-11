import { Resend } from 'resend';
import { EmailJob, EmailPriority } from '@/types';

interface QueuedEmail {
  id: string;
  priority: EmailPriority;
  attempts: number;
  lastAttempt?: Date;
  job: EmailJob;
}

export class EmailQueue {
  private queue: QueuedEmail[] = [];
  private maxRetries = 3;
  private processing = false;

  constructor(private resend: Resend) {}

  async addToQueue(job: EmailJob, priority: EmailPriority = 'normal') {
    this.queue.push({
      id: crypto.randomUUID(),
      priority,
      attempts: 0,
      job
    });

    if (!this.processing) {
      await this.processQueue();
    }
  }

  private async processQueue() {
    this.processing = true;

    try {
      // Sort by priority and attempts
      this.queue.sort((a, b) => {
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (a.priority !== 'high' && b.priority === 'high') return 1;
        return a.attempts - b.attempts;
      });

      while (this.queue.length > 0) {
        const email = this.queue[0];
        
        try {
          await this.resend.emails.send(email.job);
          this.queue.shift(); // Remove successful email
        } catch (error) {
          console.error(`Failed to send email ${email.id}:`, error);
          
          if (email.attempts >= this.maxRetries) {
            this.queue.shift(); // Remove failed email after max retries
            continue;
          }

          email.attempts++;
          email.lastAttempt = new Date();
          // Move to end of queue
          this.queue.shift();
          this.queue.push(email);
        }

        // Wait between sends to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } finally {
      this.processing = false;
    }
  }
}