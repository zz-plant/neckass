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
            return headlines
                .map((_, index) => index)
                .filter((index) => index >= baseHeadlineCount);
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

        elements.headlineList.innerHTML = '';

        if (elements.historyCount) {
            elements.historyCount.textContent = `${indexes.length} items`;
        }

        if (indexes.length === 0) {
            const item = document.createElement('li');
            item.className = 'headline-item headline-item--empty';
            item.textContent = 'No headlines available in this view.';
            elements.headlineList.appendChild(item);
            return;
        }

        const fragment = document.createDocumentFragment();
        indexes.forEach((index) => {
            fragment.appendChild(createHistoryListItem({ index, currentIndex, headlines }));
        });
        elements.headlineList.appendChild(fragment);
    }

    Neckass.createHistoryListItem = createHistoryListItem;
    Neckass.getPanelIndexPool = getPanelIndexPool;
    Neckass.getPanelIndexes = getPanelIndexes;
    Neckass.updateHistoryList = updateHistoryList;
})();
