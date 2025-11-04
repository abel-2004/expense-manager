import { useState, useEffect, useCallback } from 'react';

const REMINDER_STORAGE_KEY = 'expense-manager-daily-reminder-enabled';
const REMINDER_HOUR = 19; // 7 PM

export const useNotifications = () => {
    const [isSupported, setIsSupported] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [isReminderEnabled, setIsReminderEnabled] = useState(false);

    useEffect(() => {
        if ('Notification' in window) {
            setIsSupported(true);
            setPermission(Notification.permission);
        }
        const storedPreference = localStorage.getItem(REMINDER_STORAGE_KEY) === 'true';
        setIsReminderEnabled(storedPreference);
    }, []);

    const toggleDailyReminder = useCallback(async () => {
        if (!isSupported) return;

        const newReminderState = !isReminderEnabled;

        if (newReminderState) { // Trying to enable
            if (permission === 'default') {
                const newPermission = await Notification.requestPermission();
                setPermission(newPermission);
                if (newPermission === 'granted') {
                    setIsReminderEnabled(true);
                    localStorage.setItem(REMINDER_STORAGE_KEY, 'true');
                }
            } else if (permission === 'granted') {
                setIsReminderEnabled(true);
                localStorage.setItem(REMINDER_STORAGE_KEY, 'true');
            } else {
                // Permission is denied, inform user.
                alert("Notification permission has been denied. Please enable it in your browser settings to use this feature.");
            }
        } else { // Disabling
            setIsReminderEnabled(false);
            localStorage.setItem(REMINDER_STORAGE_KEY, 'false');
        }
    }, [isSupported, permission, isReminderEnabled]);

    useEffect(() => {
        let timeoutId: number | undefined;

        const scheduleNotification = () => {
            const now = new Date();
            const nextNotificationTime = new Date();
            nextNotificationTime.setHours(REMINDER_HOUR, 0, 0, 0);

            if (now > nextNotificationTime) {
                // If it's past 7 PM today, schedule for tomorrow
                nextNotificationTime.setDate(nextNotificationTime.getDate() + 1);
            }

            const timeToNotification = nextNotificationTime.getTime() - now.getTime();

            timeoutId = window.setTimeout(() => {
                new Notification('Expense Manager', {
                    body: "Don't forget to log your expenses for today! 📝",
                    icon: '/vite.svg', // Assumes vite.svg is the app icon in public folder
                });
                // After notification, schedule the next one for 24 hours later
                timeoutId = window.setTimeout(scheduleNotification, 24 * 60 * 60 * 1000); 
            }, timeToNotification);
        };

        if (isSupported && permission === 'granted' && isReminderEnabled) {
            scheduleNotification();
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [isSupported, permission, isReminderEnabled]);

    return { isSupported, permission, isReminderEnabled, toggleDailyReminder };
};
