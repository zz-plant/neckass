(() => {
    const Neckass = window.Neckass = window.Neckass || {};

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

    function getPanelIndexPool({ panel, favoriteHeadlines, headlineCache, headlines, baseHeadlineCount, navigationStack }) {
        if (panel === 'favorites') {
            return Array.from(favoriteHeadlines)
                .map((headline) => headlineCache.get(headline))
                .filter((index) => Number.isInteger(index));
        }

        if (panel === 'generated') {
            const generatedIndexes = [];
            for (let index = baseHeadlineCount; index < headlines.length; index += 1) {
                generatedIndexes.push(index);
            }
            return generatedIndexes;
        }

        return [...navigationStack].reverse();
    }

    function getPanelIndexes({ panel, isIndexEligible, favoriteHeadlines, headlineCache, headlines, baseHeadlineCount, navigationStack }) {
        const indexes = getPanelIndexPool({
            panel,
            favoriteHeadlines,
            headlineCache,
            headlines,
            baseHeadlineCount,
            navigationStack
        });
        return indexes.filter((index) => isIndexEligible(index));
    }

    function updateHistoryList({ elements, panel, isIndexEligible, favoriteHeadlines, headlineCache, headlines, baseHeadlineCount, navigationStack, currentIndex }) {
        if (!elements.headlineList) return;

        const indexes = getPanelIndexes({
            panel,
            isIndexEligible,
            favoriteHeadlines,
            headlineCache,
            headlines,
            baseHeadlineCount,
            navigationStack
        });

        if (elements.historyCount) {
            elements.historyCount.textContent = `${indexes.length} items`;
        }

        const currentChildren = Array.from(elements.headlineList.children);
        const hasSameIndexes = currentChildren.length === indexes.length
            && currentChildren.every((child, position) => {
                const button = child.querySelector('button[data-index]');
                return button && Number.parseInt(button.dataset.index, 10) === indexes[position];
            });

        if (indexes.length === 0) {
            const existingEmpty = currentChildren.length === 1
                && currentChildren[0].classList.contains('headline-item--empty');
            if (!existingEmpty) {
                elements.headlineList.innerHTML = '';
                const item = document.createElement('li');
                item.className = 'headline-item headline-item--empty';
                item.textContent = 'No headlines available in this view.';
                elements.headlineList.appendChild(item);
            }
            return;
        }

        if (!hasSameIndexes) {
            elements.headlineList.innerHTML = '';
            const fragment = document.createDocumentFragment();
            indexes.forEach((index) => {
                fragment.appendChild(createHistoryListItem({ index, currentIndex, headlines }));
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
    Neckass.getPanelIndexPool = getPanelIndexPool;
    Neckass.getPanelIndexes = getPanelIndexes;
    Neckass.updateHistoryList = updateHistoryList;
})();
