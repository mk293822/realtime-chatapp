import { ArrowLeftIcon, UserGroupIcon } from "@heroicons/react/20/solid";
import { Link } from "@inertiajs/react";
import React from "react";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";

const ConversationHeader = ({ selectedConversation }) => {
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
                </div>
            )}
        </>
    );
};

export default ConversationHeader;
