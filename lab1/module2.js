export function openWork2Dialog(onSubmit) {
  const existing = document.querySelector('.modal-backdrop');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';

  const dialog = document.createElement('div');
  dialog.className = 'modal-dialog';

  const title = document.createElement('h3');
  title.textContent = 'Робота 2';

  const sliderBox = document.createElement('div');
  sliderBox.className = 'slider-box';

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '1';
  slider.max = '100';
  slider.value = '50';

  const valueLabel = document.createElement('span');
  valueLabel.className = 'value-label';
  valueLabel.textContent = slider.value;

  slider.addEventListener('input', () => {
    valueLabel.textContent = slider.value;
  });

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
    if (typeof onSubmit === 'function') {
      onSubmit(slider.value);
    }
    closeDialog();
  });

  cancelButton.addEventListener('click', closeDialog);

  sliderBox.append(slider, valueLabel);
  actions.append(confirmButton, cancelButton);
  dialog.append(title, sliderBox, actions);
  backdrop.appendChild(dialog);
  document.body.appendChild(backdrop);
}
