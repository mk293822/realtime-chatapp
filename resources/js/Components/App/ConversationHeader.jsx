import {
    ArrowLeftIcon,
    PencilSquareIcon,
    TrashIcon,
    UserGroupIcon,
} from "@heroicons/react/20/solid";
import { Link, usePage } from "@inertiajs/react";
import React from "react";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import GroupDescriptionPopover from "./GroupDescriptionPopover";
import GroupUserPopover from "./GroupUserPopover";
import { useEventBus } from "@/EventBus";
import axios from "axios";

const ConversationHeader = ({ selectedConversation }) => {
    const page = usePage();

    const authUser = page.props.auth.user;

    const { emit } = useEventBus();

    const onDeleteGroup = (e) => {
        if (!window.confirm("Are you sure you want to delete this group?")) {
            return;
        }

        axios
            .delete(route("group.destroy", selectedConversation.id))
            .then((res) => {
                emit("toast.show", res.data.message)
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            {selectedConversation && (
                <div className="p-3 flex justify-between items-center border-b border-slate-700 shadow-xl">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("dashboard")}
                            className="inline-block sm:hidden"
                        >
                            <ArrowLeftIcon className="w-6" />
                        </Link>
                        {selectedConversation.is_user && (
                            <UserAvatar user={selectedConversation} />
                        )}
                        {selectedConversation.is_group && (
                            <div className="flex gap-4 items-center justify-center">
                                <GroupAvatar />
                                <div>
                                    <h3>{selectedConversation.name}</h3>
                                    {selectedConversation.is_group && (
                                        <p className="text-xs text-gray-500">
                                            {selectedConversation.users.length}{" "}
                                            members
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                        <p>
                            {selectedConversation.is_user &&
                                selectedConversation.name}
                        </p>
                    </div>
                    {selectedConversation.is_group && (
                        <div className="flex gap-3">
                            <GroupDescriptionPopover
                                description={selectedConversation.description}
                            />
                            <GroupUserPopover
                                users={selectedConversation.users}
                            />
                            {selectedConversation.owner_id == authUser.id && (
                                <>
                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip="Edit Group"
                                    >
                                        <button
                                            onClick={(e) =>
                                                emit(
                                                    "GroupModal.show",
                                                    selectedConversation
                                                )
                                            }
                                            className="text-gray-400 hover:text-gray-200"
                                        >
                                            <PencilSquareIcon className="w-4" />
                                        </button>
                                    </div>
                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip="Delete Group"
                                    >
                                        <button
                                            onClick={onDeleteGroup}
                                            className="text-gray-400 hover:text-gray-200"
                                        >
                                            <TrashIcon className="w-4" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ConversationHeader;
