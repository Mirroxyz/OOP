const TYPE_NAMES = {
    point: 'Крапка',
    line: 'Лінія',
    rect: 'Прямокутник',
    ellipse: 'Еліпс',
    dottedLine: 'Лінія з кружечками',
    cube: 'Каркас куба'
};

export class MyTable {
    constructor({ onSelect, onDelete, onClose }) {
        this.onSelect = onSelect;
        this.onDelete = onDelete;
        this.onClose = onClose;
        this.selectedIndex = -1;
        this.dialog = null;
        this.body = null;
    }

    open() {
        if (this.dialog) {
            this.dialog.focus();
            return;
        }
        this.dialog = document.createElement('section');
        this.dialog.className = 'table-window';
        this.dialog.tabIndex = -1;
        this.dialog.setAttribute('aria-label', 'Таблиця графічних об’єктів');
        this.dialog.innerHTML = `
            <div class="table-titlebar">
                <strong>Таблиця графічних об'єктів</strong>
                <button type="button" class="close-table" aria-label="Закрити таблицю">×</button>
            </div>
            <div class="table-content">
                <table>
                    <thead><tr><th>№</th><th>Назва</th><th>x1</th><th>y1</th><th>x2</th><th>y2</th></tr></thead>
                    <tbody></tbody>
                </table>
                <div class="table-actions">
                    <button type="button" class="delete-object">Вилучити вибраний</button>
                </div>
                <p class="table-hint">Клацніть рядок, щоб виділити об'єкт на полотні.</p>
            </div>`;
        document.body.append(this.dialog);
        this.body = this.dialog.querySelector('tbody');
        this.dialog.querySelector('.close-table').addEventListener('click', () => this.close());
        this.dialog.querySelector('.delete-object').addEventListener('click', () => {
            if (this.selectedIndex >= 0) {
                this.onDelete(this.selectedIndex);
                this.selectedIndex = -1;
            }
        });
        this.dialog.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.close();
            }
        });
        this.dialog.focus();
    }

    close() {
        if (!this.dialog) {
            return;
        }
        this.dialog.remove();
        this.dialog = null;
        this.body = null;
        this.selectedIndex = -1;
        this.onClose();
    }

    update(shapes) {
        if (!this.body) {
            return;
        }
        this.body.replaceChildren();
        shapes.forEach((shape, index) => {
            const row = document.createElement('tr');
            row.dataset.index = String(index);
            if (index === this.selectedIndex) {
                row.classList.add('selected');
            }
            [index + 1, TYPE_NAMES[shape.type] || shape.type, shape.x1, shape.y1, shape.x2, shape.y2]
                .forEach((value) => {
                    const cell = document.createElement('td');
                    cell.textContent = String(value);
                    row.append(cell);
                });
            row.addEventListener('click', () => {
                this.selectedIndex = index;
                this.update(shapes);
                this.onSelect(index);
            });
            this.body.append(row);
        });
    }
}
