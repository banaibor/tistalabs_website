import { useEffect, useRef } from 'react';

/**
 * Safe DOM manipulation utilities that work well with React
 */
export class SafeDOM {
  private static removedElements = new WeakSet<Element>();
  private static cleanupTimeouts = new Map<Element, ReturnType<typeof setTimeout>>();

  /**
   * Safely remove a DOM element with proper checks and React compatibility
   */
  static safeRemove(element: Element | null, delay: number = 0): void {
    if (!element || this.removedElements.has(element)) {
      return; // Already removed or scheduled for removal
    }

    const doRemoval = () => {
      try {
        // Double-check element still exists and has a parent
        if (element && 
            element.parentNode && 
            element.isConnected &&
            !this.removedElements.has(element)) {
          
          // Mark as removed before actually removing
          this.removedElements.add(element);
          
          // Use the modern remove() method if available, fallback to removeChild
          if (element.remove) {
            element.remove();
          } else if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
        }
      } catch (error) {
        // Silently handle removal errors - element might already be removed by React
        console.debug('Safe removal handled conflict:', error);
      } finally {
        // Clean up our tracking
        this.cleanupTimeouts.delete(element);
      }
    };

    if (delay > 0) {
      // Cancel any existing timeout for this element
      const existingTimeout = this.cleanupTimeouts.get(element);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Schedule removal
      const timeout = setTimeout(doRemoval, delay);
      this.cleanupTimeouts.set(element, timeout);
    } else {
      doRemoval();
    }
  }

  /**
   * Cancel scheduled removal of an element
   */
  static cancelRemoval(element: Element): void {
    const timeout = this.cleanupTimeouts.get(element);
    if (timeout) {
      clearTimeout(timeout);
      this.cleanupTimeouts.delete(element);
    }
  }

  /**
   * Check if element is safe to manipulate
   */
  static isSafeToManipulate(element: Element | null): boolean {
    return !!(element && 
              element.isConnected && 
              element.parentNode && 
              !this.removedElements.has(element));
  }

  /**
   * Safely query and clean up elements
   */
  static safeQueryAndCleanup(selector: string, delay: number = 0): void {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        this.safeRemove(element, delay);
      });
    } catch (error) {
      console.debug('Safe query and cleanup handled error:', error);
    }
  }

  /**
   * Clean up all tracked timeouts (useful for component unmount)
   */
  static cleanup(): void {
    this.cleanupTimeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });
    this.cleanupTimeouts.clear();
  }
}

/**
 * Hook for safe DOM cleanup on component unmount
 */
export function useSafeCleanup(selectors: string[] = ['.warp-overlay', '[data-warp-overlay="true"]']) {
  const isUnmountingRef = useRef(false);

  useEffect(() => {
    return () => {
      isUnmountingRef.current = true;
      
      // Clean up any elements matching the selectors
      selectors.forEach(selector => {
        SafeDOM.safeQueryAndCleanup(selector, 0);
      });
      
      // Clean up any pending timeouts
      SafeDOM.cleanup();
    };
  }, []);

  return isUnmountingRef;
}