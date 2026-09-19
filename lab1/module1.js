export function openWork1Dialog(onSubmit) {
  const existing = document.querySelector('.modal-backdrop');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';

  const dialog = document.createElement('div');
  dialog.className = 'modal-dialog';

  const title = document.createElement('h3');
  title.textContent = 'Робота 1';

  const input = document.createElement('input');
  input.className = 'field';
  input.type = 'text';
  input.placeholder = 'Введіть текст';

  const actions = document.createElement('div');
  actions.className = 'dialog-actions';

  const confirmButton = document.createElement('button');
  confirmButton.type = 'button';
  confirmButton.className = 'action-button primary';
  confirmButton.textContent = 'Так';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.className = 'action-button secondary';
  cancelButton.textContent = 'Відміна';

  const closeDialog = () => backdrop.remove();

  confirmButton.addEventListener('click', () => {
    const value = input.value.trim();
    if (typeof onSubmit === 'function') {
      onSubmit(value || 'Порожній рядок');
    }
    closeDialog();
  });

  cancelButton.addEventListener('click', closeDialog);

  actions.append(confirmButton, cancelButton);
  dialog.append(title, input, actions);
  backdrop.appendChild(dialog);
  document.body.appendChild(backdrop);

  input.focus();
}
