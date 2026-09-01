(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;

    const STREAK_MILESTONES = [3, 5, 8, 12];
    const SHUFFLE_BADGE_LABELS = {
        3: 'Starter',
        5: 'Momentum',
        8: 'Surge',
        12: 'All-star',
    };

    /**
     * Daily-return and shuffle streaks, plus the badge/celebration rendering
     * they drive. Mixed into HeadlineApp.prototype by app.js, so every method
     * here sees the same `this` it did as a class member.
     */
    Neckass.streakMethods = {
        normalizeDailyEngagement(rawEngagement) {
            const parsed =
                rawEngagement && typeof rawEngagement === 'object'
                    ? rawEngagement
                    : {};
            const streakDays =
                Number.isInteger(parsed.streakDays) && parsed.streakDays > 0
                    ? parsed.streakDays
                    : 0;
            const visitsThisDate =
                Number.isInteger(parsed.visitsThisDate) &&
                parsed.visitsThisDate > 0
                    ? parsed.visitsThisDate
                    : 0;
            const maxStreakDays =
                Number.isInteger(parsed.maxStreakDays) &&
                parsed.maxStreakDays > 0
                    ? parsed.maxStreakDays
                    : streakDays;

            return {
                lastVisitDate:
                    typeof parsed.lastVisitDate === 'string'
                        ? parsed.lastVisitDate
                        : '',
                streakDays,
                visitsThisDate,
                maxStreakDays,
            };
        },

        getDateKey(date = new Date()) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        getDayDifference(previousDateKey, currentDateKey) {
            const toDate = (key) => {
                const [year, month, day] = key.split('-').map(Number);
                return new Date(year, (month || 1) - 1, day || 1);
            };

            const previous = toDate(previousDateKey);
            const current = toDate(currentDateKey);
            if (
                Number.isNaN(previous.getTime()) ||
                Number.isNaN(current.getTime())
            ) {
                return Number.NaN;
            }

            const msPerDay = 24 * 60 * 60 * 1000;
            return Math.round((current - previous) / msPerDay);
        },

        refreshDailyEngagement() {
            const todayKey = this.getDateKey();
            const engagement = this.normalizeDailyEngagement(
                this.dailyEngagement,
            );
            const previousKey = engagement.lastVisitDate;

            this.dailyVisitMeta = {
                isReturnVisitToday: previousKey === todayKey,
                advancedStreakToday: false,
            };

            if (!previousKey) {
                engagement.streakDays = 1;
                engagement.visitsThisDate = 1;
            } else if (previousKey === todayKey) {
                engagement.visitsThisDate += 1;
            } else {
                const dayDifference = this.getDayDifference(
                    previousKey,
                    todayKey,
                );
                engagement.streakDays =
                    dayDifference === 1 ? engagement.streakDays + 1 : 1;
                engagement.visitsThisDate = 1;
                this.dailyVisitMeta.advancedStreakToday = dayDifference === 1;
            }

            engagement.lastVisitDate = todayKey;
            engagement.maxStreakDays = Math.max(
                engagement.maxStreakDays || 0,
                engagement.streakDays,
            );

            this.dailyEngagement = engagement;
            this.state.dailyEngagement = engagement;
            this.persistState();
            this.maybeCelebrateDailyMilestone();
        },

        renderDailyStreak() {
            if (!this.elements.dailyStreak) return;

            const streakDays = this.dailyEngagement.streakDays || 1;
            const visitsToday = this.dailyEngagement.visitsThisDate || 1;
            const dayLabel = streakDays === 1 ? 'day' : 'days';
            let suffix = 'Back tomorrow.';

            if (this.dailyVisitMeta.advancedStreakToday && streakDays >= 2) {
                suffix =
                    streakDays >= 7
                        ? 'Week streak active.'
                        : 'Streak extended.';
            } else if (
                this.dailyVisitMeta.isReturnVisitToday &&
                visitsToday > 1
            ) {
                suffix = `Visit ${visitsToday} today.`;
            }

            this.elements.dailyStreak.textContent = `Daily streak: ${streakDays} ${dayLabel} · ${suffix}`;
        },

        maybeCelebrateDailyMilestone() {
            if (!this.dailyVisitMeta.advancedStreakToday) {
                return;
            }

            const milestoneMessages = {
                3: 'Daily streak 3: habit formed.',
                7: 'Daily streak 7: full week.',
                14: 'Daily streak 14: streak pro.',
            };

            const message = milestoneMessages[this.dailyEngagement.streakDays];
            if (message) {
                this.showToast(message);
            }
        },

        renderShuffleStreak() {
            if (!this.elements.shuffleStreak) return;
            if (this.shuffleStreak <= 0) {
                this.elements.shuffleStreak.textContent =
                    'Shuffle streak: 0 · Shuffle to begin.';
                this.renderShuffleBadges();
                return;
            }

            const nextMilestone =
                STREAK_MILESTONES.find(
                    (milestone) => milestone > this.shuffleStreak,
                ) || null;
            const suffix =
                this.shuffleStreak >= 8
                    ? 'Headline mode.'
                    : this.shuffleStreak >= 5
                      ? 'Strong run.'
                      : 'Nice pace.';
            const nextMilestoneText = nextMilestone
                ? `${nextMilestone - this.shuffleStreak} to badge ${nextMilestone}.`
                : 'Top badge unlocked.';
            this.elements.shuffleStreak.textContent = `Shuffle streak: ${this.shuffleStreak} · ${suffix} ${nextMilestoneText}`;
            this.renderShuffleBadges(nextMilestone);
        },

        renderShuffleBadges(nextMilestone = STREAK_MILESTONES[0]) {
            if (!this.elements.streakBadges) {
                return;
            }

            const badgeItems = Array.from(
                this.elements.streakBadges.querySelectorAll('[data-milestone]'),
            );
            badgeItems.forEach((badge) => {
                const milestone = Number.parseInt(
                    badge.dataset.milestone || '',
                    10,
                );
                if (!Number.isFinite(milestone)) {
                    return;
                }

                const isEarned = this.shuffleStreak >= milestone;
                const isNext = !isEarned && milestone === nextMilestone;
                const remaining = Math.max(milestone - this.shuffleStreak, 0);
                const label =
                    SHUFFLE_BADGE_LABELS[milestone] || `Badge ${milestone}`;
                const statusText = isEarned
                    ? `${label} badge unlocked at ${milestone} shuffles.`
                    : `${remaining} shuffles to unlock ${label} badge at ${milestone}.`;

                badge.classList.toggle('is-earned', isEarned);
                badge.classList.toggle('is-next', isNext);
                badge.setAttribute('aria-label', statusText);
                badge.setAttribute('title', statusText);
            });
        },

        updateShuffleStreak(shouldIncrement) {
            this.shuffleStreak = shouldIncrement ? this.shuffleStreak + 1 : 0;
            this.renderShuffleStreak();
            this.updateNextButtonLabel();
            if (shouldIncrement) {
                this.handleShuffleMilestone();
            } else {
                this.clearCelebration();
            }
        },

        handleShuffleMilestone() {
            const messages = {
                3: 'Shuffle streak 3: smooth run.',
                5: 'Shuffle streak 5: momentum unlocked.',
                8: 'Shuffle streak 8: headline mode.',
            };
            const message = messages[this.shuffleStreak];
            if (!message) {
                return;
            }

            this.showToast(message);
            this.triggerCelebration();
        },

        clearCelebration() {
            if (this.celebrationTimer) {
                window.clearTimeout(this.celebrationTimer);
                this.celebrationTimer = null;
            }
            this.elements.headlineSection?.classList.remove('is-celebrating');
        },

        triggerCelebration() {
            this.clearCelebration();
            this.elements.headlineSection?.classList.add('is-celebrating');
            this.celebrationTimer = window.setTimeout(() => {
                this.elements.headlineSection?.classList.remove(
                    'is-celebrating',
                );
                this.celebrationTimer = null;
            }, 900);
        },
    };
})();
