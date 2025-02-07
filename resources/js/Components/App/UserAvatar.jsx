import React from "react";

const UserAvatar = ({ user, online = null, profile = false }) => {
    let onlineClass =
        online === true ? " online " : online === false ? " offline " : "";

    const sizeClass = profile ? " w-40 " : " w-8 ";

    if (user.avatar_url) {
        return (
            <div className={`chat-image avatar  ${onlineClass}`}>
                <div className={`rounded-full  ${sizeClass}`}>
                    <img src={user.avatar_url} />
                </div>
            </div>
        );
    } else if (!user.avatar_url) {
        return (
            <div className={`chat-image avatar placeholder ${onlineClass}`}>
                <div
                    className={`bg-gray-400 text-gray-800 rounded-full ${sizeClass}}`}
                >
                    <span className="text-xl text-center">
                        {user.name.charAt(0)}
                    </span>
                </div>
            </div>
        );
    }
};

export default UserAvatar;
