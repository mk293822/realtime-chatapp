import { useEventBus } from "@/EventBus";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import UserAvatar from "./UserAvatar";
import { Link } from "@inertiajs/react";

const NewMessageNotification = () => {
    const { on } = useEventBus();
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        on("NewMessageNotification", ({ message, user, group_id }) => {
            const uuid = v4();

            setToasts((old) => [...old, { message, uuid, user, group_id }]);

            setTimeout(() => {
                setToasts((old) => old.filter((toast) => toast.uuid !== uuid));
            }, 5000);
        });
    }, [on]);

    return (
        <div className="toast toast-top toast-start min-w-[280px] z-[100]">
            {toasts.map((toast, index) => (
                <div
                    key={toast.uuid}
                    className="alert alert-success py-3 px-3 text-gray-100 rounded-lg "
                >
                    <Link
                        href={
                            toast.group_id
                                ? route("chat.group", toast.group_id)
                                : route("chat.user", toast.user.id)
                        }
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <UserAvatar user={toast.user} />
                        <span>{toast.message}</span>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default NewMessageNotification;
