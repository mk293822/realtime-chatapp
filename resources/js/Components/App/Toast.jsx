import { useEventBus } from "@/EventBus";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

const Toast = () => {
    const { on } = useEventBus();
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        on("toast.show", (message) => {
            const uuid = v4();

            setToasts((old) => [...old, { message, uuid }]);

            setTimeout(() => {
                setToasts((old) => old.filter((toast) => toast.uuid !== uuid));
            }, 3000);
        });
    }, [on]);

    return (
        <div className="toast min-w-[280px]">
            {toasts.map((toast, index) => (
                <div
                    key={toast.uuid}
                    className="alert alert-success py-3 px-3 text-gray-100 rounded-lg "
                >
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
};

export default Toast;
