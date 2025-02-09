import NewMessageNotification from "@/Components/App/NewMessageNotification";
import Toast from "@/Components/App/Toast";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { useEventBus } from "@/EventBus";
import { Link, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import {
    PencilSquareIcon,
    UserPlusIcon,
} from "@heroicons/react/20/solid/index.js";
import PrimaryButton from "@/Components/PrimaryButton";
import NewUserModal from "@/Components/App/UserModal";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const page = usePage();
    const conversations = page.props.conversations;
    const [showNewUserModal, setShowUserModal] = useState(false);
    const { emit } = useEventBus();

    useEffect(() => {
        conversations.forEach((conversation) => {
            let channel = `message.group.${conversation.id}`;

            if (conversation.is_user) {
                channel = `message.user.${[
                    parseInt(user.id),
                    parseInt(conversation.id),
                ]
                    .sort((a, b) => a - b)
                    .join("-")}`;
            }

            Echo.private(channel)
                .error((error) => {
                    console.log(error);
                })
                .listen("SocketMessage", (e) => {
                    const message = e.message;
                    const status = e.status;
                    const preMessage = e.preMessage ? e.preMessage : null;
                    if (status === "send") {
                        emit("message.created", message);
                    } else if (status === "delete") {
                        emit("message.deleted", {
                            message: message,
                            preMessage: preMessage,
                        });
                    }

                    if (message.sender_id === user.id) {
                        return;
                    }

                    if (status === "send") {
                        emit("NewMessageNotification", {
                            user: message.sender,
                            group_id: message.group_id,
                            message:
                                message.message ||
                                `Shared ${
                                    message.attachments === 1
                                        ? "an attachment"
                                        : message.attachments.length +
                                          " attachments"
                                }`,
                        });
                    }
                });

            if (conversation.is_group) {
                Echo.private(`group.deleted.${conversation.id}`)
                    .listen("GroupDeleted", (e) => {
                        emit("group.deleted", { id: e.id, name: e.name });
                    })
                    .error((e) => {
                        console.error(e);
                    });
            }
        });

        return () => {
            conversations.forEach((conversation) => {
                let channel = `message.group.${conversation.id}`;

                if (conversation.is_user) {
                    channel = `message.user.${[
                        parseInt(user.id),
                        parseInt(conversation.id),
                    ]
                        .sort((a, b) => a - b)
                        .join("-")}`;
                }

                Echo.leave(channel);

                if (conversation.is_group) {
                    Echo.leave(`group.deleted.${conversation.id}`);
                }
            });
        };
    }, [conversations]);

    return (
        <>
            <div className="min-h-screen bg-gray-100 flex flex-col dark:bg-gray-900 h-screen">
                <nav className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex p-0">
                                <Link
                                    href="/"
                                    className="text-xl w-full font-bold p-4 hover:bg-white/5 rounded-full transition-all"
                                >
                                    Messenger
                                </Link>
                            </div>

                            <div className="flex items-center justify-center">
                                <div className="relative">
                                    <span className="inline-flex rounded-md">
                                        {user.is_admin && (
                                            <button
                                                onClick={() =>
                                                    setShowGroupModal(true)
                                                }
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                            >
                                                <PencilSquareIcon className="w-5 h-5 items-center" />
                                            </button>
                                        )}
                                    </span>
                                </div>
                                <div className="relative">
                                    <span className="inline-flex rounded-md">
                                        {user.is_admin && (
                                            <button
                                                onClick={() =>
                                                    setShowUserModal(true)
                                                }
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                            >
                                                <UserPlusIcon className="h-5 w-5 items-center" />
                                            </button>
                                        )}
                                    </span>
                                </div>
                                <div className="relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                                >
                                                    {user.name}

                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link
                                                href={route("profile.edit")}
                                            >
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {children}
            </div>
            <Toast />
            <NewMessageNotification />
            <NewUserModal
                show={showNewUserModal}
                onClose={() => setShowUserModal(false)}
            />
        </>
    );
}
