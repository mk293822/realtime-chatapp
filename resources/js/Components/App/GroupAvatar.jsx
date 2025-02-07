import { UserGroupIcon } from "@heroicons/react/20/solid";
import React from "react";

const GroupAvatar = () => {
    return (
        <div>
            <div className="avatar placeholder">
                <div className="bg-gray-400 text-gray-800 rounded-full w-8">
                    <span className="text-xl text-center px-auto">
                        <UserGroupIcon className="w-4" />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default GroupAvatar;
