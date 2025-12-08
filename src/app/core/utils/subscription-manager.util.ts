import { Subscription } from 'rxjs';

/**
 * Subscription Manager Utility
 * Manages multiple subscriptions and provides easy cleanup
 */
export class SubscriptionManager {
  private subscriptions: Subscription[] = [];

  /**
   * Add subscription to manager
   */
  add(subscription: Subscription): void {
    this.subscriptions.push(subscription);
  }

  /**
   * Unsubscribe from all subscriptions
   */
  unsubscribeAll(): void {
    this.subscriptions.forEach(sub => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
    this.subscriptions = [];
  }

  /**
   * Get current subscription count
   */
  get count(): number {
    return this.subscriptions.length;
  }

  /**
   * Check if has active subscriptions
   */
  get hasActive(): boolean {
    return this.subscriptions.some(sub => !sub.closed);
  }
}


