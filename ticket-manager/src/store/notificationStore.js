import { create } from "zustand";


const useNotificationStore = create((set) => ({

    notifications: [],


    addNotification: (notification) =>
        set(state => ({
            notifications: [
                {
                    id: crypto.randomUUID(),
                    ...notification,
                    createdAt: new Date()
                },
                ...state.notifications
            ]
        })),


    removeNotification: (id) =>
        set(state => ({
            notifications:
                state.notifications.filter(
                    x => x.id !== id
                )
        })),


    clear: () =>
        set({
            notifications: []
        })

}));


export default useNotificationStore;