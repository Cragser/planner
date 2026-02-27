/** Global keyboard shortcuts handler (SC-007)
 * n = new task
 * 1 = backlog view
 * 2 = kanban view
 * 3 = gantt view
 * / = focus search
 * Esc = close modal/panel
 */

export function initKeyboardShortcuts(): void {
  document.addEventListener('keydown', handleKeyDown);
}

function handleKeyDown(e: KeyboardEvent): void {
  // Skip if user is typing in an input/textarea/select
  const target = e.target as HTMLElement;
  const isEditing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable;

  // Esc always works (close modals)
  if (e.key === 'Escape') {
    e.preventDefault();
    closeModals();
    return;
  }

  // Don't handle shortcuts when editing (except Esc above)
  if (isEditing) return;

  // Don't handle shortcuts with modifier keys (except specific combos)
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  switch (e.key) {
    case 'n':
      e.preventDefault();
      openNewTaskForm();
      break;
    case '1':
      e.preventDefault();
      switchView('backlog');
      break;
    case '2':
      e.preventDefault();
      switchView('kanban');
      break;
    case '3':
      e.preventDefault();
      switchView('gantt');
      break;
    case '/':
      e.preventDefault();
      focusSearch();
      break;
  }
}

function closeModals(): void {
  document.querySelectorAll('.modal-overlay').forEach((el) => {
    (el as HTMLElement).style.display = 'none';
  });
  // Dispatch custom event for any listeners
  document.dispatchEvent(new CustomEvent('planner:close-modals'));
}

function openNewTaskForm(): void {
  document.dispatchEvent(new CustomEvent('planner:new-task'));
}

function switchView(view: string): void {
  // Update view switcher buttons
  document.querySelectorAll('#view-switcher .view-btn').forEach((btn) => {
    btn.classList.toggle('active', (btn as HTMLElement).dataset.view === view);
  });
  document.dispatchEvent(new CustomEvent('planner:switch-view', { detail: { view } }));
}

function focusSearch(): void {
  const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
  if (searchInput) {
    searchInput.focus();
    searchInput.select();
  }
}
