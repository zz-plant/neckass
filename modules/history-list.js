(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;

    function createHistoryListItem({ index, currentIndex, headlines }) {
        const item = document.createElement('li');
        item.className = 'headline-item';
        if (index === currentIndex) {
            item.classList.add('headline-item--active');
        }
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.index = String(index);
        button.textContent = headlines[index];
        item.appendChild(button);
        return item;
    }

    function updateHistoryList({
        elements,
        headlines,
        navigationStack,
        currentIndex,
    }) {
        if (!elements.headlineList) return;

        // The wire's history is where the reader has been, newest first.
        const indexes = [...navigationStack].reverse();

        // A history containing only the present is not a history.
        const section = elements.headlineList.closest('section');
        if (section) section.hidden = indexes.length < 2;

        if (elements.historyCount) {
            elements.historyCount.textContent =
                indexes.length === 1 ? '1 item' : `${indexes.length} items`;
        }

        const currentChildren = Array.from(elements.headlineList.children);
        const hasSameIndexes =
            currentChildren.length === indexes.length &&
            currentChildren.every((child, position) => {
                const button = child.querySelector('button[data-index]');
                return (
                    button &&
                    Number.parseInt(button.dataset.index, 10) ===
                        indexes[position]
                );
            });

        if (indexes.length === 0) {
            const existingEmpty =
                currentChildren.length === 1 &&
                currentChildren[0].classList.contains('headline-item--empty');
            if (!existingEmpty) {
                elements.headlineList.innerHTML = '';
                const item = document.createElement('li');
                item.className = 'headline-item headline-item--empty';
                item.textContent = 'Nothing on file yet.';
                elements.headlineList.appendChild(item);
            }
            return;
        }

        if (!hasSameIndexes) {
            elements.headlineList.innerHTML = '';
            const fragment = document.createDocumentFragment();
            indexes.forEach((index) => {
                fragment.appendChild(
                    createHistoryListItem({ index, currentIndex, headlines }),
                );
            });
            elements.headlineList.appendChild(fragment);
            return;
        }

        currentChildren.forEach((child, position) => {
            const isActive = indexes[position] === currentIndex;
            child.classList.toggle('headline-item--active', isActive);
        });
    }

    Neckass.createHistoryListItem = createHistoryListItem;
    Neckass.updateHistoryList = updateHistoryList;
})();
