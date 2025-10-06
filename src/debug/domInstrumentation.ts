// Dev-only DOM instrumentation for diagnosing NotFoundError removeChild races
// Automatically patches Node/Element removal methods to log suspicious removals.

if (import.meta.env.DEV && typeof window !== 'undefined') {
  const MAX_LOGS = 8;
  let logged = 0;
  const originalRemoveChild = Node.prototype.removeChild;
  const originalRemove = Element.prototype.remove;

  function describe(el: any) {
    if (!el) return '[null]';
    try {
      const name = el.tagName || el.nodeName;
      const id = el.id ? `#${el.id}` : '';
      const cls = el.classList && el.classList.length ? '.' + Array.from(el.classList).join('.') : '';
      const data = (el.getAttributeNames ? el.getAttributeNames() : [])
        .filter((n: string) => n.startsWith('data-'))
        .map((n: string) => `${n}="${el.getAttribute(n)}"`) || [];
      return `<${name}${id}${cls}${data.length ? ' ' + data.join(' ') : ''}>`;
    } catch {
      return '[uninspectable node]';
    }
  }

  function logConflict(kind: string, parent: any, child: any, error?: any) {
    if (logged >= MAX_LOGS) return; // prevent flooding
    logged++;
    const stack = new Error().stack?.split('\n').slice(2, 11).join('\n') || 'no stack';
    // eslint-disable-next-line no-console
    console.warn(`SafeDOM instrumentation (${kind}) potential race #${logged}:\n` +
      `Parent: ${describe(parent)}\nChild: ${describe(child)}\nConnected(parent?): ${!!parent?.isConnected} | Connected(child?): ${!!child?.isConnected}\n` +
      (error ? `Error: ${error}\n` : '') +
      `Stack (trimmed):\n${stack}`);
  }

  // Global array for introspection (accessible via window.__REMOVE_CHILD_LOG__)
  (window as any).__REMOVE_CHILD_LOG__ = (window as any).__REMOVE_CHILD_LOG__ || [];

  Node.prototype.removeChild = function patchedRemoveChild<T extends Node>(this: Node, child: T): T {
    const parentDesc = describe(this);
    const childDesc = describe(child);
    try {
      if (!child) {
        logConflict('removeChild-null-child', this, child);
        (window as any).__REMOVE_CHILD_LOG__.push({ kind: 'null-child', ts: Date.now(), parent: parentDesc, child: childDesc });
        return child as T;
      }
      if (child.parentNode !== this) {
        // Log mismatch but DO NOT short‑circuit removal attempts for valid cases
        logConflict('removeChild-parent-mismatch', this, child);
        (window as any).__REMOVE_CHILD_LOG__.push({ kind: 'parent-mismatch', ts: Date.now(), parent: parentDesc, child: childDesc, actualParent: describe(child.parentNode) });
        // If the node still has a parent, let the native method throw; React will surface if truly problematic
      }
      const ret = originalRemoveChild.call(this, child) as T;
      (window as any).__REMOVE_CHILD_LOG__.push({ kind: 'removed', ts: Date.now(), parent: parentDesc, child: childDesc });
      return ret;
    } catch (err: any) {
      // Swallow ONLY NotFoundError to avoid crashing, but allow other errors to propagate
      const name = err?.name || '';
      if (name === 'NotFoundError') {
        logConflict('removeChild-notfound-swallowed', this, child, err);
        (window as any).__REMOVE_CHILD_LOG__.push({ kind: 'notfound-swallowed', ts: Date.now(), parent: parentDesc, child: childDesc, error: String(err) });
        return child as T; // Best-effort fallback
      }
      logConflict('removeChild-exception', this, child, err);
      (window as any).__REMOVE_CHILD_LOG__.push({ kind: 'exception', ts: Date.now(), parent: parentDesc, child: childDesc, error: String(err) });
      throw err;
    }
  };

  Element.prototype.remove = function patchedRemove(this: Element): void {
    try {
      if (!this.parentNode) {
        logConflict('remove-detached', this, this);
      }
      return originalRemove.call(this);
    } catch (err) {
      logConflict('remove-exception', this.parentNode, this, err);
      throw err;
    }
  };

  // eslint-disable-next-line no-console
  console.info('[domInstrumentation] removeChild / remove patched for diagnostics');
}
